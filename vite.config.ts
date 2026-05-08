import { sveltekit } from '@sveltejs/kit/vite';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

// These packages are client-only (WebGL, DOM, canvas APIs). Stubbing them as
// empty objects in SSR prevents them from being bundled into _worker.js.
// Cloudflare Pages limits the size of _worker.js to 1 MiB on the free plan.
// All routes that use them must export `ssr = false` so the stubs are never called.
const CLIENT_ONLY_PACKAGES = ['@arcgis/core', '@observablehq/plot', 'd3', 'd3-format'];

function stubClientOnlyPackagesInSSR(): Plugin {
  return {
    name: 'stub-client-only-in-ssr',
    enforce: 'pre',
    resolveId(source, _importer, options) {
      if (
        options?.ssr &&
        CLIENT_ONLY_PACKAGES.some((pkg) => source === pkg || source.startsWith(pkg + '/'))
      ) {
        return { id: '\0ssr-stub', moduleSideEffects: false };
      }
    },
    load(id) {
      if (id === '\0ssr-stub') {
        return {
          code: 'export default {}; export const __stub = true;',
          syntheticNamedExports: true,
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [stubClientOnlyPackagesInSSR(), sveltekit()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.svx': 'text',
      },
    },
  },
});
