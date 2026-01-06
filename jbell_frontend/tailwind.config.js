/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 1. 색상 토큰 연결 (CSS 변수 활용)
      colors: {
        graygray: {
          0: "var(--graygray-0)",
          5: "var(--graygray-5)",
          10: "var(--graygray-10)",
          30: "var(--graygray-30)",
          40: "var(--graygray-40)",
          50: "var(--graygray-50)",
          70: "var(--graygray-70)",
          80: "var(--graygray-80)",
          90: "var(--graygray-90)",
        },
        secondary: {
          5: "var(--secondary-5)",
          50: "var(--secondary-50)",
          80: "var(--secondary-80)",
        },
        primary: {
          50: "var(--primary-50)", 
        },
      },
      // 2. 폰트 패밀리 (필요한 경우만 기본값 재정의)
      fontFamily: {
        sans: ["Pretendard GOV", "sans-serif"],
      },
      // 3. 그림자 등 기타 유틸리티
      boxShadow: {
        1: "0px 0px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};