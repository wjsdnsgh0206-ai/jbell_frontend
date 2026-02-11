// src\pages\admin\realtime\disasterMessage\DisasterMessageDetail.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  AlertTriangle,
  Clock,
  ChevronDown,
  List,
  Info,
  FileText,
} from "lucide-react";
import { disasterApi } from "@/services/api";

const DisasterMessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    category: "",
    type: "",
    sender: "행정안전부",
    content: "",
    region: "",
    dateTime: "",
    isVisible: true,
  });

  const [originData, setOriginData] = useState(null);

  // ==================================================================================
  // 1. 데이터 가져오기 (대문자 필드 매핑 핵심 수정)
  // ==================================================================================
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      // console.log("🔍 상세 조회 요청 ID:", id);
      const response = await disasterApi.getDisasterDetail(id);

      // 백엔드 공통 DTO 구조를 고려 (response.list가 아닌 단일 객체 대응)
      const item = response.data || response;

      // item이 존재하고, 주요 필드 중 하나라도 값이 있는지 확인
      if (item && (item.id || item.SN || item.sn || item.MSG_CN || item.msgCn)) {
        const mapped = {
          // 서버 응답의 대문자/소문자 필드 모두 체크
          id: item.id || item.SN || item.sn,
          category: item.EMRG_STEP_NM || item.emrgStepNm || "안전안내",
          type: item.DST_SE_NM || item.dstType || "기타", 
          sender: item.MNG_ORG_NM || "행정안전부",
          content: item.MSG_CN || item.msgCn || "",
          region: item.RCPTN_RGN_NM || item.rcptnRgnNm || "",
          dateTime: item.CRT_DT || item.crtDt || "",
          isVisible: (item.visibleYn || item.VISIBLE_YN) === "Y",
        };

        // console.log("✅ 매핑 완료 데이터:", mapped);
        setFormData(mapped);
        setOriginData(mapped);
        if (setBreadcrumbTitle) setBreadcrumbTitle("재난 문자 상세 정보");
      } else {
        alert("해당 데이터를 찾을 수 없습니다.");
        navigate(-1);
      }
    } catch (error) {
      console.error("❌ 데이터 로드 실패:", error);
      const errorMsg = error.response?.data?.message || "데이터를 불러오는 중 오류가 발생했습니다.";
      alert(errorMsg);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, setBreadcrumbTitle]);

  useEffect(() => {
    fetchDetail();
    return () => setBreadcrumbTitle && setBreadcrumbTitle("");
  }, [fetchDetail]);

  // ==================================================================================
  // 2. 데이터 저장 (대문자 @JsonProperty 대응 수정)
  // ==================================================================================
  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid()) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }

    try {
      // 백엔드 PredictionInfoResponse.java의 @JsonProperty 규격에 맞게 변환
      const updateData = {
        SN: formData.id,                  // @JsonProperty("SN")
        EMRG_STEP_NM: formData.category,  // @JsonProperty("EMRG_STEP_NM")
        DST_SE_NM: formData.type,         // @JsonProperty("DST_SE_NM")
        MSG_CN: formData.content,         // @JsonProperty("MSG_CN")
        RCPTN_RGN_NM: formData.region,    // @JsonProperty("RCPTN_RGN_NM")
        CRT_DT: formData.dateTime,        // @JsonProperty("CRT_DT")
        visibleYn: formData.isVisible ? "Y" : "N", // No Annotation -> 소문자
      };

      // console.log("🚀 업데이트 전송 데이터:", updateData);
      await disasterApi.updateDisaster(formData.id, updateData);

      setOriginData(formData);
      alert("성공적으로 저장되었습니다.");
      setIsEdit(false);
      setSubmitted(false);
    } catch (error) {
      console.error("❌ 저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 나머지 로직 (동일)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    if (!isEdit) return;
    setFormData((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하고 원래대로 되돌리시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
      setSubmitted(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ["category", "type", "content", "region", "dateTime"];
    return requiredFields.every((key) => formData[key] !== "" && formData[key] !== null);
  };

  if (loading) return <div className="p-10 text-center text-admin-text-secondary">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">
            재난 문자 {isEdit ? "내용 수정" : "상세 내역"}
          </h2>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button onClick={() => navigate(-1)} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all cursor-pointer">목록으로</button>
                <button onClick={() => setIsEdit(true)} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer">수정하기</button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all cursor-pointer">취소</button>
                <button onClick={handleSave} className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md cursor-pointer">저장하기</button>
              </div>
            )}
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-8 border-b border-admin-border bg-graygray-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${formData.category === "긴급재난" ? "bg-red-500 text-white" : "bg-admin-primary text-white"}`}>
                {formData.category}
              </div>
              <h3 className="text-xl font-bold text-admin-text-primary">
                {formData.type} 안내문 <span className="text-graygray-40 font-medium ml-2 text-base">({formData.id})</span>
              </h3>
            </div>
            <div className="flex items-center gap-2 text-graygray-50 bg-white px-4 py-2 rounded-lg border border-admin-border shadow-sm">
              <Clock size={18} className="text-admin-primary" />
              <span className="text-body-m-bold">{formData.dateTime} 발송</span>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border"><FileText size={18} /> 재난 문자 본문 내용</h3>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                disabled={!isEdit}
                rows={5}
                className={`text-lg font-medium outline-none w-full transition-all resize-none leading-relaxed p-6 rounded-xl border ${isEdit ? "border-admin-primary bg-blue-50/10 focus:ring-2 ring-blue-100" : "border-admin-border bg-graygray-5 text-graygray-70 cursor-not-allowed"}`}
              />
            </div>

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border"><List size={18} /> 발송 및 분류 상세</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">구분</label>
                  <select name="category" value={formData.category} onChange={handleChange} disabled={!isEdit} className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-bold ${isEdit ? "border-admin-primary bg-white cursor-pointer" : "border-admin-border bg-graygray-5 text-admin-primary cursor-not-allowed"}`}>
                    <option value="안전안내">안전안내</option>
                    <option value="긴급재난">긴급재난</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">유형</label>
                  <select name="type" value={formData.type} onChange={handleChange} disabled={!isEdit} className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-bold ${isEdit ? "border-admin-primary bg-white cursor-pointer" : "border-admin-border bg-graygray-5 text-gray-700 cursor-not-allowed"}`}>
                    <option value="기상">기상특보</option>
                    <option value="실종자">실종자</option>
                    <option value="화재">화재</option>
                    <option value="교통통제">교통통제</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <DetailField label="수신 지역" name="region" value={formData.region} isEdit={isEdit} onChange={handleChange} />
              </div>
            </div>
{/* 시스템 관리 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Clock size={18} /> 시스템 관리 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* 관리자 등록 여부 */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">등록 유형</label>
                  <div className="h-14 px-5 flex items-center rounded-lg border border-admin-border bg-graygray-5 font-bold">
                    {formData.isManual === 'Y' ? '관리자 등록' : 'API 수집'}
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

const DetailField = ({ label, name, value, isEdit, onChange }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1">{label}</label>
    <input name={name} value={value || ""} onChange={onChange} disabled={!isEdit} className={`h-14 px-5 rounded-lg border outline-none font-bold ${isEdit ? "border-admin-primary bg-white" : "border-admin-border bg-graygray-5 text-graygray-70 cursor-not-allowed"}`} />
  </div>
);

export default DisasterMessageDetail;
