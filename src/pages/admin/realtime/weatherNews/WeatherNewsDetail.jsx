// src\pages\admin\realtime\weatherNews\WeatherNewsDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Activity, Clock, List, ShieldCheck, ChevronDown } from "lucide-react";
import { disasterApi } from "@/services/api";
import { WEATHER_OPTIONS } from "./WeatherTypeData";

const WeatherNewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    PRSNTN_SN: "",
    TTL: "",
    PRSNTN_TM: "",
    RLVT_ZONE: "",
    SPNE_FRMNT_PRCON_CN: "",
    TIME_TXT: "",
    MAAS_OBNT_DT: "",
    visible_yn: "Y",
    is_manual: "N",
    level: "보통",
    warningType: "",
  });

  const [originData, setOriginData] = useState(null);

  // 상세 데이터 로드
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await disasterApi.getWeatherDetail(id);
        if (response) {
          setFormData({
            ...response,
            warningType:
              response.warningType ||
              response.warning_type ||
              response.WARNING_TYPE ||
              "",
          });
          setOriginData({
            ...response,
            warningType:
              response.warningType ||
              response.warning_type ||
              response.WARNING_TYPE ||
              "",
          });
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    if (!isEdit) return;

    setFormData((prev) => ({
      ...prev,
      visible_yn: prev.visible_yn === "Y" ? "N" : "Y",
    }));

    // console.log("formData>>", formData.visible_yn);
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
    }
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!formData.TTL || !formData.SPNE_FRMNT_PRCON_CN) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }

    try {
      await disasterApi.updateWeather(id, formData);
      alert("성공적으로 수정되었습니다.");
      navigate("/admin/realtime/weatherNewsList");
      setOriginData(formData);
      setIsEdit(false);
      setSubmitted(false);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>
    );

  const LEVEL_STYLE = {
    위험: "bg-red-100 text-red-700 border-red-300",
    주의: "bg-yellow-100 text-yellow-700 border-yellow-300",
    보통: "bg-green-100 text-green-700 border-green-300",
  };

  const handleToggleVisible = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    const visibleYn = nextStatus ? "Y" : "N";

    setModalConfig({
      title: "노출 상태 변경",
      message: (
        <p>해당 항목을 [{nextStatus ? "노출" : "비노출"}] 처리하시겠습니까?</p>
      ),
      type: nextStatus ? "confirm" : "delete",
      onConfirm: async () => {
        try {
          await disasterApi.updateMessageVisibility([id], visibleYn);
          setMessages((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, isVisible: nextStatus } : item,
            ),
          );
        } catch (error) {
          alert("서버 통신에 실패했습니다.");
        }
        setIsModalOpen(false);
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">
              기상 특보 {isEdit ? "수정" : "상세 정보"}
            </h2>
          </div>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all"
                >
                  목록으로
                </button>
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  수정하기
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md"
                >
                  저장하기
                </button>
              </div>
            )}
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-admin-primary" size={24} />
              <div className="text-2xl font-bold text-graygray-50">
                {formData.TTL}
              </div>
              <span
                className={`ml-4 px-5 py-2 rounded-xl text-sm font-extrabold border tracking-wide shadow-sm ${LEVEL_STYLE[formData.level] || LEVEL_STYLE["보통"]}`}
              >
                {formData.level || "보통"}
              </span>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            {/* 특보 기본 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <List size={18} /> 특보 기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary font-bold ml-1">
                    특보 유형
                  </label>

                  {!isEdit ? (
                    // 수정 전: input (읽기 전용)
                    <input
                      value={formData.warningType || ""}
                      disabled
                      className="w-full h-14 px-5 rounded-lg border outline-none text-body-m
        border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed"
                    />
                  ) : (
                    // 수정 모드: select
                    <div className="relative">
                      <select
                        name="warningType"
                        value={formData.warningType || ""}
                        onChange={handleChange}
                        className="w-full h-14 px-5 rounded-lg border outline-none text-body-m appearance-none border-admin-primary bg-white cursor-pointer"
                      >
                        <option value="">선택해주세요</option>{" "}
                        {WEATHER_OPTIONS.WEATHER_TYPES.map((t) => (
                          <option key={t.value || t} value={t.value || t}>
                            {t.label || t.text || t.value || t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                        size={20}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    발생 지역
                  </label>
                  <input
                    name="RLVT_ZONE"
                    value={formData.RLVT_ZONE || ""}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`h-14 px-5 rounded-lg border outline-none font-medium transition-all ${isEdit ? "border-admin-primary bg-white focus:ring-2 ring-blue-50" : "border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed"}`}
                  />
                </div>
                <DetailField
                  label="발효 일시"
                  name="TIME_TXT"
                  value={formData.TIME_TXT}
                  isEdit={isEdit}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 특보 상세 내용 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Activity size={18} /> 특보 상세 내용
              </h3>
              <div className="grid grid-cols-1 gap-8">
                <DetailField
                  label="특보 제목"
                  name="TTL"
                  value={formData.TTL}
                  isEdit={isEdit}
                  onChange={handleChange}
                  showError={submitted && !formData.TTL}
                />
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    상세 통보문 내용
                  </label>
                  <textarea
                    name="SPNE_FRMNT_PRCON_CN"
                    value={formData.SPNE_FRMNT_PRCON_CN || ""}
                    onChange={handleChange}
                    disabled={!isEdit}
                    rows={5}
                    className={`p-5 rounded-lg border transition-all outline-none text-body-m resize-none ${isEdit ? "border-admin-primary bg-white focus:ring-2 ring-blue-50" : "border-admin-border bg-graygray-5 text-graygray-50"}`}
                  />
                </div>
              </div>
            </div>

            {/* 시스템 관리 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Clock size={18} /> 시스템 관리 설정
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* 노출 상태 설정 */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    노출 상태 설정
                  </label>
                  <div
                    className={`flex items-center gap-6 h-14 px-1 transition-all ${isEdit ? "border-admin-primary bg-white" : "border-admin-border"}`}
                  >
                    <button
                      type="button"
                      onClick={handleToggle}
                      disabled={!isEdit}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.visible_yn === "Y" ? "bg-admin-primary" : "bg-gray-300"} ${!isEdit ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:opacity-90"}`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.visible_yn === "Y" ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                    <span
                      className={`text-body-m font-bold transition-colors ${formData.visible_yn === "Y" ? "text-admin-primary" : "text-graygray-40"}`}
                    >
                      {formData.visible_yn === "Y"
                        ? "활성화 (Y)"
                        : "비활성화 (N)"}
                    </span>
                  </div>
                </div>

                {/* 등록 유형 (읽기 전용) */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    등록 유형
                  </label>
                  <div className="h-14 px-5 flex items-center rounded-lg border border-admin-border bg-graygray-5 font-bold text-graygray-50">
                    {formData.is_manual === "Y"
                      ? "관리자 직접 등록"
                      : "시스템 API 자동 수집"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// 재사용 가능한 필드 컴포넌트
const DetailField = ({
  label,
  name,
  value,
  isEdit,
  onChange,
  placeholder,
  showError = false,
}) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
      {label}
    </label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={!isEdit}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m font-medium
        ${isEdit ? "border-admin-primary bg-white focus:ring-2 ring-blue-50" : `border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed`} 
        ${showError && isEdit ? "border-red-500 ring-red-50" : ""}`}
    />
    {showError && isEdit && (
      <p className="text-red-500 text-xs ml-1 font-medium">
        필수로 입력해야 하는 값입니다.
      </p>
    )}
  </div>
);

export default WeatherNewsDetail;
