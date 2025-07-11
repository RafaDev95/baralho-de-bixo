import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./tests/utils/testSetup.ts"],
		include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		exclude: ["node_modules", "dist", ".idea", ".git", ".cache", ".build"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			$: resolve(__dirname, "./"),
		},
	},
	esbuild: {
		target: "ES2022",
	},
});
