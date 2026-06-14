import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import type { QuartzPluginData } from "./quartz/plugins/vfile"
import { componentRegistry } from "./quartz/components/registry"
import type { QuartzComponentConstructor } from "./quartz/components/types"
import ConditionalRender from "./quartz/components/ConditionalRender"
import DesktopOnly from "./quartz/components/DesktopOnly"
import MobileOnly from "./quartz/components/MobileOnly"
import ResponsiveToc from "./quartz/components/ResponsiveToc"
import { socialImage } from "./quartz/components/SocialImage"

const isIndex = (props: { fileData: QuartzPluginData }) => props.fileData.slug === "index"
registerCondition("index-only", isIndex)
componentRegistry.setOptionOverrides("og-image", {
  imageStructure: socialImage,
  defaultDescription: "",
})

const recentNotesOptions = {
  title: "最近更新したノート",
  limit: 5,
  linkToMore: "all-pages",
  showTags: false,
  hideTagPages: true,
  hideFolderPages: true,
  filter: (page: QuartzPluginData) =>
    typeof page.filePath === "string" &&
    page.filePath.endsWith(".md") &&
    page.slug !== "index" &&
    page.slug !== "all-pages",
}

type LoadedLayout = Awaited<ReturnType<typeof loadQuartzLayout>>

function customizeLayout(loadedLayout: LoadedLayout): LoadedLayout {
  const recentNotesRegistration =
    componentRegistry.get("recent-notes") ?? componentRegistry.get("RecentNotes")
  if (!recentNotesRegistration) {
    throw new Error("Recent Notes component is not registered")
  }

  const recentNotesComponent = componentRegistry.instantiate(
    recentNotesRegistration.component as QuartzComponentConstructor<Record<string, unknown>>,
    recentNotesOptions,
  )
  const recentNotes = ConditionalRender({
    component: recentNotesComponent,
    condition: isIndex,
  })
  const desktopRecentNotes = DesktopOnly(recentNotes)
  const mobileRecentNotes = MobileOnly(recentNotes)
  const responsiveToc = ResponsiveToc()

  loadedLayout.defaults.left = [
    ...(loadedLayout.defaults.left ?? []),
    desktopRecentNotes,
    responsiveToc,
  ]
  loadedLayout.defaults.afterBody = [...(loadedLayout.defaults.afterBody ?? []), mobileRecentNotes]
  for (const pageLayout of Object.values(loadedLayout.byPageType)) {
    pageLayout.left = [...(pageLayout.left ?? []), desktopRecentNotes, responsiveToc]
    pageLayout.afterBody = [...(pageLayout.afterBody ?? []), mobileRecentNotes]
  }

  return loadedLayout
}

let configuredLayout: LoadedLayout | undefined
const config = await loadQuartzConfig(undefined, (loadedLayout) => {
  configuredLayout = customizeLayout(loadedLayout)
  return configuredLayout
})

export default config
export const layout = configuredLayout ?? customizeLayout(await loadQuartzLayout())
