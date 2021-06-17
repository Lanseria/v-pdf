/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "pdfjs-dist/build/pdf.worker.entry";
declare module "pdfjs-dist/web/pdf_viewer";
