import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import type { QuartzPluginData } from "./quartz/plugins/vfile"
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
export const layout = await loadQuartzLayout()
