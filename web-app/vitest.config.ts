/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
    test: {
        include: ["{src,test}/**/*.test.ts"],
        exclude: [],
        environment: "happy-dom",
        alias: {
            "@/": new URL("./src/", import.meta.url).pathname,
        },
    },
});
