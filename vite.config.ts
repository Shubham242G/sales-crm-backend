import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

// @ts-expect-error: plugin-react has a default export, but types say otherwise
import react from "@vitejs/plugin-react";

export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define: {
      "process.env": env,
    },
    plugins: [react()],
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
