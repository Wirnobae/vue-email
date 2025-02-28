/// <reference types="vitest" />

import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import banner from "vite-plugin-banner";
import Inspect from "vite-plugin-inspect";
import dts from "vite-plugin-dts";

import { resolve } from "pathe";

import { lightGreen, gray, bold, blue } from "kolorist";

import pkg from "./package.json";

console.log(
  `${lightGreen("🎉")} ${gray("💌")} ${bold(blue("Vue Email"))} v${pkg.version}`
);

export default defineConfig({
  plugins: [
    vue({
      isProduction: false
    }),
    dts({
      insertTypesEntry: true,
    }),
    banner({
      content: `/**\n * name: ${pkg.name}\n * version: v${pkg.version
        }\n * (c) ${new Date().getFullYear()}\n * description: ${pkg.description
        }\n * maintainers: ${pkg.maintainers
          .map(
            ({ name, email, url }) =>
              `${name} (${email})${url ? ` - ${url}` : ""}`
          )
          .join(", ") || "none"
        }\n */`
    }),
    Inspect()
  ],
  test: {
    environment: "jsdom",
    globals: true,
    threads: false
  },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "vue-email",
      fileName: "vue-email"
    },
    watch: {
      include: [resolve(__dirname, "src")]
    },
    rollupOptions: {
      external: ["vue", "isomorphic-dompurify",'html-to-text', 'pretty',
      // 'tw-to-css'
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "isomorphic-dompurify": "DOMPurify",
          'html-to-text': 'htmlToText',
          'pretty': 'pretty',
          // 'tw-to-css': 'twToCss'
        }
      }
    }
  },
});
