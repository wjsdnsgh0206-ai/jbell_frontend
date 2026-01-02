import { Link, useNavigate } from "react-router-dom";
// import { jyUserRoutes } from '@/routes/route-jy';
import navigationItems from '@/routes/user/navigationItems';
import { useState } from "react";

const UserHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const authButtons = [
    { label: "로그인", icon: "https://c.animaapp.com/PZUA6SpP/img/icon20.svg" , lnk:"/loginMain"},
    {
      label: "회원가입",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-1.svg", lnk:"/signupAgreement"
    },
  ];


  return (
    <div className="flex flex-col w-full items-center relative">
      <div className="flex flex-col items-center relative w-full bg-white">
        <div className="flex flex-col items-center relative mb-2 w-full bg-secondarysecondary-5 h-1" />

        <header className="flex flex-col w-full max-w-[1280px] items-start justify-center gap-1 pt-0 pb-4 px-4 sm:px-6 lg:px-8 relative bg-transparent">
          <nav
            className="items-center gap-2 w-full flex relative"
            aria-label="Main navigation"
          >
            {/* 로고 */}
            <div className="inline-flex items-start gap-8 relative flex-[0_0_auto]">
              <Link to="/">
                <img
                  className="relative w-32 sm:w-40 lg:w-[199px] h-8 sm:h-10 lg:h-12 cursor-pointer"
                  alt="전북안전누리 로고"
                  src="https://c.animaapp.com/PZUA6SpP/img/------.svg"
                />
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="md:flex items-start justify-end gap-2 flex-1">
              {authButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => navigate(button.lnk)}
                  className="inline-flex justify-center gap-2 px-3 py-2.5 flex-[0_0_auto] rounded-md items-center relative"
                  aria-label={button.label}
                >
                  <img className="relative w-5 h-5" alt="" src={button.icon} />
                  <span className="relative flex items-center justify-center w-fit font-bold text-graygray-90 text-sm lg:text-[17px] tracking-[0] leading-[25.5px] whitespace-nowrap">
                    {button.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex-1 flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="메뉴"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </header>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex flex-col h-16 w-full bg-graygray-0 border-t border-b border-graygray-30 items-center relative"
          aria-label="Secondary navigation"
        >
          <div className="flex w-full max-w-[1280px] h-16 items-center gap-2 lg:gap-4 px-4 sm:px-6 lg:px-8 relative bg-white overflow-x-auto">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => navigate(item.path)}
                className="inline-flex gap-2 px-2 lg:px-4 self-stretch items-center relative whitespace-nowrap"
              >
                <span className="font-bold text-graygray-70 text-sm lg:text-[19px]">
                  {item.label}
                </span>
                <img
                  className="relative w-4 h-4 lg:w-5 lg:h-5"
                  alt=""
                  src={item.icon}
                />
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {/* Auth Buttons */}
              <div className="flex gap-2 pb-4 border-b border-gray-100 mb-2">
                {authButtons.map((button, index) => (
                  <button
                    key={index}
                    className="flex-1 flex justify-center items-center gap-2 px-3 py-2.5 rounded-md bg-gray-50 hover:bg-gray-100"
                    aria-label={button.label}
                  >
                    <img className="w-4 h-4" alt="" src={button.icon} />
                    <span className="font-bold text-graygray-90 text-sm">
                      {button.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Navigation Items */}
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                >
                  <img className="w-5 h-5" alt="" src={item.icon} />
                  <span className="font-bold text-graygray-70 text-base">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeader;
