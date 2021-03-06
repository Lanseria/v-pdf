/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { babel } = require("@rollup/plugin-babel");
const createDemoPlugin = require("./build/vite-plugin-demo");

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  root: __dirname,
  plugins: createDemoPlugin(),
  resolve: {
    // In production site build, we want to import v-pdf from node_modules
    alias:
      process.env.NODE_ENV !== "production"
        ? [
            {
              find: "@lanseria/v-pdf",
              replacement: path.resolve(__dirname, "./src")
            }
          ]
        : undefined
  },
  define: {
    "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
    "__DEV__": process.env.NODE_ENV !== "production"
  },
  optimizeDeps: {
    include: ["vue", "vue-router"],
    exclude: ["__INDEX__"]
  },
  build: {
    outDir: "site",
    rollupOptions: {
      plugins: [
        babel({
          babelHelpers: "bundled"
        })
      ]
    }
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment"
  }
};
