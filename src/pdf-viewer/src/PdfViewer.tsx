import { h, defineComponent } from "vue";

const pdfViewerProps = {};

export type PdfViewerProps = typeof pdfViewerProps;

export default defineComponent({
  name: "PdfViewer",
  props: pdfViewerProps,
  setup() {
    return {
      test: "test"
    };
  },
  render() {
    return <div>PdfViewer</div>;
  }
});
