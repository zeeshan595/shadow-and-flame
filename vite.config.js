import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default {
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
