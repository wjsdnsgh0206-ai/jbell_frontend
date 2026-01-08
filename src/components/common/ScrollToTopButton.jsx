import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 200px만 내려가도 살며시 나타나게 조정
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-10 right-6 sm:right-10 z-[9999] transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="group relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 
                   bg-white/80 backdrop-blur-md border border-graygray-10 rounded-2xl shadow-xl
                   hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 active:scale-95"
      >
        {/* 화살표 아이콘: 호버 시 위로 튕기는 애니메이션 */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-graygray-90 group-hover:text-white group-hover:-translate-y-1 transition-all duration-300"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>

        {/* TOP 텍스트: 작게 포인트로 추가 */}
        <span className="text-[10px] font-black mt-0.5 text-graygray-40 group-hover:text-white transition-colors duration-300">
          TOP
        </span>

        {/* 배경에 살짝 감도는 글로우 효과 (선택사항) */}
        <div className="absolute inset-0 rounded-2xl group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-shadow duration-300" />
      </button>
    </div>
  );
};

export default ScrollToTopButton;