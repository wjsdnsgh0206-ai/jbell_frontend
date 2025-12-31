import { Link, useNavigate } from "react-router-dom";

const UserHeader = () => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "재난사고 속보",
      path: "/UserDisasterModal",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-8.svg",
    },
    {
      label: "행동요령",
      path: "/",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-8.svg",
    },
    {
      label: "안전정보 지도",
      path: "/map",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-8.svg",
    },
    {
      label: "주요 안전정책",
      path: "/",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-8.svg",
    },
    {
      label: "대피소 소개",
      path: "/UserFacilityDetail",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-8.svg",
    },
    {
      label: "열린마당",
      path: "/UserOpenSpaceLi",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-8.svg",
    },
    {
      label: "고객센터",
      path: "/",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-8.svg",
    },
  ];

    const authButtons = [
    { label: "로그인", icon: "https://c.animaapp.com/PZUA6SpP/img/icon20.svg" },
    {
      label: "회원가입",
      icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-1.svg",
    },
  ];


  return (
    <div className="flex flex-col w-[1920px] items-center relative flex-[0_0_auto]">
      <div className="flex flex-col h-[170px] items-center relative self-stretch w-full bg-white">
        <div className="flex flex-col items-center relative flex-1 mb-2 self-stretch w-full grow bg-secondarysecondary-5" />

        <header className="flex flex-col mt-2 w-[1280px] items-start justify-center gap-1 pt-0 pb-4 px-0 relative flex-[0_0_auto] bg-transparent">
          <nav
            className="items-center gap-2 self-stretch w-full flex-[0_0_auto] flex relative"
            aria-label="Main navigation"
          >
            {/* 로고 */}
            <div className="inline-flex items-start gap-8 relative flex-[0_0_auto]">
              <Link to="/">
                <img
                  className="relative w-[199px] h-12 cursor-pointer"
                  alt="대한민국정부 로고"
                  src="https://c.animaapp.com/PZUA6SpP/img/------.svg"
                />
              </Link>
            </div>
            <div className="items-start justify-end gap-2 flex-1 grow flex relative">
              {authButtons.map((button, index) => (
                <button
                  key={index}
                  className="inline-flex justify-center gap-2 px-3 py-2.5 flex-[0_0_auto] rounded-md items-center relative"
                  aria-label={button.label}
                >
                  <img className="relative w-5 h-5" alt="" src={button.icon} />
                  <span className="relative flex items-center justify-center w-fit [font-family:'Pretendard_GOV-Bold',Helvetica] font-bold text-graygray-90 text-[17px] tracking-[0] leading-[25.5px] whitespace-nowrap">
                    {button.label}
                  </span>
                </button>
              ))}
            </div>

          </nav>
        </header>

        {/* 하단 네비게이션 */}
        <nav
          className="flex flex-col h-16 self-stretch w-full bg-graygray-0 border-t border-b border-graygray-30 items-center relative"
          aria-label="Secondary navigation"
        >
          <div className="flex w-[1280px] h-16 items-center gap-4 relative bg-white">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => navigate(item.path)}
                className="inline-flex gap-2 px-4 self-stretch items-center relative"
              >
                <span className="font-bold text-graygray-70 text-[19px] whitespace-nowrap">
                  {item.label}
                </span>

                {/* ⭐ 아이콘 복구 */}
                <img
                  className="relative w-5 h-5"
                  alt=""
                  src={item.icon}
                />
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default UserHeader;
