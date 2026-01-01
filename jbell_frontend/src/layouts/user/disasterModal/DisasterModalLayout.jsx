import { Outlet, useNavigate } from "react-router-dom";

const DisasterModalLayout = () => {
  const navigate = useNavigate();

  const menuList = [
    { label: "사고속보", path: "/disaster/accident" },
    { label: "지진", path: "/disaster/earthquake" },
    { label: "태풍", path: "/disaster/typhoon" },
    { label: "호우", path: "/disaster/heavyRain" },
    { label: "홍수", path: "/disaster/flood" },
    { label: "산사태", path: "/disaster/landslide" },
    { label: "산불", path: "/disaster/wildfire" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => navigate(-1)}
      />

      {/* 모달 */}
      <div className="relative w-[95%] max-w-[1280px] h-[90vh] bg-[#f4f7fa] rounded-[32px] shadow-2xl overflow-hidden flex">
        
        {/* 사이드바 */}
        <aside className="w-[240px] bg-[#2d3e5d] text-white shrink-0 flex flex-col">
          <div className="p-6 border-b border-white/10 font-bold text-lg">
            전주시안전누리
          </div>

          <nav className="flex-1 mt-4">
            {menuList.map((menu) => (
              <button
                key={menu.label}
                onClick={() => navigate(menu.path)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
              >
                {menu.label}
                <span className="text-gray-500">&gt;</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* 메인 영역 */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white px-8 py-4 border-b flex justify-between items-center">
            <h2 className="font-black text-gray-800">재난사고속보</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-xl font-bold"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DisasterModalLayout;
