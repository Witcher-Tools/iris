import react from "@vitejs/plugin-react";
import { URL, fileURLToPath } from "url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react({})],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
            {
                find: "@bindings",
                replacement: fileURLToPath(new URL("./bindings", import.meta.url)),
            },
            {
                find: "@shared",
                replacement: fileURLToPath(
                    new URL("./src/modules/shared", import.meta.url)
                ),
            },
        ],
    },
});
