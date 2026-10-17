import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { pdfJsCMapsPlugin } from "../ui/vite/pdfJsCMapsPlugin.js";

export default defineConfig({
  // 相对 base：产物既能挂在站点根（/），也能挂在子目录（/zcode/、GitHub Pages 项目页）。
  // 默认的绝对 base("/") 会让子路径部署时 /assets/* 全部 404，整页白屏。
  // 本应用没有 history 路由，相对路径不存在深层路由解析问题。
  base: "./",
  plugins: [pdfJsCMapsPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "../ui/src"),
      "d3-path": resolve(__dirname, "../../node_modules/d3-path/src/index.js"),
    },
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  define: {
    __ZCODE_VERSION__: JSON.stringify("shell"),
    __ZCODE_COMMIT__: JSON.stringify("shell"),
    __ZCODE_ENV__: JSON.stringify("test"),
    "import.meta.env.VITE_ZCODE_BASE_URL": JSON.stringify(""),
    "import.meta.env.VITE_ZCODE_ENDPOINT_ORIGIN": JSON.stringify(""),
    "import.meta.env.VITE_ZAI_OAUTH_CLIENT_ID": JSON.stringify(""),
    "import.meta.env.VITE_ZAI_OAUTH_ORIGIN": JSON.stringify(""),
  },
});
