"use no memo";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Activity,
  RefreshCw,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

const DisasterManagementList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [selectedIds, setSelectedIds] = useState([]);
  // 1. 상태 관리
  const [disasters, setDisasters] = useState([
    // --- 새로 추가된 항목 ---
    {
      id: "WTH_TYPH_001",
      apiName: "기상청 태풍 통보 서비스",
      category: "태풍",
      requestUrl: "/disaster/fetch/typhoon-list", // 기존 스타일대로 /api 생략
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
    {
      id: "WTH_RAIN_001",
      apiName: "기상청 호우특보 영향예보",
      category: "호우",
      requestUrl: "/disaster/fetch/weather-list?type=2",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
    // {
    //   id: "WTH_WATR_001",
    //   apiName: "한강홍수통제소 댐/하천 수위 정보",
    //   category: "댐수위",
    //   requestUrl: "/disaster/fetch/water-level-list",
    //   apiStatus: "체크중",
    //   visibleYn: "Y",
    //   updatedAt: "-",
    // },
    // --- 기존 항목 유지 ---
    {
      id: "WTH_COLD_001",
      apiName: "기상청 한파 영향예보 조회 서비스",
      category: "한파",
      requestUrl: "/disaster/fetch/weather-list?type=3",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
    {
      id: "WTH_FIRE_001",
      apiName: "산불 위험 예보 정보 서비스",
      category: "산불",
      requestUrl: "/disaster/fetch/forest-fire-list",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
    {
      id: "WTH_FIRE_002",
      apiName: "산림청 실시간 산불 위험 지수",
      category: "산불",
      requestUrl: "/disaster/fetch/forest-fire-risk-list",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
    {
      id: "WTH_EQK_001",
      apiName: "기상청 국내 지진 통보 서비스",
      category: "지진",
      requestUrl: "/disaster/fetch/earthquake-list",
      apiStatus: "체크중",
      visibleYn: "Y",
      updatedAt: "-",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {},
  });

  const handleBatchVisible = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const statusText = status === "Y" ? "노출" : "비노출";

    setModalConfig({
      title: `일괄 ${statusText} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>
            선택하신{" "}
            <span className="text-admin-primary font-bold">
              [{selectedIds.length}개]
            </span>{" "}
            API를
          </p>
          <p>
            일괄 <span className="font-bold underline">{statusText}</span>{" "}
            처리하시겠습니까?
          </p>
        </div>
      ),
      type: status === "Y" ? "confirm" : "delete",
      onConfirm: () => {
        setDisasters((prev) =>
          prev.map((item) =>
            selectedIds.includes(item.id)
              ? { ...item, visibleYn: status }
              : item,
          ),
        );
        setSelectedIds([]);
        setIsModalOpen(false);
      },
    });
    setIsModalOpen(true);
  };

  // 2. 실시간 GET 요청 상태 체크 (기존 로직 그대로 유지)
  const checkApiStatus = useCallback(async () => {
    setDisasters((prev) =>
      prev.map((item) => ({ ...item, apiStatus: "체크중" })),
    );

    const updatedData = await Promise.all(
      disasters.map(async (item) => {
        try {
          const baseUrl = import.meta.env.VITE_API_BASE_URL;
          const res = await axios.get(`${baseUrl}${item.requestUrl}`, {
            timeout: 5000,
          });

          if (res.status === 200) {
            return {
              ...item,
              apiStatus: "정상",
              updatedAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            };
          }
          return {
            ...item,
            apiStatus: "비정상",
            updatedAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        } catch (error) {
          return {
            ...item,
            apiStatus: "비정상",
            updatedAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        }
      }),
    );

    setDisasters(updatedData);
  }, [disasters.length]);

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 API 관리");
    checkApiStatus();
  }, []);

  const handleToggleVisible = useCallback(
    (id, currentStatus) => {
      const nextStatus = currentStatus === "Y" ? "N" : "Y";
      const target = disasters.find((d) => d.id === id);

      setModalConfig({
        title: "노출 상태 변경",
        message: (
          <p>
            {target?.category} 정보를 지도에서{" "}
            <b>{nextStatus === "Y" ? "노출" : "비노출"}</b>하시겠습니까?
          </p>
        ),
        type: "confirm",
        onConfirm: () => {
          setDisasters((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, visibleYn: nextStatus } : item,
            ),
          );
          setIsModalOpen(false);
        },
      });
      setIsModalOpen(true);
    },
    [disasters],
  );

  // 3. 테이블 컬럼 정의 (새로 추가된 유형 컬러 매핑 추가)
  const columns = useMemo(
    () => [
      { key: "id", header: "NO", width: "140px", className: "text-center" },
      {
        key: "apiName",
        header: "API 명칭",
        width: "240px",
        className: "font-left",
        render: (val) => <span>{val}</span>,
      },
      {
        key: "category",
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
            댐수위: "bg-cyan-50 text-cyan-600",
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
        key: "requestUrl",
        header: "백엔드 요청 URL",
        className: "text-left",
        render: (val) => (
          <div className="flex items-center gap-2 text-slate-400">
            <LinkIcon size={14} className="flex-shrink-0" />
            <span
              className="truncate max-w-[300px] text-[12px] bg-slate-50 px-2 py-1 rounded"
              title={val}
            >
              {val}
            </span>
          </div>
        ),
      },
      {
        key: "apiStatus",
        header: "상태",
        width: "120px",
        className: "text-center",
        render: (val) => (
          <span
            className={`px-3 py-1 rounded text-[12px] font-bold border transition-colors ${
              val === "정상"
                ? "bg-green-100 text-green-700 border-green-200"
                : val === "체크중"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {val === "체크중" ? "확인중" : val}
          </span>
        ),
      },

      {
        key: "updatedAt",
        header: "최근 점검",
        width: "110px",
        className: "text-center",
      },

    ],
    [handleToggleVisible, navigate],
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-slate-900">
      <main className="p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">
              재난 API 관리
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              기상청 및 산림청 외부 API 데이터의 백엔드 연동 상태를 실시간
              점검합니다.
            </p>
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          {/* ✨ [추가] 일괄 처리 버튼 영역 (디자인 유지) */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">
                    {selectedIds.length}개 선택됨
                  </span>
                ) : (
                  `전체 ${disasters.length}건`
                )}
              </span>
              <div className="flex items-center ml-4 gap-4">
                <button
                  onClick={() => handleBatchVisible("Y")}
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
                  onClick={() => handleBatchVisible("N")}
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
                onClick={checkApiStatus}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm font-medium"
              >
                <RefreshCw
                  size={14}
                  className={
                    disasters.some((d) => d.apiStatus === "체크중")
                      ? "animate-spin"
                      : ""
                  }
                />{" "}
                상태 즉시 체크
              </button>
            </div>
          </div>

          {/* 🛠️ [수정] 테이블에 선택 로직 연결 */}
          <AdminDataTable
            columns={columns}
            data={disasters}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            rowKey="id"
          />
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

export default DisasterManagementList;
