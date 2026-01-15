import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { BehavioralGuideData } from "@/pages/admin/contents/behavioralGuide/BehavioralGuideData"; // 1. 데이터 임포트 확인

const BehavioralGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 초기 상태값을 비워두고 useEffect에서 채웁니다.
  const [guide, setGuide] = useState({
    categoryName: '',
    category: '',
    typeName: '',
    type: '',
    title: '',
    actRmks: '',
    visible: true,
    date: ''
  });

  // 원본 데이터 저장용 상태 (취소 시 복구용)
  const [originGuide, setOriginGuide] = useState(null);

  // 2. 데이터 연동 및 브레드크럼 설정 로직
  useEffect(() => {
    const getDetailData = () => {
      setLoading(true);
      try {
        // 1. 데이터 찾기
        const foundData = BehavioralGuideData.find(item => item.id === parseInt(id));

        if (foundData) {
          // 2. 데이터 상태 업데이트
          setGuide(foundData);
          setOriginGuide(foundData); // 원본 데이터 따로 보관
          // 3. 브레드크럼 타이틀을 데이터의 title로 설정
          setBreadcrumbTitle(foundData.title);
        } else {
          alert("해당 데이터를 찾을 수 없습니다.");
          navigate("/admin/contents/behavioralGuide");
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetailData();

    // [Clean-up] 페이지를 나갈 때는 브레드크럼 초기화
    return () => setBreadcrumbTitle("");
  }, [id, setBreadcrumbTitle, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuide(prev => ({ ...prev, [name]: value }));
  };

  // [취소 버튼 핸들러] @@
  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하고 원래대로 되돌리시겠습니까?")) {
      setGuide(originGuide); // 보관해둔 원본으로 덮어쓰기
      setIsEdit(false);
    }
  };

  const handleSave = async () => {
    try {
      // 현재는 정적 데이터이므로 콘솔에만 찍고 상태만 변경합니다.
      // 나중에 Spring Boot 연동 시: await axios.put(`/api/.../${id}`, guide);
      console.log("수정된 데이터:", guide);
      alert("성공적으로 저장되었습니다.");
      setIsEdit(false);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-10 text-center text-admin-text-secondary">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">행동요령 상세 정보</h2>
          </div>
          <div className="flex gap-3">
            {/* 수정 모드가 아닐 때만 목록 버튼 표시 */}
            {!isEdit && (
              <button 
                onClick={() => navigate(-1)}
                className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all"
              >
                목록으로
              </button>
            )}

            {!isEdit ? (
              <button 
                onClick={() => setIsEdit(true)}
                className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm"
              >
                수정하기
              </button>
            ) : (
              <div className="flex gap-2">
                {/* 취소 버튼 추가 @@ */}
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

        {/* 메인 폼 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 구분</label>
                <input 
                  name="categoryName"
                  value={guide.categoryName || ''}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 shadow-inner text-graygray-50 cursor-not-allowed'}`}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형</label>
                <input 
                  name="typeName"
                  value={guide.typeName || ''}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 shadow-inner text-graygray-50 cursor-not-allowed'}`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">행동요령 제목</label>
              <input 
                name="title"
                value={guide.title || ''}
                onChange={handleChange}
                disabled={!isEdit}
                placeholder="제목을 입력하세요"
                className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                  ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 shadow-inner text-graygray-50 cursor-not-allowed'}`}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">콘텐츠 내용</label>
              <textarea 
                name="actRmks"
                value={guide.actRmks || ''}
                onChange={handleChange}
                disabled={!isEdit}
                rows={12}
                placeholder="상세 행동요령 내용을 입력하세요"
                className={`p-6 rounded-lg border transition-all outline-none text-body-m leading-relaxed resize-none
                  ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 shadow-inner text-graygray-50 cursor-not-allowed'}`}
              />
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">노출 여부</label>
              <button
                type="button"
                onClick={() => isEdit && setGuide(prev => ({ ...prev, visible: !prev.visible }))}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                  guide.visible ? 'bg-admin-primary' : 'bg-graygray-30'
                } ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  guide.visible ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
              <span className={`text-body-s-bold ${guide.visible ? 'text-admin-primary' : 'text-graygray-40'}`}>
                {guide.visible ? "노출 중" : "비노출"}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BehavioralGuideDetail;