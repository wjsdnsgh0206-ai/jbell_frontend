/* tailwind.config.js */

import { Scale } from 'lucide-react';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 1. 색상 토큰 연결 (CSS 변수 활용)
      colors: {
        // Gray Scale 연결
        graygray: {
          0: "var(--graygray-0)",
          5: "var(--graygray-5)",
          10: "var(--graygray-10)",
          20: "var(--graygray-20)",
          30: "var(--graygray-30)",
          40: "var(--graygray-40)",
          50: "var(--graygray-50)",
          60: "var(--graygray-60)",
          70: "var(--graygray-70)",
          80: "var(--graygray-80)",
          90: "var(--graygray-90)",
        },
        red: {
          500: '#FF3B30',
          600: '#D63025',
        },
        orange: {
          50: "var(--orange-50)",
          200: "var(--orange-200)",
          600: "var(--orange-600)",
        },
        green: {
          100: "var(--green-100)",
          200: "var(--green-200)",
          700: "var(--green-700)",
        },
        // Blue Scale 연결
        blue: {
          50: "var(--blue-50)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
        },
        secondary: {
          5: "var(--secondary-5)",
          50: "var(--secondary-50)",
          80: "var(--secondary-80)",
        },
        primary: {
          50: "var(--primary-50)", 
        },

        // [관리자 전용 신규 토큰 연결]
        admin: {
          bg: "var(--admin-bg)",           // 전체 배경색
          surface: "var(--admin-surface)", // 카드/박스 배경
          border: "var(--admin-border)",   // 얇은 경계선
          primary: "var(--admin-primary)", // 핵심 액션
          primaryHover: "var(--admin-primary-hover)",
          text: {
            primary: "var(--admin-text-primary)",   // 진한 본문
            secondary: "var(--admin-text-secondary)", // 라벨/보조
          },
        },
      },
      scale: {
        98: "0.98",
      },
      // 2. 폰트 패밀리 (필요한 경우만 기본값 재정의)
      fontFamily: {
        sans: ["Pretendard GOV", "sans-serif"],
      },
      // 3. 그림자 등 기타 유틸리티
      boxShadow: {
        1: "0px 0px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        adminCard: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // 깔끔한 카드 그림자
      },
    },
  },
  plugins: [],
};