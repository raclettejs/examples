import type { WidgetDeclaration } from "@raclettejs/raclette-core"

export const details = {
  pluginName: "todo",
  author: "pacifico",
  title: "Pacifico Todo App",
  color: "#6CB5D1",
  icon: new URL("./icon.svg", import.meta.url).href,
  images: [new URL("./screenshot.png", import.meta.url).href],
  description:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  widgetName: "todoApp",
} satisfies WidgetDeclaration
const config = {}

export default {
  config,
  details,
}
