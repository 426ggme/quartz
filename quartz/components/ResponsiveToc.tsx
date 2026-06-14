import type { QuartzComponent, QuartzComponentConstructor } from "./types"

const ResponsiveToc: QuartzComponent = () => null

ResponsiveToc.afterDOMLoaded = `
const mobileLayoutQuery = window.matchMedia("(max-width: 800px)")

function setResponsiveLayout() {
  document.querySelectorAll(".sidebar.left > .graph").forEach((graph) => {
    const rightSidebar = document.querySelector(".sidebar.right")
    if (rightSidebar) rightSidebar.prepend(graph)
  })

  if (document.body.dataset.slug !== "index") return

  const recentNotes = document.querySelector(".recent-notes")
  const leftSidebar = document.querySelector(".sidebar.left")
  const pageFooter = document.querySelector(".center .page-footer")
  if (!(recentNotes instanceof HTMLElement) || !leftSidebar || !pageFooter) return

  let marker = leftSidebar.querySelector("[data-recent-notes-marker]")
  if (!marker) {
    marker = document.createElement("span")
    marker.setAttribute("data-recent-notes-marker", "")
    marker.setAttribute("hidden", "")
    leftSidebar.insertBefore(marker, recentNotes)
  }

  if (mobileLayoutQuery.matches) {
    pageFooter.append(recentNotes)
  } else {
    marker.after(recentNotes)
  }
}

document.addEventListener("nav", setResponsiveLayout)
document.addEventListener("render", setResponsiveLayout)
mobileLayoutQuery.addEventListener("change", setResponsiveLayout)
setResponsiveLayout()
`

export default (() => ResponsiveToc) satisfies QuartzComponentConstructor
