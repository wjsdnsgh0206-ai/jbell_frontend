import React, { useState, useMemo } from "react";
import { Search, Calendar, Download, ChevronDown, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

/**
 * [통계 조회 메인 페이지]
 * 모든 섹션을 하나로 합친 통합 컴포넌트
 */
const DisasterStatistics = () => {
  return (
    <main className="relative w-full min-h-screen p-10 font-sans antialiased text-[#1d1d1d]">
      <header className="mb-8">
        <h1 className="font-bold text-[40px] tracking-tight text-[#1d1d1d]">
          통계 조회
        </h1>
      </header>

      {/* 1. 필터 섹션 */}
      <FilterInputSection />

      {/* 2. 차트 섹션 */}
      <div className="mt-8">
        <StatisticsChartSection />
      </div>

      {/* 3. 테이블 섹션 */}
      <div className="mt-8">
        <StatisticsTableSection />
      </div>
    </main>
  );
};

// --- [컴포넌트 1: 필터 입력 영역] ---
const FilterInputSection = () => {
  const [disasterType, setDisasterType] = useState("전체");
  const [region, setRegion] = useState("전체");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [startDate, setStartDate] = useState("2023-10-10");
  const [endDate, setEndDate] = useState("2023-11-10");

  const periodButtons = [
    { label: "1주일", value: "1week" },
    { label: "1개월", value: "1month" },
    { label: "3개월", value: "3months" },
    { label: "1년", value: "1year" },
  ];

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-end gap-6">
      {/* 재난 유형 */}
      <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
        <label className="text-sm font-medium text-gray-600">재난 유형</label>
        <div className="relative">
          <select
            value={disasterType}
            onChange={(e) => setDisasterType(e.target.value)}
            className="w-full h-14 px-4 bg-gray-50 border border-gray-300 rounded-lg outline-none appearance-none font-medium"
          >
            <option value="전체">전체</option>
            <option value="지진">지진</option>
            <option value="호우홍수">호우홍수</option>
            <option value="산사태">산사태</option>
            <option value="태풍">태풍</option>
            <option value="산불">산불</option>
            <option value="한파">한파</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      {/* 지역 선택 */}
      <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
        <label className="text-sm font-medium text-gray-600">지역 선택</label>
        <div className="relative">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full h-14 px-4 bg-gray-50 border border-gray-300 rounded-lg outline-none appearance-none font-medium"
          >
            <option value="전체">전체</option>
            <option value="서울">서울</option>
            <option value="전북">전북</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      {/* 기간 버튼 */}
      <div className="flex gap-2 h-14">
        {periodButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setSelectedPeriod(btn.value)}
            className={`px-5 rounded-lg border font-medium transition-all ${
              selectedPeriod === btn.value 
              ? "bg-blue-600 text-white border-blue-600 shadow-md" 
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 날짜 입력 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">조회 기간</label>
        <div className="flex items-center gap-2 h-14 px-4 bg-gray-50 border border-gray-300 rounded-lg">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent outline-none font-medium" 
          />
          <span className="text-gray-400">~</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent outline-none font-medium" 
          />
          <Calendar size={18} className="text-gray-400 ml-2" />
        </div>
      </div>

      {/* 조회 버튼 */}
      <button className="h-14 px-8 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
        <Search size={20} /> 조회
      </button>
    </div>
  );
};

// --- [컴포넌트 2: 차트 영역] ---
const StatisticsChartSection = () => {
  const [activeTab, setActiveTab] = useState("disaster");

  const monthlyData = [
    { month: "1월", count: 7 }, { month: "2월", count: 5 }, { month: "3월", count: 10 },
    { month: "4월", count: 6 }, { month: "5월", count: 9 }, { month: "6월", count: 9 },
    { month: "7월", count: 9 }, { month: "8월", count: 9 }, { month: "9월", count: 9 },
    { month: "10월", count: 11 }, { month: "11월", count: 3 }, { month: "12월", count: 3 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("disaster")}
          className={`flex-1 h-14 font-bold text-lg transition-all ${activeTab === "disaster" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-400"}`}
        >
          재난 발생 통계
        </button>
        <button
          onClick={() => setActiveTab("weather")}
          className={`flex-1 h-14 font-bold text-lg transition-all ${activeTab === "weather" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-400"}`}
        >
          기상특보 통계
        </button>
      </div>

      {/* 차트 본문 */}
      <div className="p-10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold text-blue-900">월별 재난 발생 추이</h3>
          <div className="flex items-center gap-2 text-emerald-500 font-bold">
            <TrendingUp size={18} /> +2.45% 증가
            <span className="text-gray-400 font-normal ml-4">단위: 건</span>
          </div>
        </div>

        {/* 막대 그래프 시뮬레이션 */}
        <div className="flex items-end justify-between h-[160px] px-4 border-b border-gray-200 pb-2">
          {monthlyData.map((data, idx) => (
            <div key={idx} className="group relative flex flex-col items-center flex-1">
              {/* 툴팁 */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded">
                {data.count}건
              </div>
              {/* 막대 */}
              <div 
                className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all hover:brightness-110" 
                style={{ height: `${data.count * 12}px` }} 
              />
              <span className="mt-4 text-xs font-bold text-gray-400">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- [컴포넌트 3: 테이블 영역] ---
const StatisticsTableSection = () => {
  const tableData = [
    { period: "2025년 04월", type: "지진", count: "120건", diff: "25건", change: 2, trend: "down", ratio: "25%" },
    { period: "2025년 05월", type: "지진", count: "80건", diff: "15건", change: 4, trend: "up", ratio: "18%" },
    { period: "2025년 06월", type: "지진", count: "80건", diff: "15건", change: 4, trend: "up", ratio: "18%" },
    { period: "2025년 07월", type: "지진", count: "80건", diff: "15건", change: 4, trend: "up", ratio: "18%" },
    { period: "2025년 08월", type: "지진", count: "80건", diff: "15건", change: 4, trend: "up", ratio: "18%" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">상세 통계 데이터</h3>
        <button className="flex items-center gap-2 text-gray-700 font-medium hover:underline">
          <Download size={18} /> 목록 다운로드
        </button>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-50/50 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-700">기간</th>
              <th className="p-2 font-bold text-gray-700 text-center">재난유형</th>
              <th className="p-2 font-bold text-gray-700 text-center">특보유형</th>
              <th className="p-4 font-bold text-gray-700 text-center">발생 건수</th>
              <th className="p-4 font-bold text-gray-700 text-center">전년 대비</th>
              <th className="p-4 font-bold text-gray-700 text-center">비중</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-[17px] font-medium">{row.period}</td>
                <td className="p-4 text-center">{row.type}</td>
                <td className="p-4 text-center font-bold">{row.count}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <span>{row.diff}</span>
                    <div className={`flex items-center gap-0.5 text-xs font-bold ${row.trend === 'up' ? 'text-red-500' : 'text-blue-500'}`}>
                      {row.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {row.change}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center font-bold text-blue-600">{row.proportion || row.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisasterStatistics;