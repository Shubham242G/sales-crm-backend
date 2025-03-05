// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///C:/360_solutions/360_Admin/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/360_solutions/360_Admin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import react from "file:///C:/360_solutions/360_Admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/360_solutions/360_Admin/vite.config.ts";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define: {
      "process.env": env
    },
    plugins: [
      // Register the React plugin
      react(),
      // If you're using Vue, you can keep this line. Otherwise, remove it.
      vue()
    ],
    server: {
      host: true,
      port: 8080
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFwzNjBfc29sdXRpb25zXFxcXDM2MF9BZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcMzYwX3NvbHV0aW9uc1xcXFwzNjBfQWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6LzM2MF9zb2x1dGlvbnMvMzYwX0FkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7IC8vIEFkZCB0aGlzIHRvIHVzZSBSZWFjdC5cclxuXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OmFueSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XHJcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgXCJwcm9jZXNzLmVudlwiOiBlbnYsXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAvLyBSZWdpc3RlciB0aGUgUmVhY3QgcGx1Z2luXHJcbiAgICAgIHJlYWN0KCksXHJcbiAgICAgIC8vIElmIHlvdSdyZSB1c2luZyBWdWUsIHlvdSBjYW4ga2VlcCB0aGlzIGxpbmUuIE90aGVyd2lzZSwgcmVtb3ZlIGl0LlxyXG4gICAgICB2dWUoKSxcclxuICAgIF0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogdHJ1ZSxcclxuICAgICAgcG9ydDogODA4MCxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9KTtcclxufTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXNRLFNBQVMsZUFBZSxXQUFXO0FBQ3pTLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFIK0ksSUFBTSwyQ0FBMkM7QUFPbE4sSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFVO0FBQy9CLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFPLGFBQWE7QUFBQSxJQUNsQixRQUFRO0FBQUEsTUFDTixlQUFlO0FBQUEsSUFDakI7QUFBQSxJQUNBLFNBQVM7QUFBQTtBQUFBLE1BRVAsTUFBTTtBQUFBO0FBQUEsTUFFTixJQUFJO0FBQUEsSUFDTjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
