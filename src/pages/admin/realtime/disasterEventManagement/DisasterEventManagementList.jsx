// src\pages\admin\realtime\disasterEventManagement\DisasterEventManagementList.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, RefreshCw, AlertCircle, Info } from "lucide-react";
// import api from "@/services/api";
import api, { disasterModalService } from "@/services/api";

// [공통 컴포넌트]
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

const DisasterEventManagementList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // 1. 상태 관리
  const today = new Date().toISOString().split("T")[0];
  const defaultStartDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  }, []);
  const [totalCount, setTotalCount] = useState(0); // 전체 데이터 개수
  const [weatherList, setWeatherList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // 업데이트 로딩 상태
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
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {},
  });

  // 2. 데이터 통합 페칭
  const fetchAllDisasters = useCallback(async () => {
    setIsLoading(true);
    try {
      // [API 호출]
      const [kmaRes, fireRes, eqRes, floodRes, typhoonRes] = await Promise.all([
        disasterModalService.getWeatherList(3), // 한파
        disasterModalService.getForestFireList(), // 산불
        disasterModalService.getEarthquakeList(), // 지진
        disasterModalService.getWeatherList(2), // 호우
        disasterModalService.getWeatherList(7), // 태풍
      ]);

      // [데이터 추출 헬퍼] 
      // api.js가 ApiResponse 객체({status, data: [], ...})를 반환하므로 res.data가 실제 리스트입니다.
      const getRawData = (res) => {
        if (res?.data && Array.isArray(res.data)) return res.data; 
        if (Array.isArray(res)) return res; 
        return [];
      };

      const kmaRaw = getRawData(kmaRes);
      const fireRaw = getRawData(fireRes);
      const eqRaw = getRawData(eqRes);
      const floodRaw = getRawData(floodRes);
      const typhoonRaw = getRawData(typhoonRes);

      // -----------------------------------------------------------
      // [수정] 날짜 포맷팅 로직 복구 (YYYYMMDDHHMM -> YYYY-MM-DD HH:MM:ss)
      // -----------------------------------------------------------

      // 1. 한파
      const mappedKma = kmaRaw.map((item, idx) => ({
        id: `WTH_${item.id}`, // 서버에서 받은 고유 ID만 사용 (식별자 prefix만 유지)
        serialNumber: String(item.tmSeq),
        type: "한파",
        region: item.areaName || "전북전역",
        content: `[한파특보] ${item.areaName} 지역 주의보 발령`,
        // ✨ 포맷팅 복구
        dateTime: item.tmFc && item.tmFc.length >= 10
          ? `${item.tmFc.substring(0, 4)}-${item.tmFc.substring(4, 6)}-${item.tmFc.substring(6, 8)} ${item.tmFc.substring(8, 10)}:00`
          : "-",
        status: "진행중",
        isVisible: item.isVisible,
      }));

      // 2. 호우
      const mappedFlood = floodRaw.map((item, idx) => ({
        id: `WTH_2_${item.tmSeq}_${item.stnId}_${idx}`,
        serialNumber: String(item.tmSeq),
        type: "호우",
        region: item.areaName || "전북전역",
        content: `[호우특보] ${item.areaName} 지역 특보 발령`,
        // ✨ 포맷팅 복구
        dateTime: item.tmFc && item.tmFc.length >= 10
          ? `${item.tmFc.substring(0, 4)}-${item.tmFc.substring(4, 6)}-${item.tmFc.substring(6, 8)} ${item.tmFc.substring(8, 10)}:00`
          : "-",
        status: "진행중",
        isVisible: item.isVisible,
      }));

      // 3. 태풍
      const mappedTyphoon = typhoonRaw.map((item, idx) => ({
        id: `WTH_7_${item.tmSeq}_${item.stnId}_${idx}`,
        serialNumber: String(item.tmSeq),
        type: "태풍",
        region: item.areaName || "전북전역",
        content: `[태풍특보] ${item.areaName} 태풍 특보`,
        // ✨ 포맷팅 복구
        dateTime: item.tmFc && item.tmFc.length >= 10
          ? `${item.tmFc.substring(0, 4)}-${item.tmFc.substring(4, 6)}-${item.tmFc.substring(6, 8)} ${item.tmFc.substring(8, 10)}:00`
          : "-",
        status: "진행중",
        isVisible: item.isVisible,
      }));

      // 4. 산불 (여긴 DB 포맷에 따라 다르지만 T제거 로직 유지)
      const mappedFire = fireRaw.map((item, idx) => ({
        id: `FIRE_${item.id}`,
        serialNumber: String(item.fireId),
        type: "산불",
        region: item.fireLocVillage || "지역정보 없음",
        content: `[산불위험] ${item.fireLocVillage} 인근 산불 위험`,
        dateTime: item.fireStartTime ? item.fireStartTime.replace("T", " ") : "-",
        status: "진행중",
        isVisible: item.isVisible,
      }));

      // 5. 지진
      const mappedEq = eqRaw.map((item, idx) => {
        const seq = item.seq || idx;
        // ✨ 포맷팅 복구
        const rawTime = String(item.tmFc || "");
        let formattedDate = "-";
        if (rawTime.length >= 12) {
             formattedDate = `${rawTime.substring(0, 4)}-${rawTime.substring(4, 6)}-${rawTime.substring(6, 8)} ${rawTime.substring(8, 10)}:${rawTime.substring(10, 12)}`;
        } else if (rawTime.length >= 8) {
             formattedDate = `${rawTime.substring(0, 4)}-${rawTime.substring(4, 6)}-${rawTime.substring(6, 8)}`;
        }

        return {
          id: `EQK_${item.seq}`,
          serialNumber: String(seq),
          type: "지진",
          region: item.loc || "지역정보 없음",
          content: `[지진발생] 규모 ${item.mt || "0.0"} / ${item.loc}`,
          dateTime: formattedDate,
          status: "진행중",
          isVisible: item.isVisible,
        };
      });

      const combined = [...mappedKma, ...mappedFlood, ...mappedTyphoon, ...mappedFire, ...mappedEq]
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

      setWeatherList(combined);
      setTotalCount(combined.length);
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
      const matchType =
        filters.disasterType === "전체" || item.type === filters.disasterType;
      const matchRegion =
        filters.region === "전체" ||
        (item.region && item.region.includes(filters.region));
      const matchStatus =
        filters.status === "전체" || item.status === filters.status;
      const itemDate = item.dateTime.split(" ")[0];
      const matchDate =
        itemDate >= filters.startDate && itemDate <= filters.endDate;
      const keyword = searchParams.keyword.trim().toLowerCase();
      const matchKeyword =
        !keyword ||
        (item.content && item.content.toLowerCase().includes(keyword)) ||
        (item.region && item.region.toLowerCase().includes(keyword));

      return (
        matchType && matchRegion && matchStatus && matchDate && matchKeyword
      );
    });
  }, [weatherList, filters, searchParams.keyword]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);


  // [기능 구현] 상태 변경 API 호출
  const processStatusUpdate = async (ids, isVisible) => {
    try {
        setIsUpdating(true);
        // [변경] disasterModalService 사용
        const response = await disasterModalService.updateDisasterStatus(ids, isVisible);

        if (response.status === "SUCCESS" || response.code === 200) {
            // UI 낙관적 업데이트
            setWeatherList(prev => prev.map(item => 
                ids.includes(item.id) ? { ...item, isVisible: isVisible } : item
            ));
            setSelectedIds([]); 
            return true;
        }
    } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경 중 오류가 발생했습니다.");
        return false;
    } finally {
        setIsUpdating(false);
    }
  };

  const handleSearch = () => setCurrentPage(1);
  const handleReset = () => {
    setFilters({
      disasterType: "전체",
      region: "전체",
      status: "전체",
      startDate: defaultStartDate,
      endDate: today,
    });
    setSearchParams({ keyword: "" });
    setCurrentPage(1);
  };

  // [추가] 개별 토글 핸들러
  const handleToggleVisible = async (id, currentVisible) => {
      // 즉시 UI 낙관적 업데이트 혹은 확인 절차 없이 API 호출
      // 여기서는 사용자 경험을 위해 API 호출 후 반영
      await processStatusUpdate([id], !currentVisible);
  };

  // 일괄 처리 핸들러
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    
    setModalConfig({
      title: `일괄 ${status ? "노출" : "비노출"} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{selectedIds.length}개]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? "노출" : "비노출"}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? "confirm" : "delete",
      onConfirm: async () => {
        const success = await processStatusUpdate(selectedIds, status);
        if(success) setIsModalOpen(false);
      },
    });
    setIsModalOpen(true);
  };

  // 4. 테이블 컬럼 정의 (디자인 동기화)
  const columns = useMemo(
    () => [
      {
        key: "serialNumber",
        header: "NO",
        width: "160px",
        className: "text-center",
      },
      {
        key: "type",
        header: "유형",
        width: "100px",
        className: "text-center",
        render: (val) => {
          const colors = {
            한파: "bg-blue-50 text-blue-600",
            산불: "bg-orange-50 text-orange-600",
            지진: "bg-red-50 text-red-600",
            태풍: "bg-purple-50 text-purple-600",
            호우: "bg-indigo-50 text-indigo-600",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-[12px] font-bold ${colors[val] || "bg-slate-50"}`}
            >
              {val}
            </span>
          );
        },
      },
      {
        key: "region",
        header: "발생 지역",
        width: "180px",
        className: "text-left",
      },
      { key: "content", header: "내용", className: "text-left" },
      {
        key: "dateTime",
        header: "발송 일시",
        width: "180px",
        className: "text-center",
      },
      {
        key: "status",
        header: "상태",
        width: "100px",
        className: "text-center",
        render: (val) => (
          <span
            className={`px-2 py-1 rounded text-[11px] font-bold border ${val === "진행중" ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}
          >
            {val}
          </span>
        ),
      },
      {
        key: "isVisible",
        header: "노출여부",
        width: "100px",
        render: (visible, row) => (
          <div className="flex justify-center">
             {/* 토글 버튼 구현 */}
              <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleVisible(row.id, visible);
              }}
              disabled={isUpdating}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${visible ? "bg-admin-primary" : "bg-gray-300"} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${visible ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>
        ),
      },
      /* 미비된 기능
      {
        key: "actions",
        header: "관리",
        width: "120px",
        className: "text-center",
        render: (_, row) => (
          <button
            onClick={() =>
              navigate(
                `/admin/realtime/disasterEventManagementDetail/${row.id}`,
              )
            }
            className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors font-normal"
          >
            보기
          </button>
          // <button onClick={() => navigate(`/admin/realtime/disasterEventManagementDetail/${row.id}`)} className="text-admin-primary hover:underline text-sm font-medium">관리</button>
        ),
      },
      */
    ],
    [navigate, isUpdating],
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-slate-900">
      <main className="p-10">
        {/* 타이틀 섹션 (디자인 동기화) */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">
              재난 발생 관리
            </h2>
            <div className="flex items-center gap-2 mt-2 text-slate-500">
              <Info size={14} className="text-admin-primary" />
              <p className="text-sm">
                최근 <span className="font-bold text-slate-700">한달간</span>{" "}
                전북지역에 발생한 실시간 재난 데이터만 수집하여 표시합니다.
              </p>
            </div>
          </div>
          <button
            onClick={fetchAllDisasters}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm font-medium"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />{" "}
            데이터 새로고침
          </button>
        </div>

        {/* 검색 박스 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            <div className="relative w-full md:w-40">
              <select
                value={filters.disasterType}
                onChange={(e) =>
                  setFilters({ ...filters, disasterType: e.target.value })
                }
                className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer focus:border-admin-primary"
              >
                <option value="전체">유형 전체</option>
                {["지진", "호우", "태풍", "산불", "한파"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />
            </div>

            <div className="relative w-full md:w-40">
              <select
                value={filters.region}
                onChange={(e) =>
                  setFilters({ ...filters, region: e.target.value })
                }
                className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer focus:border-admin-primary"
              >
                <option value="전체">발생지역 전체</option>
                {[
                  "전주",
                  "군산",
                  "익산",
                  "정읍",
                  "남원",
                  "김제",
                  "완주",
                  "진안",
                  "무주",
                  "장수",
                  "임실",
                  "순창",
                  "고창",
                  "부안",
                ].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />
            </div>
          </AdminSearchBox>
        </section>

        {/* 데이터 테이블 섹션 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
              <div className="flex items-center gap-4">
            <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">
                    {selectedIds.length}개 선택됨
                  </span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
            </span>
            <div className="flex items-center ml-4 gap-4">
            <button
                  onClick={() => handleBatchStatus(true)}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    <div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#111]">
                    일괄 노출
                  </span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button
                  onClick={() => handleBatchStatus(false)}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all">
                    <div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#666]">
                    일괄 비노출
                  </span>
                </button>
              </div>
              </div>
            {/* <button onClick={() => navigate("/admin/realtime/disasterEventManagementAdd")} className="px-6 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm text-sm">신규 등록</button> */}
            {/* 미비된 기능
            <button
              onClick={() =>
                navigate("/admin/realtime/disasterEventManagementAdd")
              }
              className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              등록
            </button>
            */}
          </div>

          <AdminDataTable
            columns={columns}
            data={paginatedData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            rowKey="id"
          />

          <div className="mt-10">
            <AdminPagination 
              currentPage={currentPage} 
              totalItems={filteredData.length} 
              itemsPerPage={itemsPerPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </section>
      </main>

      <AdminConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </div>
  );
};

export default DisasterEventManagementList;
