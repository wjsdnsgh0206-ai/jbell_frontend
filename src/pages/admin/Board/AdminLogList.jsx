import BreadCrumb from '@/components/Admin/board/BreadCrumb';

const AdminLogList = () => {

    const logData = Array(10).fill({
            logId: 'kimgoogle12345',
            logIp: 'xxx.xxx.xx.xx',
            loggedDate: '2xxx년 xx월 xx일 xx시 xx분',
            logSOF:'실패',
            logReason: '아이디 및 비밀번호 불일치',
            display: true
        });
            
        return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
           <div className="p-6 bg-gray-50 min-h-screen">
            <BreadCrumb />
          {/* 페이지 제목 */}
          <h1 className="text-2xl font-bold mb-6">로그 관리</h1>
    
          {/* 검색 바 영역 */}
          <div className="grid grid-cols-6 gap-4 bg-white p-4 border rounded-md mb-6 shadow-sm">
            <div>
              <label className="block text-sm mb-1">로그인 ID</label>
              <input type="text" placeholder="ID를 입력해주세요." className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">로그인 IP</label>
              <input type="text" placeholder="xxx.xxx.xx.xx" className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">발생일자</label>
                <input type="date" className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">로그인 성공/실패 여부</label>
                <select className="w-full border p-2 rounded text-sm">
                    <option>성공</option>
                    <option>실패</option>
                </select>
            </div>
              <div>
                <label className="block text-sm mb-1">로그인 성공/실패 이유</label>
                <select className="w-full border p-2 rounded text-sm">
                    <option>아이디 및 비밀번호 불일치</option>
                    <option>추가 예정</option>
                </select>
            </div>
            <div className="flex items-end gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">검색</button>
                <button className="px-4 py-2 border rounded text-sm">초기화</button>
            </div>
          </div>
    
          {/* 테이블 상단 툴바 */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex gap-4">
              <label><input type="checkbox" className="mr-1" /> 7개 선택됨</label>
              <button className="text-blue-600">일괄 노출</button>
            </div>
          </div>
    
          {/* 테이블 영역 */}
          <div className="bg-white border rounded-md overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                <th className="p-4 w-12 text-center"><input type="checkbox" className="w-4 h-4" /></th>
                <th className="p-4 w-16 text-center">번호</th>
                  <th className="p-3">로그인 ID</th>
                  <th className="p-3">로그인 IP</th>
                  <th className="p-3">발생일자</th>
                  <th className="p-3">로그인 성공/실패 여부</th>
                  <th className="p-3">로그인 성공/실패 이유</th>
                  <th className="p-3">?? 여부</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-center"><input type="checkbox" className="w-4 h-4" /></td>
                    <td className="p-4 text-gray-500">{index + 1}</td>
                    <td className="p-3 text-blue-600">{item.logId}</td>
                    <td className="p-3 text-blue-600">{item.logIp}</td>
                    <td className="p-3">{item.loggedDate}</td>
                    <td className="p-3 truncate max-w-xs">{item.logSOF}</td>
                    <td className="p-3">{item.logReason}</td>
                    <td className="p-3">
                      <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
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
}
export default AdminLogList;