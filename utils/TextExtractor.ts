import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  if (ext == "pdf") {
    return await extractTextFromPDF(file);
  }
  if (ext?.includes("doc")) {
    return await extractTextFromWord(file);
  }
  return "";
}
async function extractTextFromPDF(pdfFile: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.onload = async () => {
      const doc = await pdfjs.getDocument(reader.result!).promise;
      const page = await doc.getPage(1);
      const content = await page.getTextContent();
      let text = "";
      content.items.map((item: any) => {
        if (item.str) text += item.str;
      });
      resolve(text);
    };
    reader.readAsArrayBuffer(pdfFile);
  });
}

async function extractTextFromWord(wordFile: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.onload = async () => {
      const result = await mammoth.extractRawText({
        arrayBuffer: reader.result as ArrayBuffer,
      });
      const text = result.value; // The raw text
      const messages = result.messages;
      resolve(text);
    };
    reader.readAsArrayBuffer(wordFile);
  });
}
