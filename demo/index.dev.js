import { createApp } from "vue";
import vPdf from "../src/index";
import SiteRoot from "./SiteRoot.vue";

const app = createApp(SiteRoot);

app.use(vPdf);

app.mount("#app");
