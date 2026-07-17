/**
 * remark-captions — Auto-numbered figure/table captions and cross-references.
 *
 * Syntax
 * ------
 *   Images:   ![Caption text](image-url) {#fig:my-label}
 *   Tables:   | … | … |\n| … | … |\n\nTable: Caption text {#tbl:my-label}
 *   Refs:     {@fig:my-label}   {@tbl:my-label}
 *
 * Output
 * ------
 *   Figures become <figure id="fig:my-label">
 *                <img …><figcaption>Figure N: Caption text</figcaption></figure>
 *   Refs become <a href="#fig:my-label" class="ref">Figure N</a>
 *
 * Label scoping: per-file (numbers reset between files).
 * Errors:  duplicate label → first occurrence wins (warning)
 *          missing ref   → renders [Unknown "key"]  (warning)
 */

import { visit } from "unist-util-visit";

/**
 * @param {object} [options]
 * @param {boolean} [options.warn=true]
 * @returns {(tree: import('mdast').Root, file: import('vfile').VFile) => void}
 */
export default function remarkCaptions(options) {
  const warn = options?.warn ?? true;

  return (tree, file) => {
    /** @type {{fig: number, tbl: number}} */
    const counters = { fig: 0, tbl: 0 };

    /** @type {Record<string, {type: 'fig'|'tbl', num: number, id: string}>} */
    const labels = {};

    // ── helpers ──────────────────────────────────────────────────────────
    function registerLabel(type, id) {
      const key = `${type}:${id}`;
      if (labels[key]) {
        if (warn) file?.message(`Duplicate label "${key}" — keeping first occurrence`);
        return labels[key];
      }
      counters[type]++;
      const label = { type: /** @type {'fig'|'tbl'} */ (type), num: counters[type], id };
      labels[key] = label;
      return label;
    }

    function getLabel(key) {
      return labels[key];
    }

    const LABEL_RE = /^[\s]*\{#(fig|tbl):([\w-]+)\}[\s]*$/;
    const TABLE_CAPTION_RE = /^Table:\s*(.+?)\s*\{#(tbl):([\w-]+)\}\s*$/;
    const REF_RE = /\{@(fig|tbl):([\w-]+)\}/g;

    // ────────────────────────────────────────────────────────────────────
    // Pass 1 — collect all labels
    // ────────────────────────────────────────────────────────────────────

    // 1a. Figure labels (image + text node in same paragraph)
    visit(tree, "paragraph", (node) => {
      const img = node.children.find((c) => c.type === "image");
      if (!img) return;
      const last = node.children[node.children.length - 1];
      if (!last || last.type !== "text") return;
      const m = last.value.match(LABEL_RE);
      if (m) registerLabel(m[1], m[2]);
    });

    // 1b. Table labels (paragraph right after a table)
    visit(tree, "paragraph", (_node, idx, parent) => {
      if (!parent || idx === 0) return;
      if (parent.children[idx - 1]?.type !== "table") return;
      const text = _node.children[0]?.value || "";
      const m = text.match(TABLE_CAPTION_RE);
      if (m) registerLabel("tbl", m[3]);
    });

    // ────────────────────────────────────────────────────────────────────
    // Pass 2 — transform labelled images into <figure> elements &
    //          remove / inject table captions
    // ────────────────────────────────────────────────────────────────────

    /** @type {Array<{parent: object, index: number, action: 'replace'|'remove'|'insert', node?: object}>} */
    const nodeTransforms = [];

    visit(tree, "paragraph", (_node, idx, parent) => {
      if (!parent) return;

      // ---- Figure ----
      const img = _node.children.find((c) => c.type === "image");
      if (img) {
        const last = _node.children[_node.children.length - 1];
        if (last?.type === "text") {
          const m = last.value.match(LABEL_RE);
          if (m) {
            const label = getLabel(`${m[1]}:${m[2]}`);
            if (label) {
              const caption = img.alt || "";
              const typeLabel = m[1] === "fig" ? "Figure" : "Table";
              const escapedAlt = caption.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
              const html =
                `<figure id="${m[1]}:${m[2]}">` +
                `<img src="${img.url}" alt="${escapedAlt}" />` +
                `<figcaption>${typeLabel} ${label.num}: ${escapedAlt}</figcaption>` +
                `</figure>`;
              nodeTransforms.push({ parent, index: idx, action: "replace", node: { type: "html", value: html } });
            }
          }
        }
      }

      // ---- Table caption ----
      if (idx > 0 && parent.children[idx - 1]?.type === "table") {
        const text = _node.children[0]?.value || "";
        const m = text.match(TABLE_CAPTION_RE);
        if (m) {
          const label = getLabel(`tbl:${m[2]}`);
          if (label) {
            const captionHtml = `<figcaption>Table ${label.num}: ${m[1]}</figcaption>`;
            // Remove the caption paragraph, then insert a figcaption sibling
            nodeTransforms.push({ parent, index: idx, action: "remove" });
            nodeTransforms.push({ parent, index: idx, action: "insert", node: { type: "html", value: captionHtml } });
          }
        }
      }
    });

    // Apply in reverse index order so earlier indices stay valid
    nodeTransforms.sort((a, b) => b.index - a.index);
    for (const t of nodeTransforms) {
      if (t.action === "replace") {
        t.parent.children[t.index] = t.node;
      } else if (t.action === "remove") {
        t.parent.children.splice(t.index, 1);
      } else if (t.action === "insert") {
        t.parent.children.splice(t.index, 0, t.node);
      }
    }

    // ────────────────────────────────────────────────────────────────────
    // Pass 3 — transform inline references {@fig:key} / {@tbl:key}
    // ────────────────────────────────────────────────────────────────────

    /** @type {Array<{parent: object, index: number, nodes: object[]}>} */
    const refTransforms = [];

    visit(tree, "text", (node, idx, parent) => {
      if (!parent) return;
      let m;
      let lastIdx = 0;
      /** @type {object[]} */
      const parts = [];

      // Reset regex state
      REF_RE.lastIndex = 0;

      while ((m = REF_RE.exec(node.value)) !== null) {
        // Text before this match
        if (m.index > lastIdx) {
          parts.push({ type: "text", value: node.value.slice(lastIdx, m.index) });
        }
        const labelKey = `${m[1]}:${m[2]}`;
        const label = getLabel(labelKey);
        if (label) {
          const typeLabel = m[1] === "fig" ? "Figure" : "Table";
          parts.push({
            type: "html",
            value: `<a href="#${labelKey}" class="ref">${typeLabel} ${label.num}</a>`,
          });
        } else {
          if (warn) file?.message(`Unknown reference "${labelKey}"`);
          parts.push({
            type: "html",
            value: `<span class="ref-unknown" title="Unknown reference">[Unknown &quot;${labelKey}&quot;]</span>`,
          });
        }
        lastIdx = m.index + m[0].length;
      }

      if (parts.length === 0) return;

      // Remaining text after last match
      if (lastIdx < node.value.length) {
        parts.push({ type: "text", value: node.value.slice(lastIdx) });
      }

      refTransforms.push({ parent, index: idx, nodes: parts });
    });

    // Apply in reverse index order
    refTransforms.sort((a, b) => b.index - a.index);
    for (const t of refTransforms) {
      t.parent.children.splice(t.index, 1, ...t.nodes);
    }
  };
}