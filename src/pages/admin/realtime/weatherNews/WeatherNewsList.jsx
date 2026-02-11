// src\pages\admin\realtime\weatherNews\WeatherNewsList.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, Calendar } from "lucide-react";

// [공통 컴포넌트]
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

// [데이터 및 API 임포트]
import { disasterApi } from "@/services/api";
import { WEATHER_OPTIONS } from "./WeatherTypeData";

const WeatherNewsList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리
  // ==================================================================================
  const [weatherNews, setWeatherNews] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const defaultStartDate = lastMonth.toISOString().split("T")[0];

  // 필터 상태
  const [filters, setFilters] = useState({
    newsType: "전체",
    level: "전체",
    startDate: defaultStartDate,
    endDate: today,
  });

  // 검색어 상태 (검색 버튼 클릭 시 적용하기 위해 분리)
  const [searchParams, setSearchParams] = useState({ keyword: "" });
  const [appliedKeyword, setAppliedKeyword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {},
  });
  const [isLoading, setIsLoading] = useState(false);

  // ==================================================================================
  // 2. 데이터 호출 및 필터링 로직 (프론트엔드 필터링 방식)
  // ==================================================================================

  // [데이터 로드] 서버에서 전체 데이터를 가져옴
  const fetchWeatherData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await disasterApi.getSavedWeatherWarnings();
      // 백엔드 컨트롤러에서 Map에 담아 보내주므로 response.list 참조
      const rawList = response.list || response.data || [];

      // console.log("response>>>", response);

      const mappedData = rawList.map((item) => {
        // 1. ID 추출 (백엔드 DTO @JsonProperty 및 DB 별칭 대응)
        // const id = String(item.PRSNTN_SN);
        const id = String(item.prsntnSn || item.PRSNTN_SN || item.id || "");

        // 2. 제목 및 내용 (다양한 키값 대응)
        const title = item.ttl || item.TTL || "-";
        const content = item.content || item.SPNE_FRMNT_PRCON_CN || "-";
        // const weatherType = item.weatherType || "기타";
        const weatherType =
          item.warningType || item.warning_type || item.WARNING_TYPE || "기타";

        // 3. 날짜 처리 (중복 선언 제거 및 공백 제거)
        const rawTime = String(item.prsntnTm || item.PRSNTN_TM || "").trim();
        let formattedDate = rawTime;
        if (rawTime.length >= 12) {
          formattedDate = `${rawTime.substring(0, 4)}-${rawTime.substring(4, 6)}-${rawTime.substring(6, 8)} ${rawTime.substring(8, 10)}:${rawTime.substring(10, 12)}`;
        }

        // 4. 노출 여부 (Y/N 또는 true/false 대응)
        // const visibleVal = item.visible_yn
        const visibleVal = item.visibleYn || item.visible_yn || item.VISIBLE_YN;
        // const isVisible = visibleVal === "Y" || visibleVal === "y" || visibleVal === true;
        const vYn = item.visibleYn || item.visible_yn || item.VISIBLE_YN;
        const isVisible = vYn === "Y";
        // const isVisible = item.visible_yn === "Y";
        return {
          id,
          type: weatherType,
          level: item.level || "보통",
          title,
          content,
          dateTime: formattedDate,
          isVisible: isVisible,
        };
      });

      setWeatherNews(mappedData);
    } catch (error) {
      console.error("❌ 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // [실시간 필터링] 가공된 데이터에서 필터 조건에 맞는 것만 추출
  const filteredData = useMemo(() => {
    return weatherNews.filter((item) => {
      const matchType =
        filters.newsType === "전체" || item.type.includes(filters.newsType);
      const matchLevel =
        filters.level === "전체" || item.level === filters.level;
      const matchKeyword =
        !appliedKeyword || item.title.includes(appliedKeyword);

      // 날짜 비교 (YYYY-MM-DD 형식으로 통일)
      const itemDate = item.dateTime.split(" ")[0];
      const matchDate =
        itemDate >= filters.startDate && itemDate <= filters.endDate;

      return matchType && matchLevel && matchKeyword && matchDate;
    });
  }, [weatherNews, filters, appliedKeyword]);

  // [페이지네이션] 필터링된 데이터에서 현재 페이지만 슬라이싱
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // 브레드크럼 설정 및 초기 데이터 로드
  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("기상 특보 관리");
    fetchWeatherData();
  }, [setBreadcrumbTitle, fetchWeatherData]);

  // ==================================================================================
  // 3. 핸들러 (기능 구현)
  // ==================================================================================

  const handleSearch = () => {
    setAppliedKeyword(searchParams.keyword);
    setCurrentPage(1);
  };
  const handleReset = () => {
    setFilters({
      newsType: "전체",
      level: "전체",
      startDate: defaultStartDate,
      endDate: today,
    });
    setSearchParams({ keyword: "" });
    setAppliedKeyword("");
    setCurrentPage(1);
  };

  // 개별 노출 토글 핸들러
  const handleToggleVisible = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    const visibleYn = nextStatus ? "Y" : "N";

    setModalConfig({
      title: "노출 상태 변경",
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>
            해당 항목을{" "}
            <span
              className={`font-bold ${nextStatus ? "text-admin-primary" : "text-[#FF003E]"}`}
            >
              [{nextStatus ? "노출" : "비노출"}]
            </span>{" "}
            처리하시겠습니까?
          </p>
        </div>
      ),
      // 노출일 때는 일반 confirm(파랑), 비노출일 때는 경고 의미로 delete(빨강) 타입 적용
      type: nextStatus ? "confirm" : "delete",
      onConfirm: async () => {
        try {
          // 1. API 호출 (기상 특보 전용 API 확인 필요)
          await disasterApi.updateWeatherVisibility([id], visibleYn);

          // 2. 로컬 상태 업데이트 (setMessages -> setWeatherNews로 수정)
          setWeatherNews((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, isVisible: nextStatus } : item,
            ),
          );

          setIsModalOpen(false);
        } catch (error) {
          console.error("상태 변경 실패:", error);
          alert("서버 통신에 실패했습니다.");
        }
      },
    });
    setIsModalOpen(true);
  };

  // 일괄 처리
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");

    setModalConfig({
      title: `일괄 ${status ? "노출" : "비노출"} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>
            선택하신{" "}
            <span className="text-admin-primary font-bold">
              [{selectedIds.length}건]
            </span>{" "}
            항목을
          </p>
          <p>
            일괄{" "}
            <span className="font-bold underline">
              {status ? "노출" : "비노출"}
            </span>{" "}
            처리하시겠습니까?
          </p>
        </div>
      ),
      type: status ? "confirm" : "delete",
      onConfirm: async () => {
        try {
          await disasterApi.updateWeatherVisibility(
            selectedIds,
            status ? "Y" : "N",
          );
          setWeatherNews((prev) =>
            prev.map((item) =>
              selectedIds.includes(item.id)
                ? { ...item, isVisible: status }
                : item,
            ),
          );
          setSelectedIds([]);
          setIsModalOpen(false);
        } catch (e) {
          alert("변경 처리 중 오류가 발생했습니다.");
        }
      },
    });
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");

    setModalConfig({
      title: "선택 항목 삭제",
      message: (
        <p>선택하신 [{selectedIds.length}건] 항목을 삭제하시겠습니까?</p>
      ),
      type: "delete",
      onConfirm: async () => {
        try {
          await disasterApi.deleteWeatherWarnings(selectedIds);
          setWeatherNews((prev) =>
            prev.filter((item) => !selectedIds.includes(item.id)),
          );
          setSelectedIds([]);
          setIsModalOpen(false);
        } catch (e) {
          alert("삭제 실패");
        }
      },
    });
    setIsModalOpen(true);
  };

  const goDetail = useCallback(
    (id) => {
      navigate(`/admin/realtime/weatherNewsDetail/${id}`);
    },
    [navigate],
  );

  const columns = useMemo(
    () => [
      { key: "id", header: "NO", width: "100px", className: "text-center" },
      {
        key: "type",
        header: "특보유형",
        width: "100px",
        className: "text-center",
      },
      {
        key: "title",
        header: "특보내용",
        width: "500px",
        className: "text-left px-4",
      },
      {
        key: "dateTime",
        header: "발효일시",
        width: "160px",
        className: "text-center ",
      },
      {
        key: "isVisible",
        header: "노출여부",
        width: "100px",
        className: "text-center",
        render: (visible, row) => (
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleVisible(row.id, visible);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${visible ? "bg-admin-primary" : "bg-gray-300"}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${visible ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>
        ),
      },
      {
        key: "actions",
        header: "관리",
        width: "80px",
        className: "text-center",
        render: (_, row) => (
          <button
            onClick={() => goDetail(row.id)}
            className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors"
          >
            보기
          </button>
        ),
      },
    ],
    [goDetail],
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-bold">
          기상 특보 관리
        </h2>

        {/* 검색 필터 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 특보 유형 선택 */}
            <div className="relative w-full md:w-40">
              <select
                value={filters.newsType}
                onChange={(e) => {
                  setFilters({ ...filters, newsType: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none cursor-pointer"
              >
                <option value="전체">특보 유형</option>
                {WEATHER_OPTIONS.WEATHER_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none"
                size={18}
              />
            </div>

            {/* 경보 수준 선택 */}
            <div className="relative w-full md:w-40">
              <select
                value={filters.level}
                onChange={(e) => {
                  setFilters({ ...filters, level: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-primary font-bold focus:border-admin-primary outline-none cursor-pointer"
              >
                <option value="전체">경보 수준</option>
                {WEATHER_OPTIONS.WEATHER_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none"
                size={18}
              />
            </div>

            {/* 날짜 선택 범위 */}
            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white focus-within:border-admin-primary transition-all shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => {
                    setFilters({ ...filters, startDate: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="outline-none bg-transparent cursor-pointer text-body-m"
                />
                <span className="text-graygray-30 mx-1">-</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => {
                    setFilters({ ...filters, endDate: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="outline-none bg-transparent cursor-pointer text-body-m"
                />
              </div>
            </div>
          </AdminSearchBox>
        </section>

        {/* 리스트 영역 */}
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

            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm"
              >
                삭제
              </button>
              <button
                onClick={() => navigate("/admin/realtime/weatherNewsAdd")}
                className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm"
              >
                등록
              </button>
            </div>
          </div>

          <AdminDataTable
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            rowKey="id"
            isLoading={isLoading}
          />

          <div className="mt-10">
            <AdminPagination
              currentPage={currentPage}
              totalItems={filteredData.length}
              itemCountPerPage={itemsPerPage}
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

export default WeatherNewsList;
