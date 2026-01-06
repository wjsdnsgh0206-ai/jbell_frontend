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
    
  }
});