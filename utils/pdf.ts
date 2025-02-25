"client-only";

import * as html2pdf from "html2pdf.js";

import { markdownToHtml } from "./markdown_to_pdf";
import "jspdf/dist/polyfills.es.js";

export async function createMarkup(memoir: string) {
  const html = await markdownToHtml(memoir);
  const element = document.createElement("div");

  element.classList.add("prose", "lg:prose-lg");
  element.innerHTML = html;
  return element;
}
export async function createPdf(memoir: string) {
  const element = await createMarkup(memoir);
  const opt = {
    margin: 10,
    filename: "memoir.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    // jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    pagebreak: {
      mode: ["avoid-all"],
    },
  };

  return html2pdf()
    .set(opt)
    .from(element)
    .output("bloburl")
    .then((blobUrl: string) => {
      return fetch(blobUrl).then((res) => res.blob());
    });
}
export async function downloadPdf(data: string) {
  const element = await createMarkup(data);
  const opt = {
    margin: 10,
    filename: "results.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    // jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    pagebreak: {
      mode: ["avoid-all"],
    },
  };

  const pdf = html2pdf().set(opt).from(element).outputPdf();
  console.log(JSON.stringify(pdf));

  pdf.save();
}
