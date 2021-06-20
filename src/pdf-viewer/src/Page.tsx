import {
  h,
  defineComponent,
  reactive,
  onMounted,
  watch,
  toRefs,
  inject,
  ref,
  Ref
} from "vue";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";

import {
  EventBus,
  PDFLinkService,
  PDFFindController,
  DefaultAnnotationLayerFactory,
  DefaultTextLayerFactory,
  PDFPageView
} from "pdfjs-dist/web/pdf_viewer";
import { ExtractPublicPropTypes } from "../../types/extract-public-props";
import { useResizeObserver } from "@vueuse/core";
import "pdfjs-dist/web/pdf_viewer.css";
const pdfViewerProps = {
  page: {
    type: Number,
    default: 1
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
  setup(props, { emit }) {
    const pdfDocument = inject(
      "pdfDocument",
      ref<PDFDocumentProxy>()
    ) as Ref<PDFDocumentProxy>;
    const refState = reactive({
      pdfPageRef: null as any
    });
    const state = reactive({
      eventBus: new EventBus(),
      pdfDocument: pdfDocument.value,
      pdfPage: undefined as unknown as PDFPageProxy,
      pdfViewer: undefined as any,
      pdfLinkService: undefined as any,
      pdfFindController: undefined as any,
      loading: false
    });
    const calculateScale = (width = -1, height = -1) => {
      state.pdfViewer.update(1, props.rotate); // Reset scaling to 1 so that "this.pdfViewer.viewport.width" gives proper width;
      if (width === -1 && height === -1) {
        width = refState.pdfPageRef.offsetWidth;
      }

      return width / state.pdfViewer.viewport.width;
    };
    const calculateScaleHeight = () => {
      state.pdfViewer.update(1, props.rotate); // Reset scaling to 1 so that "this.pdfViewer.viewport.width" gives proper width;
      const height = refState.pdfPageRef.offsetHeight;
      const parentel = refState.pdfPageRef.parentElement.parentElement;
      return parentel.offsetHeight / height;
    };
    const drawScaled = (newScale: number | string) => {
      if (state.pdfViewer) {
        if (newScale === "page-width") {
          newScale = calculateScale();
          emit("update:scale", newScale);
        } else if (newScale === "page-height") {
          newScale = calculateScaleHeight();
          emit("update:scale", newScale);
        }
        state.pdfViewer.update(newScale, props.rotate);
        // The SimpleLinkService from the DefaultAnnotationLayerFactory doesn't do anything with links so override with our LinkService after it is created
        // console.log(state.pdfViewer);
        state.pdfViewer.annotationLayer =
          state.pdfViewer.annotationLayerFactory.createAnnotationLayerBuilder(
            state.pdfViewer.div,
            state.pdfViewer.pdfPage
          );
        state.pdfViewer.annotationLayer.linkService = state.pdfLinkService;
        state.pdfViewer.draw();
        // The findController needs the text layer to have been created in the Draw() function, so link it in now
        state.pdfViewer.textLayer.findController = state.pdfFindController;
        state.loading = false;
        emit("loading", false);
      }
    };
    watch(
      () => props.page,
      (nPage, oPage) => {
        state.pdfDocument.getPage(nPage).then(function (pdfPage) {
          console.log("draw");
          state.pdfViewer.setPdfPage(pdfPage);
          state.pdfViewer.draw();
        });
      }
    );

    useResizeObserver(document.body, entries => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      // console.log(`width: ${width}, height: ${height}`);
      drawScaled("page-width");
    });
    onMounted(async () => {
      state.pdfPage = await state.pdfDocument.getPage(props.page);
      // console.log(state.pdfPage);

      // (Optionally) enable hyperlinks within PDF files.
      state.pdfLinkService = new PDFLinkService({
        eventBus: state.eventBus,
        externalLinkTarget: 2
      });

      // (Optionally) enable find controller.
      state.pdfFindController = new PDFFindController({
        eventBus: state.eventBus,
        linkService: state.pdfLinkService
      });

      let annotationLayer = undefined,
        textLayer = undefined;

      if (props.annotation) {
        annotationLayer = new DefaultAnnotationLayerFactory();
      }
      if (props.text) {
        textLayer = new DefaultTextLayerFactory();
      }

      state.pdfViewer = new PDFPageView({
        container: refState.pdfPageRef,
        id: props.page,
        scale: 1,
        defaultViewport: state.pdfPage.getViewport({
          scale: 1
        }),
        eventBus: state.eventBus,
        textLayerFactory: textLayer,
        annotationLayerFactory: annotationLayer
      });
      state.loading = false;
      emit("loading", false);

      // Associates the actual page with the view, and drawing it
      state.pdfViewer.setPdfPage(state.pdfPage);

      const viewer = {
        scrollPageIntoView: function (params: any) {
          // Send an event when clicking internal links so we can handle loading/scrolling to the correct page
          emit("link-clicked", params);
        }
      };
      state.pdfLinkService.setDocument(state.pdfDocument);
      state.pdfLinkService.setViewer(viewer);
      state.pdfFindController.setDocument(state.pdfDocument);
      drawScaled(props.scale);
    });
    return {
      ...toRefs(refState)
    };
  },
  render() {
    return <div ref="pdfPageRef" style="position:relative;"></div>;
  }
});
