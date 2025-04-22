import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals({ nativeFetch: true });

// Hardcoded URL
const hardcodedShopifyAppUrl = "https://your-hardcoded-url.onrender.com"; // Replace with your actual URL

let host = "0.0.0.0"; // Needed for Render or any public host
let hmrConfig;

// If the hardcoded URL contains "localhost", use the correct HMR config
if (hardcodedShopifyAppUrl.includes("localhost")) {
  host = "localhost";
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  const appHostname = new URL(hardcodedShopifyAppUrl).hostname;
  hmrConfig = {
    protocol: "wss",
    host: appHostname,
    port: parseInt(process.env.FRONTEND_PORT || "8002"),
    clientPort: 443,
  };
}

export default defineConfig({
  server: {
    host,
    allowedHosts: [".onrender.com"],
    cors: {
      preflightContinue: true,
    },
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      allow: ["app", "node_modules"],
    },
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: false,
        v3_routeConfig: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    include: ["@shopify/app-bridge-react", "@shopify/polaris"],
  },
});
