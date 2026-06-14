import type { QuartzComponent, QuartzComponentConstructor } from "./types"

const ResponsiveToc: QuartzComponent = () => null

ResponsiveToc.afterDOMLoaded = `
function setResponsiveLayout() {
  document.querySelectorAll(".sidebar.left > .graph").forEach((graph) => {
    const rightSidebar = document.querySelector(".sidebar.right")
    if (rightSidebar) rightSidebar.prepend(graph)
  })
}

document.addEventListener("nav", setResponsiveLayout)
document.addEventListener("render", setResponsiveLayout)
setResponsiveLayout()
`

export default (() => ResponsiveToc) satisfies QuartzComponentConstructor
