import React, { useState } from 'react';
// import AdminSideBar from '@/layouts/admin/AdminSideBar';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
const AdminCommonCodeList = () => {
  // 데이터 샘플 (추후 백엔드 API 연동 시 fetch로 가져올 부분)
  const [codes] = useState([
    { id: 1, groupCode: 'Category-1', groupName: '카테고리1', detailCode: 'ABCD-1', detailName: '행정구역', desc: '대한민국 행정 구역 코드번호', date: '2025-05-20 06:00', order: 1, visible: true },
    { id: 2, groupCode: 'Category-2', groupName: '카테고리2', detailCode: 'ABCD-2', detailName: '재난유형', desc: '대한민국 재난 유형 코드번호', date: '2025-05-20 06:00', order: 1, visible: true },
    { id: 3, groupCode: 'Category-3', groupName: '카테고리3', detailCode: 'ABCD-3', detailName: '대피소분류', desc: '지역별 행정구역 대피소 분류 코드번호', date: '2025-05-20 06:00', order: 1, visible: true },
    { id: 4, groupCode: 'Category-3', groupName: '카테고리3', detailCode: 'ABCD-3_2', detailName: '대피소 분류2', desc: '지역별 행정구역 대피소 분류 코드번호2', date: '2025-05-20 06:00', order: 2, visible: true },
    { id: 5, groupCode: 'Category-3', groupName: '카테고리3', detailCode: 'ABCD-3_3', detailName: '대피소 분류3', desc: '지역별 행정구역 대피소 분류 코드번호3', date: '2025-05-20 06:00', order: 3, visible: true },
    { id: 6, groupCode: 'Category-3', groupName: '카테고리3', detailCode: 'ABCD-3_4', detailName: '대피소 분류4', desc: '지역별 행정구역 대피소 분류 코드번호4', date: '2025-05-20 06:00', order: 4, visible: true },
    { id: 7, groupCode: 'Category-4', groupName: '카테고리4', detailCode: 'ABCD-4_1', detailName: '행동요령', desc: '재난별 재난대비 행동요령 코드번호', date: '2025-05-20 06:00', order: 1, visible: true },
  ]);

  return (
    
    <>
      {/* 우측 메인 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 컨텐츠 본문 */}
        <main className="p-8 overflow-y-auto">
          <BreadCrumb/>
          <h2 className="text-2xl  pb-4 font-bold text-gray-800">공통코드관리</h2>

          {/* 검색 필터 바 */}
          <section className="bg-white p-5 rounded-md border border-gray-200 shadow-sm flex gap-4 mb-6">
            <select className="border border-gray-300 rounded px-3 py-2 w-48 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
              <option>그룹코드 전체</option>
            </select>
            <select className="border border-gray-300 rounded px-3 py-2 w-48 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
              <option>상세코드 전체</option>
            </select>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="검색어를 입력해주세요" 
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <span className="absolute right-3 top-2 text-gray-400 cursor-pointer">✕</span>
            </div>
            <button className="bg-blue-50 border border-blue-200 text-blue-600 px-8 py-2 rounded text-sm font-semibold hover:bg-blue-100">검색</button>
          </section>

          {/* 데이터 리스트 섹션 */}
          <section className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-4 h-4 accent-blue-600" />
                  <span>9개 선택됨</span>
                </div>
                <button className="flex items-center gap-1 hover:text-red-500">
                  <span className="text-red-500 font-bold">✕</span> 일괄 삭제
                </button>
                <button className="flex items-center gap-1 hover:text-red-500">
                  <span className="text-red-500 font-bold">✕</span> 선택 삭제
                </button>
              </div>
              <button className="bg-[#e91e63] text-white px-5 py-1.5 rounded text-sm font-medium hover:bg-pink-700">삭제</button>
            </div>

            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                <tr>
                  <th className="py-3 px-4"><input type="checkbox" checked readOnly className="w-4 h-4 accent-blue-600" /></th>
                  <th className="py-3 px-2">그룹코드</th>
                  <th className="py-3 px-2">그룹코드명</th>
                  <th className="py-3 px-2">상세코드</th>
                  <th className="py-3 px-2">상세코드명</th>
                  <th className="py-3 px-2 text-left w-1/4">코드설명</th>
                  <th className="py-3 px-2">등록 일시</th>
                  <th className="py-3 px-2 text-center">순서</th>
                  <th className="py-3 px-2 text-center">노출</th>
                  <th className="py-3 px-2 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-center">
                {codes.map((code) => (
                  <tr key={code.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-4"><input type="checkbox" checked readOnly className="w-4 h-4 accent-blue-600" /></td>
                    <td className="py-4 px-2 font-medium">{code.groupCode}</td>
                    <td className="py-4 px-2 text-gray-500">{code.groupName}</td>
                    <td className="py-4 px-2 font-bold text-gray-700">{code.detailCode}</td>
                    <td className="py-4 px-2">{code.detailName}</td>
                    <td className="py-4 px-2 text-left text-gray-500 leading-tight">{code.desc}</td>
                    <td className="py-4 px-2 text-gray-400 text-[12px]">{code.date}</td>
                    <td className="py-4 px-2">{code.order}</td>
                    <td className="py-4 px-2">
                      <div className="w-10 h-5 bg-blue-500 rounded-full relative mx-auto cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <button className="border border-gray-300 rounded px-3 py-1 text-xs hover:bg-gray-50">보기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="py-8 flex justify-center items-center gap-1">
              <button className="px-3 text-gray-400 text-sm hover:text-gray-700"> 이전 </button>
              <button className="w-8 h-8 bg-[#002b5b] text-white rounded text-sm">1</button>
              {[2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className="w-8 h-8 text-gray-500 hover:bg-gray-100 rounded text-sm">{n}</button>
              ))}
              <span className="px-2 text-gray-400">···</span>
              <button className="w-8 h-8 text-gray-500 hover:bg-gray-100 rounded text-sm">120</button>
              <button className="px-3 text-gray-400 text-sm hover:text-gray-700"> 다음 </button>
            </div>
          </section>
        </main>
      </div>
</>
  );
};

export default AdminCommonCodeList;