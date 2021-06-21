<template>
  <!-- <VPdfWebViewer
    width="400"
    height="600"
    src="http://183.131.134.242:1889/files/20210619/383518b085f9469eb9ec34594196f8c7.pdf"
  ></VPdfWebViewer> -->
  <VPdfJsViewer
    src="http://183.131.134.242:1889/files/20210619/383518b085f9469eb9ec34594196f8c7.pdf"
  ></VPdfJsViewer>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// import { VPdfWebViewer } from "../src/index";
import { VPdfJsViewer } from "../src/index";
export default defineComponent({
  components: {
    // VPdfWebViewer,
    VPdfJsViewer
  },
  setup() {
    // https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK
    // http://183.131.134.242:1889/files/20210619/383518b085f9469eb9ec34594196f8c7.pdf
    return {};
  }
});
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>
