"use no memo";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, RefreshCw, AlertCircle, Info } from "lucide-react";
import axios from "axios";

// [공통 컴포넌트]
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

const DisasterEventManagementList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // 1. 상태 관리
  const today = new Date().toISOString().split('T')[0];
  const defaultStartDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }, []);

  const [weatherList, setWeatherList] = useState([]); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    disasterType: "전체",
    region: "전체",
    status: "전체",
    startDate: defaultStartDate,
    endDate: today,
  });

  const [searchParams, setSearchParams] = useState({ keyword: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "", message: "", type: "confirm", onConfirm: () => {},
  });

  // 2. 데이터 통합 페칭
  const fetchAllDisasters = useCallback(async () => {
    setIsLoading(true);
    try {
      const [kmaRes, fireRes, eqRes, floodRes, typhoonRes] = await Promise.all([
        axios.get("/api/disaster/fetch/weather-list?type=3"),
        axios.get("/api/disaster/fetch/forest-fire-list"),
        axios.get("/api/disaster/fetch/earthquake-list"),
        axios.get("/api/disaster/fetch/weather-list?type=2"),
        axios.get("/api/disaster/fetch/weather-list?type=7"),
      ]);

      const getRawData = (res) => {
        if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (Array.isArray(res.data)) return res.data;
        return [];
      };

      const kmaRaw = getRawData(kmaRes);
      const fireRaw = getRawData(fireRes);
      const eqRaw = getRawData(eqRes);
      const floodRaw = getRawData(floodRes);
      const typhoonRaw = getRawData(typhoonRes);

      const mappedKma = kmaRaw.map((item, idx) => ({
        id: `WTH_3_${item.tmSeq}_${item.stnId}_${idx}`, 
        serialNumber: String(item.tmSeq),
        type: "한파", 
        region: item.areaName || "전북전역",
        content: `[한파특보] ${item.areaName} 지역 주의보 발령`,
        dateTime: item.tmFc ? `${item.tmFc.substring(0, 4)}-${item.tmFc.substring(4, 6)}-${item.tmFc.substring(6, 8)} ${item.tmFc.substring(8, 10)}:00` : "-",
        status: "진행중", isVisible: true,
      }));

      const mappedFlood = floodRaw.map((item, idx) => ({
        id: `WTH_2_${item.tmSeq}_${item.stnId}_${idx}`, 
        serialNumber: String(item.tmSeq),
        type: "호우", 
        region: item.areaName || "전북전역",
        content: `[호우특보] ${item.areaName} 지역 특보 발령`,
        dateTime: item.tmFc ? `${item.tmFc.substring(0, 4)}-${item.tmFc.substring(4, 6)}-${item.tmFc.substring(6, 8)} ${item.tmFc.substring(8, 10)}:00` : "-",
        status: "진행중", isVisible: true,
      }));

      const mappedTyphoon = typhoonRaw.map((item, idx) => ({
        id: `WTH_7_${item.tmSeq}_${item.stnId}_${idx}`, 
        serialNumber: String(item.tmSeq),
        type: "태풍", 
        region: item.areaName || "전북전역",
        content: `[태풍특보] ${item.areaName} 지역 태풍 특보 발령`,
        dateTime: item.tmFc ? `${item.tmFc.substring(0, 4)}-${item.tmFc.substring(4, 6)}-${item.tmFc.substring(6, 8)} ${item.tmFc.substring(8, 10)}:00` : "-",
        status: "진행중", isVisible: true,
      }));

      const mappedFire = fireRaw.map((item, idx) => ({
        id: `FIRE_${item.fireId}_${idx}`,
        serialNumber: String(item.fireId),
        type: "산불",
        region: item.fireLocVillage || "지역정보 없음",
        content: `[산불위험] ${item.fireLocVillage} 인근 산불 위험 예보`,
        dateTime: item.fireStartTime ? item.fireStartTime.replace('T', ' ').substring(0, 16) : "-",
        status: "진행중", isVisible: true,
      }));

      const mappedEq = eqRaw.map((item, idx) => {
        const earthquakeSeq = item.TM_SEQ || item.SEQ || item.seq || idx;
        const rawTime = String(item.TM_EQK || item.tmEqk || item.tmFc || "");
        let formattedDate = "-";
        if (rawTime.length >= 12) {
          formattedDate = `${rawTime.substring(0, 4)}-${rawTime.substring(4, 6)}-${rawTime.substring(6, 8)} ${rawTime.substring(8, 10)}:${rawTime.substring(10, 12)}`;
        }
        return {
          id: `EQK_${earthquakeSeq}_${idx}`,
          serialNumber: String(earthquakeSeq),
          type: "지진",
          region: item.LOC || item.loc || "지역정보 없음",
          content: `[지진발생] 규모 ${item.MT || item.mt || '0.0'} / 위치: ${item.LOC || item.loc}`,
          dateTime: formattedDate,
          status: "진행중", isVisible: true,
        };
      });

      const combined = [...mappedKma, ...mappedFlood, ...mappedTyphoon, ...mappedFire, ...mappedEq]
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

      setWeatherList(combined);
    } catch (error) {
      console.error(">>> 데이터 통합 로딩 에러 <<<", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 발생 관리");
    fetchAllDisasters();
  }, [setBreadcrumbTitle, fetchAllDisasters]);

  // 3. 필터링 및 페이징
  const filteredData = useMemo(() => {
    return weatherList.filter((item) => {
      const matchType = filters.disasterType === "전체" || item.type === filters.disasterType;
      const matchRegion = filters.region === "전체" || (item.region && item.region.includes(filters.region));
      const matchStatus = filters.status === "전체" || item.status === filters.status;
      const itemDate = item.dateTime.split(" ")[0];
      const matchDate = itemDate >= filters.startDate && itemDate <= filters.endDate;
      const keyword = searchParams.keyword.trim().toLowerCase();
      const matchKeyword = !keyword || 
                           (item.content && item.content.toLowerCase().includes(keyword)) || 
                           (item.region && item.region.toLowerCase().includes(keyword));

      return matchType && matchRegion && matchStatus && matchDate && matchKeyword;
    });
  }, [weatherList, filters, searchParams.keyword]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleSearch = () => setCurrentPage(1);
  const handleReset = () => {
    setFilters({ disasterType: "전체", region: "전체", status: "전체", startDate: defaultStartDate, endDate: today });
    setSearchParams({ keyword: "" });
    setCurrentPage(1);
  };

  // 4. 테이블 컬럼 정의 (디자인 동기화)
  const columns = useMemo(() => [
    { key: "serialNumber", header: "재난일련번호", width: "160px", className: "text-center font-mono text-[11px] text-slate-500" },
    { 
      key: "type", 
      header: "유형", 
      width: "100px", 
      className: "text-center",
      render: (val) => {
        const colors = {
          '한파': 'bg-blue-50 text-blue-600',
          '산불': 'bg-orange-50 text-orange-600',
          '지진': 'bg-red-50 text-red-600',
          '태풍': 'bg-purple-50 text-purple-600',
          '호우': 'bg-indigo-50 text-indigo-600',
        };
        return <span className={`px-2 py-1 rounded text-[12px] font-bold ${colors[val] || 'bg-slate-50'}`}>{val}</span>;
      }
    },
    { key: "region", header: "발생 지역", width: "180px", className: "text-left font-semibold" },
    { key: "content", header: "내용", className: "text-left whitespace-pre-wrap text-slate-600 text-[13px]" },
    { key: "dateTime", header: "발송 일시", width: "180px", className: "text-center text-slate-400 text-[12px]" },
    {
      key: "status", header: "상태", width: "100px", className: "text-center",
      render: (val) => (
        <span className={`px-2 py-1 rounded text-[11px] font-bold border ${val === "진행중" ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
          {val}
        </span>
      ),
    },
    {
      key: "isVisible", header: "노출여부", width: "100px",
      render: (visible, row) => (
        <div className="flex justify-center">
          <button className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${visible ? "bg-admin-primary" : "bg-gray-300"}`}>
            <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform ${visible ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      ),
    },
    {
      key: "actions", header: "관리", width: "80px", className: "text-center",
      render: (_, row) => (
        <button onClick={() => navigate(`/admin/realtime/disasterEventManagementDetail/${row.id}`)} className="text-admin-primary hover:underline text-sm font-medium">관리</button>
      ),
    },
  ], [navigate]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-slate-900">
      <main className="p-10">
        {/* 타이틀 섹션 (디자인 동기화) */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">재난 발생 관리</h2>
            <div className="flex items-center gap-2 mt-2 text-slate-500">
              <Info size={14} className="text-admin-primary" />
              <p className="text-sm">최근 <span className="font-bold text-slate-700">한달간</span> 전북지역에 발생한 실시간 재난 데이터만 수집하여 표시합니다.</p>
            </div>
          </div>
          <button 
            onClick={fetchAllDisasters}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm font-medium"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> 데이터 새로고침
          </button>
        </div>

        {/* 검색 박스 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox searchParams={searchParams} setSearchParams={setSearchParams} onSearch={handleSearch} onReset={handleReset}>
            <div className="relative w-full md:w-40">
              <select value={filters.disasterType} onChange={(e) => setFilters({ ...filters, disasterType: e.target.value })} className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer focus:border-admin-primary">
                <option value="전체">유형 전체</option>
                {["지진", "호우", "태풍", "산불", "한파"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
            
            <div className="relative w-full md:w-40">
              <select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer focus:border-admin-primary">
                <option value="전체">발생지역 전체</option>
                {["전주", "군산", "익산", "정읍", "남원", "김제", "완주", "진안", "무주", "장수", "임실", "순창", "고창", "부안"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        {/* 데이터 테이블 섹션 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-body-m-bold text-slate-700">검색 결과</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-bold">{filteredData.length}</span>
            </div>
            <button onClick={() => navigate("/admin/realtime/disasterEventManagementAdd")} className="px-6 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm text-sm">신규 등록</button>
          </div>
          
          <AdminDataTable columns={columns} data={paginatedData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} rowKey="id" />
          
          <div className="mt-10">
            <AdminPagination currentPage={currentPage} totalItems={filteredData.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
          </div>
        </section>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default DisasterEventManagementList;