const AdminSideBar = () => {
    return (
        <>
            <aside className="w-64 bg-[#001529] text-gray-300 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">대한민국정부</span>
                </div>

                <nav className="flex-1">
                    <ul className="text-sm">
                        <li className="px-6 py-4 bg-[#1890ff] text-white font-semibold cursor-pointer">공통코드 관리</li>
                        <li className="px-6 py-4 hover:bg-[#1e2d3d] hover:text-white cursor-pointer transition">그룹코드 등록</li>
                        <li className="px-6 py-4 hover:bg-[#1e2d3d] hover:text-white cursor-pointer transition">상세코드 등록</li>
                        <div className="mt-8 border-t border-gray-700"></div>
                        <li className="px-6 py-4 hover:bg-[#1e2d3d] hover:text-white cursor-pointer transition">로그 관리</li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default AdminSideBar;