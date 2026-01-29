// src/pages/admin/behaviorMethod/BehaviorMethodAdd.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// import axios from 'axios'; // Spring Boot 연동 시 사용

const BehaviorMethodFormDataAdd = () => {
  
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  
  // ==================================================================================
  // 상태 관리
  // ==================================================================================
  const [formData, setFormData] = useState({
    contentType: '', // 재난유형 (예: EQK)
    title: '',        // 제목
    body: '',         // 본문 (Quill 에디터 내용)
    visibleYn: 'Y',  // 노출여부 (Y/N)
    contentLink: '', // 출처/링크
    ordering: 0       // 순서
  });

  // ==================================================================================
  // 데이터 가공 
  // ==================================================================================
  
  // 에디터 설정 (이미지 핸들러 자리 확보)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      // ★ 중요: 나중에 이미지 서버 업로드 기능 넣을 때 여기에 핸들러 추가
      // handlers: { image: imageHandler } 
    }
  }), []);
  
  // 브레드크럼 설정
  useEffect(() => {
    // 페이지 진입 시 브레드크럼 설정
    setBreadcrumbTitle("행동요령 등록");
    return () => setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);
  
  // ==================================================================================
  // 이벤트 핸들러
  // ==================================================================================

  // 2. 입력 핸들러 (Quill 도입 전 기본 input 기준)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. 에디터 전용 핸들러 (팀원 방식 적용)
  // Quill은 이벤트 객체(e)가 아니라 내용(content)을 바로 줍니다.
  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  // 3. 토글 핸들러 (Boolean <-> Y/N 변환 핵심!)
  const handleToggle = () => {
    setFormData(prev => ({
      ...prev,
      visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y' // 토글 로직 변경
    }));
  };

  // 5. 저장 핸들러 (POST 요청)
  const handleSave = async () => {
    // 유효성 검사
    if (!formData.title || !formData.body) {
      return alert("제목과 내용은 필수입니다.");
    }
    
    // TODO: 서버 전송 로직 (axios.post)
    try {
      // Spring Boot 연동 시: await axios.post('/api/admin/behaviorMethod-formData', formData);
      console.log("DB 전송 데이터:", formData);
      alert("새 행동요령이 등록되었습니다.");
      navigate("/admin/contents/behaviorMethodList"); // 등록 후 목록으로 이동
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
            
            {/* 1열: 유형 & 제목 (1:3 비율 설정) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* 첫 번째 섹션: 4칸 중 1칸 차지 */}
              <div className="flex flex-col gap-3 md:col-span-1">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 구분/유형 (코드/명칭)</label>
                <input 
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                  placeholder="예: 자연재난-지진"
                  className="h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m transition-all"
                />
              </div>
              {/* 두 번째 섹션: 4칸 중 3칸 차지 */}
              <div className="flex flex-col gap-3 md:col-span-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">행동요령 제목</label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="사용자에게 보여줄 제목을 입력하세요"
                  className="h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m transition-all"
                />
              </div>
            </div>

            {/* ★ Quill 에디터 영역 (팀원 스타일 적용) */}
            <div className="w-full">
              <label className="block font-bold text-[16px] mb-3">내용</label>
              {/* 배경색이나 테두리는 CSS(index.css)에서 처리됨 */}
              <div className="bg-white rounded-lg"> 
                <ReactQuill 
                  theme="snow" 
                  value={formData.body}    // DB 컬럼: body
                  onChange={handleEditorChange} 
                  modules={modules} 
                  placeholder="내용을 입력해주세요." 
                  // className은 index.css의 .ql-container 스타일을 따라갑니다.
                />
              </div>
            </div>

            {/* 링크 필드 추가 할 경우*/}
            {/* <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">관련 링크 (출처)</label>
              <input 
                name="contentLink" 
                value={formData.contentLink} 
                onChange={handleChange} 
                placeholder="출처 링크를 입력하세요 (선택)" 
                className="h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m transition-all"
              />
            </div> */}

            {/* 노출 여부 (Y/N 토글 스위치 디자인) */}
            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">즉시 노출 여부</label>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggle} // 상단에서 만든 'Y' <-> 'N' 전환 함수
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'
                  } cursor-pointer hover:shadow-inner`}
                >
                  {/* 스위치 내부 원형 버튼 */}
                  <div 
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'
                    }`} 
                  />
                </button>

                {/* 상태 표시 (선택 사항) */}
                <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'}`}>
                  {formData.visibleYn === 'Y' ? "활성화 (Y)" : "비활성화 (N)"}
                </span>
                {/* 상태 안내 문구 (선택 사항) */}
                <span className="text-sm text-gray-400">
                  * {formData.visibleYn === 'Y' ? '현재 사용자에게 노출되는 상태입니다.' : '현재 사용자에게 숨겨진 상태입니다.'}
                </span>

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BehaviorMethodFormDataAdd;