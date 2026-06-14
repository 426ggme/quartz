import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import type { QuartzPluginData } from "./quartz/plugins/vfile"
import ConditionalRender from "./quartz/components/ConditionalRender"
import MobileOnly from "./quartz/components/MobileOnly"
import ResponsiveToc from "./quartz/components/ResponsiveToc"
import RecentNotesComponent from "./.quartz/plugins/recent-notes/src/components/RecentNotes"
import * as ExternalPlugin from "./.quartz/plugins"

const isIndex = (props: { fileData: QuartzPluginData }) => props.fileData.slug === "index"
registerCondition("index-only", isIndex)

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

ExternalPlugin.RecentNotes(recentNotesOptions)

const config = await loadQuartzConfig()
export default config

const loadedLayout = await loadQuartzLayout()
const responsiveToc = ResponsiveToc(undefined)
const mobileRecentNotes = MobileOnly(
  ConditionalRender({
    component: RecentNotesComponent(recentNotesOptions),
    condition: isIndex,
  }),
)

loadedLayout.defaults.left = [...(loadedLayout.defaults.left ?? []), responsiveToc]
loadedLayout.defaults.afterBody = [...(loadedLayout.defaults.afterBody ?? []), mobileRecentNotes]
for (const pageLayout of Object.values(loadedLayout.byPageType)) {
  pageLayout.left = [...(pageLayout.left ?? []), responsiveToc]
  pageLayout.afterBody = [...(pageLayout.afterBody ?? []), mobileRecentNotes]
}
export const layout = loadedLayout
