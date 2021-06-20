import { ExtractPublicPropTypes } from "../../types/extract-public-props";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, defineComponent } from "vue";
import { computed } from "vue";
import JsViewer from "./JsViewer.vue";
const vPdfJsViewerProps = {
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
  }
};

export type VPdfJsViewerProps = ExtractPublicPropTypes<
  typeof vPdfJsViewerProps
>;

export default defineComponent({
  name: "VPdfJsViewer",
  props: vPdfJsViewerProps,
  components: {
    JsViewer
  },
  setup(props) {
    const linkSrc = computed(() => {
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${props.src}`;
    });
    return {
      linkSrc
    };
  },
  render() {
    return <JsViewer></JsViewer>;
  }
});
