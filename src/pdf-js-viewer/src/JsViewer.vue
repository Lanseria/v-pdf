<template>
  <div class="pdf-app" ref="PdfAppRef" id="drawer-target">
    <div ref="PdfTopBarRef" class="top-bar">
      <div class="left-box"></div>
      <div class="center-box">
        <n-button style="margin-right: 10px" @click="handlePrev()">
          上一页
        </n-button>

        <n-button @click="handleNext()"> 下一页 </n-button>
      </div>
      <div class="right-box">
        <span class="page-info">
          当前 <span>{{ currentNum }}</span> / 页数
          <span>{{ numPages }}</span>
        </span>
      </div>
    </div>

    <div ref="PdfPageRef" class="pdf-doc"></div>
  </div>
</template>
<script lang="ts">
import { NButton } from "naive-ui";
import { defineComponent, onMounted, ref } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import {
  EventBus,
  DefaultAnnotationLayerFactory,
  DefaultTextLayerFactory,
  PDFPageView
} from "pdfjs-dist/web/pdf_viewer";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { useResizeObserver } from "@vueuse/core";
export default defineComponent({
  components: {
    NButton
  },
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
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
  },
  setup(props, { emit }) {
    const pdfDoc = ref<PDFDocumentProxy>();
    const eventBus = ref<any>(new EventBus());
    const pdfViewer = ref<any>();
    const numPages = ref(0);
    const currentNum = ref(1);
    const pageIsRendering = ref(false);
    const active = ref(false);
    const PdfPageRef = ref();
    const PdfAppRef = ref();
    const PdfTopBarRef = ref();
    // method
    const calculateScale = (width = -1, height = -1) => {
      pdfViewer.value.update(1, props.rotate); // Reset scaling to 1 so that "this.pdfViewer.viewport.width" gives proper width;
      if (width === -1 && height === -1) {
        width = PdfPageRef.value.offsetWidth;
      }
      return width / pdfViewer.value.viewport.width;
    };
    const calculateScaleHeight = () => {
      pdfViewer.value.update(1, props.rotate); // Reset scaling to 1 so that "this.pdfViewer.viewport.width" gives proper width;
      const height = PdfPageRef.value.offsetHeight;
      const parentel = PdfPageRef.value.parentElement.parentElement;
      return parentel.offsetHeight / height;
    };
    const drawScaled = (newScale: number | string) => {
      if (pdfViewer.value) {
        if (newScale === "page-width") {
          newScale = calculateScale();
          emit("update:scale", newScale);
        } else if (newScale === "page-height") {
          newScale = calculateScaleHeight();
          emit("update:scale", newScale);
        }
        pdfViewer.value.update(newScale, props.rotate);
        // The SimpleLinkService from the DefaultAnnotationLayerFactory doesn't do anything with links so override with our LinkService after it is created
        // pdfViewer.value.annotationLayer =
        //   pdfViewer.value.annotationLayerFactory.createAnnotationLayerBuilder(
        //     pdfViewer.value.div,
        //     pdfViewer.value.pdfPage
        //   );
        // state.pdfViewer.annotationLayer.linkService = state.pdfLinkService;
        pdfViewer.value.draw();
        // The findController needs the text layer to have been created in the Draw() function, so link it in now
        // state.pdfViewer.textLayer.findController = state.pdfFindController;
        pageIsRendering.value = false;
        emit("loading", false);
      }
    };
    const renderPage = (renderNum: number) => {
      pageIsRendering.value = true;
      const removeChilds = (parent: HTMLElement) => {
        while (parent.lastChild) {
          parent.removeChild(parent.lastChild);
        }
      };
      removeChilds(PdfPageRef.value);
      // Get page
      pdfDoc.value &&
        pdfDoc.value.getPage(renderNum).then(page => {
          let annotationLayer = undefined,
            textLayer = undefined;

          if (props.annotation) {
            annotationLayer = new DefaultAnnotationLayerFactory();
          }
          if (props.text) {
            textLayer = new DefaultTextLayerFactory();
          }
          pdfViewer.value = new PDFPageView({
            container: PdfPageRef.value,
            id: renderNum,
            scale: 1,
            defaultViewport: page.getViewport({
              scale: 1
            }),
            eventBus: eventBus.value,
            textLayerFactory: textLayer,
            annotationLayerFactory: annotationLayer
          });

          // Associates the actual page with the view, and drawing it
          pdfViewer.value.setPdfPage(page);

          drawScaled(props.scale);
        });
    };
    const handleNext = () => {
      if (currentNum.value >= numPages.value) {
        return;
      }
      currentNum.value++;
      renderPage(currentNum.value);
    };
    const handlePrev = () => {
      if (currentNum.value <= 1) {
        return;
      }
      currentNum.value--;
      renderPage(currentNum.value);
    };
    // hook
    onMounted(() => {
      pdfjsLib.getDocument(props.src).promise.then(_pdfDoc => {
        pdfDoc.value = _pdfDoc;
        numPages.value = _pdfDoc.numPages;
        renderPage(currentNum.value);
      });

      useResizeObserver(PdfAppRef.value, entries => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        console.log(`width: ${width}, height: ${height}`);
        drawScaled("page-width");
      });
    });

    return {
      // refs
      PdfPageRef,
      PdfAppRef,
      PdfTopBarRef,
      // ref
      active,
      numPages,
      currentNum,
      // method
      handleNext,
      handlePrev
    };
  }
});
</script>
<style scoped>
.pdf-app {
  height: v-bind(height);
  width: v-bind(width);
  display: flex;
  flex-direction: column;
}

.pdf-doc {
  position: relative;
}

.pdf-doc :deep(.page) {
  position: relative;
}

.pdf-doc {
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
}

.top-bar {
  background: #e9e9e9;
  padding: 1rem;
  flex: 0 0 53px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-info {
  margin-left: 1rem;
}
</style>
