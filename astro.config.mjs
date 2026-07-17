import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { visit } from "unist-util-visit";
import remarkCaptions from "./src/plugins/remark-captions.mjs";

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
  site: "https://nievespg.com",
  base: "/",
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    remarkPlugins: [remarkCaptions],
    rehypePlugins: [rehypeExternalLinks],
  },
});