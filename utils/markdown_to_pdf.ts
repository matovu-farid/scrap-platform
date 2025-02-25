"use server";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeFormat from "rehype-format";
import HTMLtoDOCX from "@turbodocx/html-to-docx";

export async function markdownToHtml(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown);
  return file.toString();
}

export async function downloadDocx(html: string): Promise<string> {
  const buffer = await HTMLtoDOCX(html, "<p></p>");
  const base64 = buffer.toString("base64");
  return base64;
}
