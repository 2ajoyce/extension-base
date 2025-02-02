import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        "background/background.js": resolve(
          __dirname,
          "src/background/background.js"
        ),
        "popup/popup.js": resolve(__dirname, "src/popup/popup.js"),
        "options/options.js": resolve(__dirname, "src/options/options.js"),
        "options/fouc.js": resolve(__dirname, "src/options/fouc.js"),
      },
      preserveEntrySignatures: "strict",
      output: {
        entryFileNames: "[name]",
      },
    },
  },
});