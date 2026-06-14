import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import YAML from "yaml"

const [, , sourceArg, destinationArg] = process.argv

if (!sourceArg || !destinationArg) {
  console.error("Usage: node scripts/sync-content.mjs <vault-public> <quartz-content>")
  process.exit(1)
}

const sourceRoot = path.resolve(sourceArg)
const destinationRoot = path.resolve(destinationArg)
const temporaryRoot = `${destinationRoot}.sync-${process.pid}`
const excludedNames = new Set([".DS_Store", ".git", ".obsidian", ".trash", "node_modules"])
const uuidLikeName = /^\d{14}$/

function toPosix(value) {
  return value.split(path.sep).join("/")
}

function slugifySegment(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/&/g, "-and-")
    .replace(/%/g, "-percent")
    .replace(/[?#/\\]/g, "")
}

function parseMarkdown(value, relativePath) {
  const match = value.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) {
    return { frontmatter: {}, body: value, hasFrontmatter: false }
  }

  const parsed = YAML.parse(match[1]) ?? {}
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${relativePath}: frontmatter must be a YAML object`)
  }

  return {
    frontmatter: parsed,
    body: value.slice(match[0].length),
    hasFrontmatter: true,
  }
}

function serializeMarkdown(frontmatter, body) {
  const yaml = YAML.stringify(frontmatter, { lineWidth: 0 }).trimEnd()
  return `---\n${yaml}\n---\n\n${body.replace(/^\s+/, "")}`
}

function addAlias(frontmatter, alias) {
  const current = frontmatter.aliases ?? frontmatter.alias
  const aliases = Array.isArray(current) ? current.map(String) : current ? [String(current)] : []
  if (!aliases.includes(alias)) aliases.push(alias)
  delete frontmatter.alias
  frontmatter.aliases = aliases
}

async function collectFiles(root, relativeDirectory = "") {
  const directory = path.join(root, relativeDirectory)
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (excludedNames.has(entry.name)) continue
    const relativePath = path.join(relativeDirectory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(root, relativePath)))
    } else if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files
}

function rewriteWikilinks(body, targets) {
  return body.replace(
    /(!?\[\[)([^\]|#]+)(#[^\]|]+)?(\|[^\]]+)?(\]\])/g,
    (match, open, target, anchor = "", label = "", close) => {
      const normalizedTarget = toPosix(target.trim()).replace(/\.md$/i, "")
      const replacement =
        targets.get(normalizedTarget) ?? targets.get(path.posix.basename(normalizedTarget))
      if (!replacement) return match
      return `${open}${replacement}${anchor}${label}${close}`
    },
  )
}

async function main() {
  const files = await collectFiles(sourceRoot)
  const markdownFiles = []
  const targetOwners = new Map()
  const linkTargets = new Map()

  for (const relativePath of files) {
    if (path.extname(relativePath).toLowerCase() !== ".md") continue

    const source = await fs.readFile(path.join(sourceRoot, relativePath), "utf8")
    const parsed = parseMarkdown(source, relativePath)
    const extension = path.extname(relativePath)
    const sourceStem = path.basename(relativePath, extension)
    const sourceDirectory = path.dirname(relativePath)
    let outputRelativePath = relativePath

    if (uuidLikeName.test(sourceStem)) {
      const title =
        typeof parsed.frontmatter.title === "string" ? parsed.frontmatter.title.trim() : ""
      if (!title) {
        throw new Error(`${relativePath}: UUID-style notes require a non-empty frontmatter title`)
      }

      const requestedSlug =
        typeof parsed.frontmatter.slug === "string" ? parsed.frontmatter.slug.trim() : title
      const titleSlug = slugifySegment(requestedSlug)
      if (!titleSlug) {
        throw new Error(`${relativePath}: title or slug does not produce a usable slug`)
      }

      outputRelativePath = path.join(sourceDirectory, `${titleSlug}.md`)
      addAlias(parsed.frontmatter, sourceStem)

      const sourceTarget = toPosix(relativePath.slice(0, -extension.length))
      const outputTarget = toPosix(outputRelativePath.slice(0, -extension.length))
      linkTargets.set(sourceTarget, outputTarget)
      linkTargets.set(sourceStem, outputTarget)
    }

    const outputKey = toPosix(outputRelativePath).toLowerCase()
    const existingOwner = targetOwners.get(outputKey)
    if (existingOwner) {
      throw new Error(
        `Slug collision: ${existingOwner} and ${relativePath} both produce ${toPosix(outputRelativePath)}`,
      )
    }

    targetOwners.set(outputKey, relativePath)
    markdownFiles.push({ relativePath, outputRelativePath, parsed })
  }

  await fs.rm(temporaryRoot, { recursive: true, force: true })
  await fs.mkdir(temporaryRoot, { recursive: true })

  try {
    for (const relativePath of files) {
      if (path.extname(relativePath).toLowerCase() === ".md") continue
      const destination = path.join(temporaryRoot, relativePath)
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.copyFile(path.join(sourceRoot, relativePath), destination)
    }

    for (const file of markdownFiles) {
      const destination = path.join(temporaryRoot, file.outputRelativePath)
      const rewrittenBody = rewriteWikilinks(file.parsed.body, linkTargets)
      const output = file.parsed.hasFrontmatter
        ? serializeMarkdown(file.parsed.frontmatter, rewrittenBody)
        : rewrittenBody

      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.writeFile(destination, output)
    }

    await fs.rm(destinationRoot, { recursive: true, force: true })
    await fs.rename(temporaryRoot, destinationRoot)
  } catch (error) {
    await fs.rm(temporaryRoot, { recursive: true, force: true })
    throw error
  }

  const renamedCount = markdownFiles.filter(
    (file) => file.relativePath !== file.outputRelativePath,
  ).length
  console.log(
    `Synced ${files.length} files from ${sourceRoot} (${renamedCount} UUID-style notes use title slugs)`,
  )
}

main().catch((error) => {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
