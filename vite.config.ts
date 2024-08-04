import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
