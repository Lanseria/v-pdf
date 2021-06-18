import {
  h,
  defineComponent,
  reactive,
  onMounted,
  toRefs,
  provide,
  toRef
} from "vue";
import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { ExtractPublicPropTypes } from "@lanseria/v-pdf/types/extract-public-props";
import PdfPage from "./Page";
const pdfViewerProps = {
  src: {
    type: String,
    required: true
  },
  scale: {
    type: [Number, String],
    default: "page-width"
  },
  rotate: {
    type: Number,
    default: 0
  },
  resize: {
    type: Boolean,
    default: false
  },
  annotation: {
    type: Boolean,
    default: true
  },
  text: {
    type: Boolean,
    default: true
  }
};

export type PdfViewerProps = ExtractPublicPropTypes<typeof pdfViewerProps>;

export default defineComponent({
  name: "PdfViewer",
  props: pdfViewerProps,
  components: {
    PdfPage
  },
  setup(props, { emit }) {
    const refState = reactive({
      numPages: [] as number[],
      pdfDocument: undefined as unknown as PDFDocumentProxy
    });
    provide("pdfDocument", toRef(refState, "pdfDocument"));
    onMounted(async () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const source = {
        url: props.src,
        withCredentials: false
      };

      refState.pdfDocument = await pdfjsLib.getDocument(source).promise;
      for (let i = 0; i < refState.pdfDocument.numPages; i++) {
        refState.numPages.push(i + 1);
      }
      // refState.numPages = [1, 2];
      // console.log(state.pdfDocument);
      // state.pdfPage = await state.pdfDocument.getPage(props.page);
      // console.log(state.pdfPage);
    });
    return {
      ...toRefs(refState)
    };
  },
  render() {
    return (
      <div
        class="pdf-app"
        style="overflow-y: scroll; overflow-x: hidden; height: 100%;"
      >
        {this.numPages.map(i => (
          <PdfPage key={i} page={i} scale={this.scale} />
        ))}
      </div>
    );
  }
});
