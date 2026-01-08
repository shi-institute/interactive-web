import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), arcgisShimPlugin()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.svx': 'text',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@arcgis/core') || id.includes('node_modules/@esri/')) {
            return 'arcgis-vendor'; // Name of the chunk
          }
        },
      },
    },
  },
});

/**
 * Replaces ArcGIS imports with an empty shim during SSR builds.
 */
function arcgisShimPlugin() {
  return {
    name: 'arcgis-shim',
    // Use resolveId to identify the module
    resolveId(source, importer, options) {
      if (options.ssr && (source.startsWith('@arcgis/') || source.startsWith('@esri/'))) {
        // Return a unique ID that we will then handle in the load hook
        return '\0virtual:arcgis-empty-shim'; // Using a virtual module prefix
      }
      return null;
    },
    // Use load to provide the content for our virtual ID
    load(id, options) {
      if (id === '\0virtual:arcgis-empty-shim' && options?.ssr) {
        console.log(`[arcgis-shim] Replacing ArcGIS import with empty shim for SSR.`);
        // Provide an empty module that exports a default empty object
        // This is generally safe as long as no server-side code tries to
        // actually instantiate or use methods from the ArcGIS SDK.
        return 'export default {};';
      }
      return null;
    },
  } satisfies import('vite').Plugin;
}
