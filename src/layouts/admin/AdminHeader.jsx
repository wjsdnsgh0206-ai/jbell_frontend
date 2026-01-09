// src/layouts/admin/AdminHeader.jsx
const AdminHeader = () => {

    return (
        <>
 
          <span className="cursor-pointer hover:text-blue-600">실시간 정보 관리</span>
          <span className="cursor-pointer hover:text-blue-600">콘텐츠 관리</span>
          <span className="cursor-pointer hover:text-blue-600">안전정보 관리</span>
          <span className="cursor-pointer hover:text-blue-600">회원 관리</span>
          <span className="text-blue-600 border-b-2 border-blue-600 h-full flex items-center px-2">시스템 관리</span>

        </>
    )
}

export default AdminHeader;