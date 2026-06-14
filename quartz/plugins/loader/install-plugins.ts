#!/usr/bin/env node
import fs from "fs"
import path from "path"
import YAML from "yaml"
import { installPlugins, parsePluginSource } from "./gitLoader.js"
import type { QuartzPluginsJson } from "./types.js"

async function main() {
  const configPath = path.join(process.cwd(), "quartz.config.yaml")
  if (!fs.existsSync(configPath)) {
    console.error(`Plugin config not found: ${configPath}`)
    process.exit(1)
  }

  const config = YAML.parse(fs.readFileSync(configPath, "utf-8")) as QuartzPluginsJson
  const externalPlugins = config.plugins
    .filter((plugin) => plugin.enabled)
    .map((plugin) => plugin.source)

  if (externalPlugins.length === 0) {
    console.log("No external plugins to install.")
    return
  }

  console.log(`Installing ${externalPlugins.length} plugin(s) from Git...`)

  const specs = externalPlugins.map((source) => parsePluginSource(source))
  const installed = await installPlugins(specs, { verbose: true })

  if (installed.size === externalPlugins.length) {
    console.log("✓ All plugins installed successfully")
  } else {
    console.error(`✗ Only ${installed.size}/${externalPlugins.length} plugins installed`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Failed to install plugins:", err)
  process.exit(1)
})
