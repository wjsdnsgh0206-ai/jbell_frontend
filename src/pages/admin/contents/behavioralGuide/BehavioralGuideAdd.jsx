import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
// import axios from 'axios'; // Spring Boot 연동 시 사용

const BehavioralGuideAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // 1. 초기 상태 관리 (빈 값으로 시작)
  const [guide, setGuide] = useState({
    categoryName: '',
    category: '', // 실제 DB에 저장될 코드 (예: NATURAL)
    typeName: '',
    type: '',     // 실제 DB에 저장될 코드 (예: EQK)
    title: '',
    actRmks: '',
    visible: true,
  });

  useEffect(() => {
    // 페이지 진입 시 브레드크럼 설정
    setBreadcrumbTitle("행동요령 등록");
    return () => setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // 2. 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuide(prev => ({ ...prev, [name]: value }));
  };

  // 3. 저장 핸들러 (POST 요청)
  const handleSave = async () => {
    // 필수값 체크 (ISTP 스타일: 핵심만 체크)
    if (!guide.title || !guide.actRmks) {
      return alert("제목과 내용은 필수 입력 사항입니다.");
    }

    try {
      // Spring Boot 연동 시: await axios.post('/api/admin/behavioral-guide', guide);
      console.log("DB에 저장될 신규 데이터:", guide);
      alert("새 행동요령이 등록되었습니다.");
      navigate("/admin/contents/behavioralGuideList"); // 등록 후 목록으로 이동
    } catch (error) {
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">행동요령 신규 등록</h2>
            <p className="text-body-m text-graygray-50 mt-2">새로운 재난 대응 행동요령을 작성합니다.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all"
            >
              취소
            </button>
            <button 
              onClick={handleSave}
              className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md"
            >
              등록하기
            </button>
          </div>
        </div>

        {/* 메인 폼 영역 (Detail의 수정 모드 UI와 동일) */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            
            {/* 1열: 카테고리 & 유형 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 구분 (코드/명칭)</label>
                <input 
                  name="categoryName"
                  value={guide.categoryName}
                  onChange={handleChange}
                  placeholder="예: 자연재난"
                  className="h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m transition-all"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형 (코드/명칭)</label>
                <input 
                  name="typeName"
                  value={guide.typeName}
                  onChange={handleChange}
                  placeholder="예: 지진"
                  className="h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m transition-all"
                />
              </div>
            </div>

            {/* 2열: 제목 */}
            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">행동요령 제목</label>
              <input 
                name="title"
                value={guide.title}
                onChange={handleChange}
                placeholder="사용자에게 보여줄 제목을 입력하세요"
                className="h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m transition-all"
              />
            </div>

            {/* 3열: 상세 내용 */}
            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">콘텐츠 내용</label>
              <textarea 
                name="actRmks"
                value={guide.actRmks}
                onChange={handleChange}
                rows={12}
                placeholder="상세한 행동요령 내용을 입력하세요. (줄바꿈 포함)"
                className="p-6 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m leading-relaxed resize-none transition-all"
              />
            </div>

            {/* 4열: 노출 여부 */}
            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">즉시 노출 여부</label>
              <button
                type="button"
                onClick={() => setGuide(prev => ({ ...prev, visible: !prev.visible }))}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                  guide.visible ? 'bg-admin-primary' : 'bg-graygray-30'
                } cursor-pointer`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  guide.visible ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
              <span className={`text-body-s-bold ${guide.visible ? 'text-admin-primary' : 'text-graygray-40'}`}>
                {guide.visible ? "등록 즉시 노출" : "비노출로 저장"}
              </span>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default BehavioralGuideAdd;