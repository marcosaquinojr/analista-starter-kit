import { Node, mergeAttributes } from "@tiptap/core";
import type { DOMOutputSpec } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import HtmlBlockView from "./HtmlBlockView";

/* ── Callout (destaque colorido) ── */
const CalloutLabel = Node.create({
  name: "calloutLabel",
  content: "inline*",
  defining: true,
  selectable: false,
  parseHTML: () => [{ tag: "div.callout-label" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { class: "callout-label" }),
    0,
  ],
});

const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "calloutLabel? block+",
  defining: true,
  addAttributes() {
    return {
      variant: {
        default: "default",
        parseHTML: (el) => {
          const c = (el as HTMLElement).className;
          if (c.includes("warn")) return "warn";
          if (c.includes("bad")) return "bad";
          if (c.includes("good")) return "good";
          return "default";
        },
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML: () => [{ tag: "div.callout" }],
  renderHTML: ({ node, HTMLAttributes }) => {
    const v = node.attrs.variant as string;
    const cls = v && v !== "default" ? `callout ${v}` : "callout";
    return ["div", mergeAttributes(HTMLAttributes, { class: cls }), 0];
  },
});

/* ── Cards (grade de cartões) ── */
const CardTitle = Node.create({
  name: "cardTitle",
  content: "inline*",
  defining: true,
  selectable: false,
  parseHTML: () => [{ tag: "div.card-title" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { class: "card-title" }),
    0,
  ],
});

const CardDesc = Node.create({
  name: "cardDesc",
  content: "inline*",
  defining: true,
  selectable: false,
  parseHTML: () => [{ tag: "div.card-desc" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { class: "card-desc" }),
    0,
  ],
});

const Card = Node.create({
  name: "card",
  content: "cardTitle cardDesc",
  defining: true,
  parseHTML: () => [{ tag: "div.card" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { class: "card" }),
    0,
  ],
});

const CardGrid = Node.create({
  name: "cardGrid",
  group: "block",
  content: "card+",
  parseHTML: () => [{ tag: "div.cards" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { class: "cards" }),
    0,
  ],
});

/* ── Bloco rico preservado (glossário, processo, FAQ, etc.) ── */
const HtmlBlock = Node.create({
  name: "htmlBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: false,
  addAttributes() {
    return {
      html: {
        default: "",
        parseHTML: (el) => (el as HTMLElement).outerHTML,
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [
      { tag: "div.glossary", priority: 60 },
      { tag: "div.process", priority: 60 },
      { tag: "div.faq-item", priority: 60 },
    ];
  },
  renderHTML({ node }) {
    const html = (node.attrs.html as string) || "";
    if (typeof document === "undefined") {
      return ["div", { class: "html-block-fallback" }] as DOMOutputSpec;
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const el = wrapper.firstElementChild ?? wrapper;
    return el as unknown as DOMOutputSpec;
  },
  addNodeView() {
    return ReactNodeViewRenderer(HtmlBlockView);
  },
});

export function buildExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: { openOnClick: false },
    }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Callout,
    CalloutLabel,
    CardGrid,
    Card,
    CardTitle,
    CardDesc,
    HtmlBlock,
  ];
}
