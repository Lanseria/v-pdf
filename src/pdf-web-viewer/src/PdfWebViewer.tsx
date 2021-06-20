import { ExtractPublicPropTypes } from "../../types/extract-public-props";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, defineComponent } from "vue";
const vPdfViewerWebProps = {
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

export type VPdfWebViewerProps = ExtractPublicPropTypes<
  typeof vPdfViewerWebProps
>;

export default defineComponent({
  name: "VPdfWebViewer",
  props: vPdfViewerWebProps,
  setup() {
    return {};
  },
  render() {
    return (
      <object
        data={this.src}
        type="application/pdf"
        width={this.width}
        height={this.height}
      >
        <iframe
          width={this.width}
          height={this.height}
          style="border: none"
          src={this.src}
        ></iframe>
      </object>
    );
  }
});
