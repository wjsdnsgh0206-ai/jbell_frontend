import React, { useState, useMemo, useCallback } from "react";
import { ChevronDown, Calendar, Search, Download, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';

/**
 * [관리자] 재난 통계 조회 페이지
 */
const DisasterStatisticsList = () => {
  // ==================================================================================
  // 1. 상태 관리
  // ==================================================================================
  const [disasterType, setDisasterType] = useState("all");
  const [startDate, setStartDate] = useState("2025-07-01");
  const [endDate, setEndDate] = useState("2025-08-01");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 차트 탭 상태
  const [activeTab, setActiveTab] = useState("disaster");

  // ==================================================================================
  // 2. 데이터 (Mock Data)
  // ==================================================================================
  const disasterTypes = [
    { value: "all", label: "재난유형 전체" },
    { value: "earthquake", label: "지진" },
    { value: "flood", label: "호우홍수" },
    { value: "landslide", label: "산사태" },
    { value: "typhoon", label: "태풍" },
    { value: "forestfire", label: "산불" },
    { value: "coldwave", label: "한파" },
  ];

  const tableData = [
    { id: 1, period: "2025년 07월", type: "태풍", count: 18, diff: 4, change: 22, trend: "up", ratio: "32%" },
    { id: 2, period: "2025년 06월", type: "호우홍수", count: 14, diff: 2, change: 14, trend: "up", ratio: "25%" },
    { id: 3, period: "2025년 05월", type: "산불", count: 12, diff: 3, change: 20, trend: "down", ratio: "21%" },
    { id: 4, period: "2025년 04월", type: "지진", count: 6, diff: 0, change: 0, trend: "none", ratio: "11%" },
    { id: 5, period: "2025년 03월", type: "한파", count: 10, diff: 5, change: 33, trend: "down", ratio: "11%" },
  ];

  const monthlyData = [
    { month: "1월", count: 7 }, { month: "2월", count: 5 }, { month: "3월", count: 10 },
    { month: "4월", count: 6 }, { month: "5월", count: 12 }, { month: "6월", count: 14 },
    { month: "7월", count: 21 }, { month: "8월", count: 18 }, { month: "9월", count: 9 },
    { month: "10월", count: 11 }, { month: "11월", count: 4 }, { month: "12월", count: 3 },
  ];

  // ==================================================================================
  // 3. 핸들러 및 컬럼 정의
  // ==================================================================================
  const handleSearch = () => {
    setCurrentPage(1);
    console.log("검색 실행:", { disasterType, startDate, endDate });
  };

  const handleReset = () => {
    setDisasterType("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const columns = useMemo(() => [
    { key: 'period', header: '조회 기간', className: 'text-center font-bold' },
    { 
      key: 'type', 
      header: '재난 유형', 
      className: 'text-center',
      render: (val) => (
        <span className="px-3 py-1 bg-gray-100 rounded-full text-[12px] font-black text-gray-500">
          {val}
        </span>
      )
    },
    { key: 'count', header: '발생 건수', className: 'text-center font-black text-admin-text-primary', render: (val) => `${val}건` },
    { 
      key: 'diff', 
      header: '전월 대비', 
      className: 'text-center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-gray-600">{row.diff}건</span>
          <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-black ${
            row.trend === 'up' ? 'bg-red-50 text-red-500' : 
            row.trend === 'down' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'
          }`}>
            {row.trend === 'up' ? <ArrowUp size={12} /> : row.trend === 'down' ? <ArrowDown size={12} /> : null}
            {row.change}%
          </div>
        </div>
      )
    },
    { key: 'ratio', header: '점유 비중', className: 'text-center font-black text-admin-primary' }
  ], []);

  // ==================================================================================
  // 4. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-black">통계 조회</h2>

        {/* [A] 검색 영역 - AdminSearchBox 스타일 적용 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox 
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 재난 유형 필터 */}
            <div className="relative w-full md:w-52">
              <select 
                value={disasterType} 
                onChange={(e) => setDisasterType(e.target.value)}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer font-bold"
              >
                {disasterTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 기간 필터 */}
            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white focus-within:border-admin-primary transition-all shrink-0">
              <div className="flex items-center gap-2">
                <div className="group relative flex items-center w-[140px]">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m font-bold" 
                  />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 pointer-events-none" />
                </div>
                <span className="text-graygray-30 mx-1">-</span>
                <div className="group relative flex items-center w-[140px]">
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m font-bold" 
                  />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 pointer-events-none" />
                </div>
              </div>
            </div>
          </AdminSearchBox>
        </section>

        {/* [B] 차트 시각화 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden mb-8">
          <div className="flex border-b border-admin-border bg-gray-50/50">
            {['disaster', 'weather'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 h-16 font-black text-[16px] transition-all relative ${
                  activeTab === tab ? "text-admin-primary bg-white" : "text-graygray-40 hover:text-graygray-60"
                }`}
              >
                {tab === 'disaster' ? '재난 발생 통계' : '기상특보 통계'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-admin-primary" />}
              </button>
            ))}
          </div>
          <div className="p-10">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-heading-m font-black text-admin-text-primary">월별 발생 추이</h3>
                <p className="text-body-m text-graygray-50">최근 1년간의 데이터를 기반으로 한 시각화 지표입니다.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-emerald-50 rounded-lg text-emerald-600 font-bold text-sm flex items-center gap-2">
                  <TrendingUp size={16} /> 전월 대비 12.5% 증가
                </div>
              </div>
            </div>
            
            {/* 커스텀 막대 차트 */}
            <div className="flex items-end justify-between h-[200px] px-4 border-b border-admin-border pb-2 relative group/chart">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="group relative flex flex-col items-center flex-1">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all bg-gray-800 text-white text-[11px] font-bold py-1.5 px-2.5 rounded shadow-lg z-10">
                    {data.count}건
                  </div>
                  <div 
                    className={`w-8 transition-all duration-500 ease-out rounded-t-sm ${
                        data.count > 15 ? 'bg-admin-primary' : 'bg-blue-300'
                    } group-hover:brightness-90 cursor-pointer`} 
                    style={{ height: `${data.count * 8}px` }} 
                  />
                  <span className="mt-4 text-[12px] font-bold text-graygray-40">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* [C] 테이블 데이터 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-heading-m font-black text-admin-text-primary text-[20px]">상세 통계 데이터</h3>
            <button className="flex items-center gap-2 px-5 py-3 bg-gray-800 text-white rounded-md font-bold hover:bg-gray-700 transition-all text-sm active:scale-95 shadow-lg">
              <Download size={16} /> 통계자료 다운로드 (CSV)
            </button>
          </div>

          {/* 공통 데이터 테이블 사용 */}
          <AdminDataTable 
            columns={columns} 
            data={tableData} 
            // 통계 페이지는 일괄 삭제가 불필요할 수 있으므로 체크박스 제외 가능
            showCheckbox={false} 
          />

          {/* 공통 페이지네이션 */}
          <div className="mt-8">
            <AdminPagination 
              currentPage={currentPage} 
              totalItems={tableData.length} 
              itemsPerPage={itemsPerPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default DisasterStatisticsList;