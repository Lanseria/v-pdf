/* eslint-disable @typescript-eslint/no-var-requires */
const createVuePlugin = require("@vitejs/plugin-vue");
const siteIndexTransFormPlugin = require("./vite-plugin-index-tranform");

const vuePlugin = createVuePlugin({
  include: [/\.vue$/]
});

const createDemoPlugin = () => {
  return [siteIndexTransFormPlugin, vuePlugin];
};

module.exports = createDemoPlugin;
