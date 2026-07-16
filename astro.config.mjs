import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that adds target="_blank" and rel="noopener noreferrer"
 * to every link rendered from markdown content.
 */
function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "a" && node.properties?.href) {
        node.properties.target = "_blank";
        node.properties.rel = "noopener noreferrer";
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: "https://nievespg1.github.io",
  base: "/nievespg",
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    rehypePlugins: [rehypeExternalLinks],
  },
});