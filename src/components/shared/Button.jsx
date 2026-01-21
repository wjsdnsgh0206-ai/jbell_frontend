// src/components/shared/Button.jsx
import React from "react";

export const Button = ({ 
  children, 
  variant = "primary", 
  size = "default", 
  className = "", 
  ...props 
}) => {
  // 1. 디자인 토큰 기반 스타일 정의
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-blue-50 text-blue-600 border border-blue-500 hover:bg-blue-100 active:bg-blue-200",
    tertiary: "bg-graygray-0 text-graygray-90 border border-graygray-60 hover:bg-graygray-10 active:bg-graygray-20",
    none: "",
  };

  const sizes = {
    default: "h-16 min-w-[98px] px-5",
    flex: "min-w-[98px]",
    none: "",  // 패딩과 최소 너비를 완전히 제거한 사이즈 (아이콘 전용)
    sm: "h-10 px-4",
  };

  // 2. 공통 스타일 (레이아웃, 폰트, 비활성화 등)
  const baseStyles = "inline-flex items-center justify-center gap-1 rounded-lg transition-all duration-200 cursor-pointer disabled:bg-graygray-30 disabled:text-graygray-0 disabled:cursor-not-allowed text-body-m active:scale-98";

  // 3. 스타일 합치기
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};