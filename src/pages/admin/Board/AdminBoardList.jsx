import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';

const AdminBoardList = () => {
  const navigate = useNavigate();
    
  const boardData = Array(10).fill({
    id: '1',
    title: '2026 태풍 관련 안전 대비 사항 안내',
    writer: '관리자',
    enrollDate: '2026-01-10',
    updateDate: '2026-01-13',
    views: 2000,
    attachNum: 2
  });
        
  return (
    // 전체 컨테이너 배경 및 폰트 설정
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <div className="p-6">
        <BreadCrumb />
        <h1 className="text-2xl font-bold mb-6">공지사항</h1>

        {/* 검색 바 영역: 비율 조정 */}
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1.2fr] gap-4 bg-white p-5 border border-gray-200 rounded-sm mb-6 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">제목</label>
            <input type="text" placeholder="검색어를 입력해주세요." className="w-full border p-2 rounded-sm text-sm focus:outline-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">작성자</label>
            <input type="text" placeholder="이름 입력" className="w-full border p-2 rounded-sm text-sm focus:outline-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">등록일</label>
            <input type="date" className="w-full border p-2 rounded-sm text-sm focus:outline-blue-500 text-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">---</label>
            <select className="w-full border p-2 rounded-sm text-sm focus:outline-blue-500 bg-white">
              <option>전체</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="flex-1 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 transition">초기화</button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-sm text-sm font-medium hover:bg-blue-700 transition">검색</button>
          </div>
        </div>

        {/* 테이블 상단 툴바: 라디오 버튼 수정 */}
        <div className="flex justify-between items-center mb-4 text-sm font-medium">
          <div className="flex gap-6 items-center">

            <div className="flex items-center gap-4 border-l pl-6 border-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="batchAction"
                  className="w-4 h-4 appearance-auto accent-blue-600"
                  defaultChecked
                />
                <span>일괄 노출</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                <input
                  type="radio"
                  name="batchAction"
                  className="w-4 h-4 appearance-auto accent-blue-600"
                />
                <span>일괄 삭제</span>
              </label>
            </div>

            <div className="flex items-center gap-4 border-l pl-6 border-gray-300">
               <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                <input
                  type="radio"
                  name="batchAction"
                  className="w-4 h-4 appearance-auto accent-blue-600"
                />
                <span>오래된 순</span>
              </label>
               <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                <input
                  type="radio"
                  name="batchAction"
                  className="w-4 h-4 appearance-auto accent-blue-600"
                />
                <span>최신 순</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2"> 
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-sm transition-colors shadow-sm">
              수정
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-6 rounded-sm transition-colors">
              삭제
            </button>
          </div>
        </div>

        {/* 테이블 영역: 열 너비 불일치 해결 */}
        <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-sm text-center table-fixed">
            <thead className="bg-gray-100 border-b-2 border-gray-800">
              <tr className="text-gray-700 font-bold">
                <th className="p-4 w-12 text-center"><input type="checkbox" className="w-4 h-4" /></th>
                <th className="p-4 w-16 text-center">번호</th>
                <th className="p-4 w-auto text-left">제목</th>
                <th className="p-4 w-24">작성자</th>
                <th className="p-4 w-32">등록일</th>
                <th className="p-4 w-32">수정일</th>
                <th className="p-4 w-20">조회수</th>
                <th className="p-4 w-24">첨부파일</th>
                <th className="p-4 w-24 text-center">게시 여부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {boardData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition border-b border-gray-200">
                  <td className="p-4 text-center"><input type="checkbox" className="w-4 h-4" /></td>
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 text-left font-medium">
                    <span className="truncate block cursor-pointer hover:text-blue-600 hover:underline">
                      {item.title}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{item.writer}</td>
                  <td className="p-4 text-gray-500">{item.enrollDate}</td>
                  <td className="p-4 text-gray-500">{item.updateDate}</td>
                  <td className="p-4 text-gray-600">{item.views.toLocaleString()}</td>
                  <td className="p-4 text-gray-500">{item.attachNum}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       


        {/* flex 컨테이너로 설정 */}
        <div className="flex items-center mt-10 w-full">
          
          {/* 1. 왼쪽 빈 공간: 오른쪽 버튼과 대칭을 맞추어 페이지네이션을 중앙에 유지 */}
          <div className="flex-1"></div>

          {/* 2. 중앙 페이지네이션 영역 */}
          <div className="flex justify-center items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 transition">&lt;</button>
            <button className="w-10 h-10 bg-blue-900 text-white rounded font-medium shadow-sm">1</button>
            {[2, 3, 4, 5].map(num => (
              <button key={num} className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded transition">{num}</button>
            ))}
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 transition">&gt;</button>
          </div>

          {/* 3. 오른쪽 버튼 영역: flex-1과 text-right로 맨 오른쪽 정렬 */}
          <div className="flex-1 text-right">
            <button 
            onClick={() => navigate()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-sm transition-colors shadow-sm">
              등록하기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBoardList;