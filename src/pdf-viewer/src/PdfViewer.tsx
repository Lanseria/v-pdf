import { h, defineComponent } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { onMounted } from "vue";
const pdfViewerProps = {};

export type PdfViewerProps = typeof pdfViewerProps;

export default defineComponent({
  name: "PdfViewer",
  props: pdfViewerProps,
  setup() {
    onMounted(async () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const source = {
        url: "https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK",
        withCredentials: false
      };
      const pdf = await pdfjsLib.getDocument(source).promise;
      console.log(pdf);
    });
    return {
      test: "test"
    };
  },
  render() {
    return <div>PdfViewer</div>;
  }
});
