import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import { createHtmlPlugin } from "vite-plugin-html";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env) // 터미널에 선언한 환경변수들이 보인다.
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
        '@': path.resolve(dirname, './src'),
      },
    },
    server : {
      proxy : {
        // /api로 시작하는 요청을 외부 API로 프록시
        '/api': {
          target: 'http://localhost:8080', // 외부 API 주소
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          
        },
        // 다른 외부 API가 있다면 추가
        '/safety-api': {
          target: 'https://www.safetydata.go.kr/V2/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/safety-api/, ''),
          secure: false,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Proxy Request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Proxy Response:', proxyRes.statusCode, req.url);
            });
          }
        }
      
      }
    }
  }
});