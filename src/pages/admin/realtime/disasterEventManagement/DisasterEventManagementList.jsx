"use no memo";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, Calendar } from "lucide-react";
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
    date.setDate(date.getDate() - 30); // 지진 데이터를 위해 넉넉히 한 달 설정
    return date.toISOString().split('T')[0];
  }, []);

  const [weatherList, setWeatherList] = useState([]); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  // 2. 데이터 통합 페칭 (한파 + 산불 + 지진)
  const fetchAllDisasters = useCallback(async () => {
    try {
      const [kmaRes, fireRes, eqRes] = await Promise.all([
        axios.get("http://localhost:8080/api/disaster/fetch/weather-list?type=3"),
        axios.get("http://localhost:8080/api/disaster/fetch/forest-fire-list"),
        axios.get("http://localhost:8080/api/disaster/fetch/earthquake-list")
      ]);

      const kmaRaw = kmaRes.data?.data || kmaRes.data || [];
      const fireRaw = fireRes.data?.data || fireRes.data || [];
      const eqRaw = eqRes.data?.data || eqRes.data || [];

      // 1) 한파 매핑
      const mappedKma = kmaRaw.map((item) => {
        let formattedDate = item.tmFc || "";
        if (formattedDate.length >= 8) {
          formattedDate = `${formattedDate.substring(0, 4)}-${formattedDate.substring(4, 6)}-${formattedDate.substring(6, 8)} ${formattedDate.substring(8, 10)}:00`;
        }
        return {
          id: `WTH_${item.tmSeq}_${item.stnId}`, 
          serialNumber: String(item.tmSeq),
          type: "한파", 
          region: item.areaName || "전북전역",
          content: `[한파특보] ${item.areaName} 지역 주의보 발령`,
          dateTime: formattedDate,
          status: "진행중",
          isVisible: true,
        };
      });

      // 2) 산불 매핑
      const mappedFire = fireRaw.map((item) => {
        const rawDate = item.fireStartTime || "";
        const formattedDate = rawDate.replace('T', ' ').substring(0, 16);
        return {
          id: `FIRE_${item.fireId}`,
          serialNumber: String(item.fireId),
          type: "산불",
          region: item.fireLocVillage || "지역정보 없음",
          content: `[산불위험] ${item.fireLocVillage} 인근 산불 위험 예보`,
          dateTime: formattedDate,
          status: "진행중",
          isVisible: true,
        };
      });

      // 3) ✅ 지진 매핑 (기상청 SEQ 일련번호 적용)
      const mappedEq = eqRaw.map((item) => {
        // 지진 고유 일련번호 추출 (기상청 SEQ 필드)
        const earthquakeSeq = item.TM_SEQ || item.SEQ || item.seq || "0";
        const rawTime = String(item.TM_EQK || item.tmEqk || item.tmFc || "");
        
        let formattedDate = "0000-00-00 00:00";
        if (rawTime.length >= 12) {
          formattedDate = `${rawTime.substring(0, 4)}-${rawTime.substring(4, 6)}-${rawTime.substring(6, 8)} ${rawTime.substring(8, 10)}:${rawTime.substring(10, 12)}`;
        }

        return {
          id: `EQK_${earthquakeSeq}`, // 고유 ID
          serialNumber: String(earthquakeSeq), // ✅ 리스트에 표시될 일련번호
          type: "지진",
          region: item.LOC || item.loc || "지역정보 없음",
          content: `[지진발생] 규모 ${item.MT || item.mt || '0.0'} / 위치: ${item.LOC || item.loc}`,
          dateTime: formattedDate,
          status: "진행중",
          isVisible: true,
        };
      });

      // 통합 및 정렬
      const combined = [...mappedKma, ...mappedFire, ...mappedEq].sort((a, b) => 
        new Date(b.dateTime) - new Date(a.dateTime)
      );

      setWeatherList(combined);
    } catch (error) {
      console.error(">>> 데이터 통합 로딩 에러 <<<", error);
    }
  }, []);

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 발생 관리");
    fetchAllDisasters();
  }, [setBreadcrumbTitle, fetchAllDisasters]);

  // 필터링 및 페이징 로직 (기존 유지)
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

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: `선택하신 ${selectedIds.length}건을 일괄 ${status ? '노출' : '비노출'} 처리하시겠습니까?`,
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setWeatherList(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, isVisible: status } : item));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const columns = useMemo(() => [
    { key: "serialNumber", header: "재난일련번호", width: "160px", className: "text-center font-mono" },
    { 
      key: "type", 
      header: "유형", 
      width: "100px", 
      className: "text-center",
      render: (val) => {
        const colors = { '산불': 'text-orange-600', '한파': 'text-blue-600', '지진': 'text-red-600' };
        return <span className={`px-2 py-1 rounded font-bold ${colors[val] || 'text-gray-600'}`}>{val}</span>;
      }
    },
    { key: "region", header: "발생 지역", width: "180px", className: "text-left" },
    { key: "content", header: "내용", className: "text-left whitespace-pre-wrap" },
    { key: "dateTime", header: "발송 일시", width: "180px", className: "text-center text-gray-500" },
    {
      key: "status", header: "상태", width: "100px", className: "text-center",
      render: (val) => (
        <span className={`px-2 py-1 rounded text-[11px] font-bold border ${val === "진행중" ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
          {val}
        </span>
      ),
    },
    {
      key: "isVisible", header: "노출여부", width: "100px",
      render: (visible) => (
        <div className="flex justify-center">
          <button className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${visible ? "bg-admin-primary" : "bg-gray-300"}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${visible ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      ),
    },
    {
      key: "actions", header: "상세", width: "80px", className: "text-center",
      render: (_, row) => (
        <button onClick={() => navigate(`/admin/realtime/disasterEventManagementDetail/${row.id}`)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors font-normal">보기</button>
      ),
    },
  ], [navigate]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-bold">재난 발생 관리</h2>

        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox searchParams={searchParams} setSearchParams={setSearchParams} onSearch={handleSearch} onReset={handleReset}>
            <div className="relative w-full md:w-40">
              <select value={filters.disasterType} onChange={(e) => setFilters({ ...filters, disasterType: e.target.value })} className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer">
                <option value="전체">유형 전체</option>
                {["지진", "호우홍수", "산사태", "태풍", "산불", "한파"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
            {/* ... (이전과 동일한 필터 구조) ... */}
            <div className="relative w-full md:w-40">
              <select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer">
                <option value="전체">발생지역 전체</option>
                {["전주", "군산", "익산", "정읍", "남원", "김제", "완주", "진안", "무주", "장수", "임실", "순창", "고창", "부안"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <span className="text-body-m-bold text-admin-text-secondary">전체 {filteredData.length}건</span>
            <button onClick={() => navigate("/admin/realtime/disasterEventManagementAdd")} className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">등록</button>
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