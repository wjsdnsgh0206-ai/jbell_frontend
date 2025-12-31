import { Link } from "react-router-dom";

const menus = [
  { name: "지도", path: "/map" },
  { name: "d", path: "/map" },
  { name: "정책정보", path: "/" },
  { name: "기관소개", path: "/" },
  { name: "고객센터", path: "/" },
];
const UserHeader = () => {
  return (
    <header className="w-full bg-white">
      {/* 최상단 유틸리티 (회색 배경으로 가로 꽉 채움) */}
      <div className="w-full bg-[#f4f4f4] border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto h-10 flex items-center justify-end gap-5 px-4 text-[13px] text-[#666]">
          <button>Language</button>
          <button>지점</button>
          <button>글자·화면 설정</button>
          <div className="flex gap-4 ml-2">
            <button className="font-bold text-black">로그인</button>
            <button>회원가입</button>
          </div>
        </div>
      </div>

      {/* 메인 로고 및 메뉴 (1200px 정렬) */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto h-20 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <Link to="/"><div className="w-10 h-10 bg-gradient-to-t from-blue-600 to-red-500 rounded-full" /></Link>
            <Link to="/">
              <span className="text-2xl font-black tracking-tighter text-[#222]">
                JBELL
              </span>
            </Link>
          </div>

          <nav className="flex items-center gap-10">
            {menus.map((menu) => (
              <Link
                key={menu.name}
                to={menu.path}
                className="text-[18px] font-bold text-[#333] hover:text-blue-600 transition-colors"
              >
                {menu.name}
              </Link>
            ))}
            <button className="ml-4 text-xl">🔍</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
