import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react"; // Add this to use React.

// https://vite.dev/config/

export default ({ mode }:any) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define: {
      "process.env": env,
    },
    plugins: [
      // Register the React plugin
      react(),
      // If you're using Vue, you can keep this line. Otherwise, remove it.
      vue(),
    ],
    server: {
      host: true,
      port: 8080,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  });
};