import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            kakaoApiKey: env.VITE_APP_KAKAOMAP_KEY,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // /api로 시작하는 요청을 외부 API로 프록시
        "/api": {
          target: "http://localhost:8080", // 외부 API 주소
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // 다른 외부 API가 있다면 추가
        "/safety-api": {
          target: "https://www.safetydata.go.kr/V2/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/safety-api/, ""),
          secure: false,
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxy Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Proxy Response:", proxyRes.statusCode, req.url);
            });
          },
        },
        "/weather-api": {
          target: "https://api.openweathermap.org/data/2.5/weather",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/weather-api/, ""),
          secure: false,
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxy Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Proxy Response:", proxyRes.statusCode, req.url);
            });
          },
        },

        // 재난문자 (속보) api
        "/message-api": {
          target: "https://www.safetydata.go.kr/V2/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/message-api/, ""),
          secure: false,
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxy Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Proxy Response:", proxyRes.statusCode, req.url);
            });
          },
        },

        // 지진 대피장소 api
        "/earthquake-api": {
          target: "https://www.safetydata.go.kr/V2/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/earthquake-api/, ""),
          secure: false,
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxy Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Proxy Response:", proxyRes.statusCode, req.url);
            });
          },
        },

        // 지진 진도 api
        "/earthquakeLevel-api": {
          target: "https://www.safetydata.go.kr/V2/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/earthquakeLevel-api/, ""),
          secure: false,
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxy Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Proxy Response:", proxyRes.statusCode, req.url);
            });
          },
        },

        // 호우홍수에서 활용되는 침수 흔적도 api
        "/floodTrace-api": {
          target: "https://www.safetydata.go.kr/V2/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/floodTrace-api/, ""),
          secure: false,
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxy Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Proxy Response:", proxyRes.statusCode, req.url);
            });
          },
        },

// vite.config.js
"/sluice-api": {
  target: "https://apis.data.go.kr",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/sluice-api/, ""),
  secure: false,
  configure: (proxy, options) => {
    proxy.on("proxyReq", (proxyReq, req, res) => {
      console.log("Proxy Request:", req.method, req.url);
    });
    proxy.on("proxyRes", (proxyRes, req, res) => {
      console.log("Proxy Response:", proxyRes.statusCode, req.url);
    });
  },
},

        // 🔹 기상청 지진 특보
        "/kma-api": {
          target: "https://apihub.kma.go.kr",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/kma-api/, ""),
        },
      },
    },
  };
});
