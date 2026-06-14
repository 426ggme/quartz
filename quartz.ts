import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import type { QuartzPluginData } from "./quartz/plugins/vfile"
import ResponsiveToc from "./quartz/components/ResponsiveToc"
import * as ExternalPlugin from "./.quartz/plugins"

registerCondition("index-only", (props) => props.fileData.slug === "index")

ExternalPlugin.RecentNotes({
  filter: (page: QuartzPluginData) =>
    typeof page.filePath === "string" &&
    page.filePath.endsWith(".md") &&
    page.slug !== "index" &&
    page.slug !== "all-pages",
})

const config = await loadQuartzConfig()
export default config

const loadedLayout = await loadQuartzLayout()
const responsiveToc = ResponsiveToc(undefined)
loadedLayout.defaults.left = [...(loadedLayout.defaults.left ?? []), responsiveToc]
for (const pageLayout of Object.values(loadedLayout.byPageType)) {
  pageLayout.left = [...(pageLayout.left ?? []), responsiveToc]
}
export const layout = loadedLayout
