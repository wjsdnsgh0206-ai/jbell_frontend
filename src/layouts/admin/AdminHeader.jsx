import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = () => {
    const location = useLocation();
  const navigate = useNavigate();

   const isActive = (path) => location.pathname === path;
   const baseStyle = "cursor-pointer px-2 h-full flex items-center";
     const activeStyle = "text-blue-600 border-b-2 border-blue-600";
  const inactiveStyle = "hover:text-blue-600 text-gray-700";
    return (
        <>
 
          <span className="cursor-pointer hover:text-blue-600">실시간 정보 관리</span>
     <span 
         className={`${baseStyle} ${isActive("/admin/content/adminBoardList") ? activeStyle : inactiveStyle}`} 
         onClick={() => navigate("/admin/content/adminBoardList")}
       >
         콘텐츠 관리
       </span>
          <span className="cursor-pointer hover:text-blue-600">안전정보 관리</span>
          <span className="cursor-pointer hover:text-blue-600">회원 관리</span>
          <span className="text-blue-600 border-b-2 border-blue-600 h-full flex items-center px-2">시스템 관리</span>

        </>
    )
}


            // <button onClick={() => navigate("/admin/content/adminBoardList")}>공지사항</button>
export default AdminHeader;



// import { useNavigate, useLocation } from 'react-router-dom';

// const AdminHeader = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 현재 경로와 메뉴의 경로가 일치하는지 확인하는 함수
//   const isActive = (path) => location.pathname === path;

//   // 공통 스타일 클래스
//   const baseStyle = "cursor-pointer px-2 h-full flex items-center";
//   const activeStyle = "text-blue-600 border-b-2 border-blue-600";
//   const inactiveStyle = "hover:text-blue-600 text-gray-700";

//   return (
//     <>
//       <span 
//         className={`${baseStyle} ${isActive("/admin/realtime") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/realtime")}
//       >
//         실시간 정보 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/content/adminBoardList") ? activeStyle : inactiveStyle}`} 
//         onClick={() => navigate("/admin/content/adminBoardList")}
//       >
//         콘텐츠 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/safety") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/safety")}
//       >
//         안전정보 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/member") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/member")}
//       >
//         회원 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/system") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/system")}
//       >
//         시스템 관리
//       </span>
//     </>
//   );
// };

// export default AdminHeader;