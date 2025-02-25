declare module "@turbodocx/html-to-docx" {
  function HTMLtoDOCX(html: string, altChunk?: string): Promise<Buffer>;
  export default HTMLtoDOCX;
}
