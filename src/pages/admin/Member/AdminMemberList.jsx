import BreadCrumb from '@/components/Admin/board/BreadCrumb';

const AdminMemberList = () => {
     const memberData = Array(10).fill({
            id: 'kimgoogle12345',
            name: '김국을',
            telNum: '010-xxxx-xxxx',
            region: '전주시 완산구',
            display: true
        });
    
    return (
         <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
            <div className="p-6 bg-gray-50 min-h-screen">
            <BreadCrumb />
            {/* 페이지 제목 */}
            <h1 className="text-2xl font-bold mb-6">회원 조회</h1>

            {/* 검색 바 영역 */}
            <div className="grid grid-cols-5 gap-4 bg-white p-4 border rounded-md mb-6 shadow-sm">
            <div>
                <label className="block text-sm mb-1">로그인 ID</label>
                <input type="text" placeholder="ID를 입력해주세요." className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">이름</label>
                <input type="text" placeholder="이름을 입력해주세요." className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">전화번호</label>
                <input type="text" placeholder="010-xxxx-xxxx" className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">주소</label>
                <select className="w-full border p-2 rounded text-sm">
                <option>전주시 덕진구</option>
                <option>전주시 완산구</option>
                <option>군산시</option>
                <option>익산시</option>
                <option>정읍시</option>
                <option>남원시</option>
                <option>김제시</option>
                <option>완주군</option>
                <option>고창군</option>
                <option>부안군</option>
                <option>순창군</option>
                <option>임실군</option>
                <option>무주군</option>
                <option>진안군</option>
                <option>장수군</option>
                </select>
            </div>
            <div className="flex items-end gap-2">
                <button className="px-4 py-2 border rounded text-sm">초기화</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">검색</button>
            </div>
            </div>

            {/* 테이블 상단 툴바 */}
            <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex gap-4">
                <label><input type="checkbox" className="mr-1" /> 7개 선택됨</label>
                <button className="text-blue-600">일괄 노출</button>
                <button className="text-gray-500">목록 인쇄</button>
                <button className="text-gray-500">목록 다운로드</button>
            </div>
            </div>

            {/* 테이블 영역 */}
            <div className="bg-white border rounded-md overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b">
                <tr>
                    <th className="p-3 text-center"><input type="checkbox" /></th>
                    <th className="p-3">ID</th>
                    <th className="p-3">이름</th>
                    <th className="p-3">전화번호</th>
                    <th className="p-3">주소검색</th>
                    <th className="p-3">노출</th>
                    <th className="p-3">상세</th>
                </tr>
                </thead>
                <tbody>
                {memberData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center"><input type="checkbox" defaultChecked /></td>
                    <td className="p-3 text-blue-600">{item.id}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 truncate max-w-xs">{item.telNum}</td>
                    <td className="p-3">{item.region}</td>
                    <td className="p-3">
                        <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </td>
                    <td className="p-3">
                        <button className="border px-2 py-1 rounded text-xs">보기</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-6 gap-2 text-sm">
            <button className="p-2 text-gray-400">이전</button>
            <button className="p-2 bg-blue-900 text-white rounded w-8">1</button>
            {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} className="p-2 text-gray-600 w-8">{num}</button>
            ))}
            <button className="p-2 text-gray-600">다음</button>
            </div>
        </div>

            </div>
    )
};

export default AdminMemberList;