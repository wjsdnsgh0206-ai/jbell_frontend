// src/pages/admin/behaviorMethod/BehaviorMethodDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// [API & Components]
import { behaviorMethodService } from '@/services/api';
import JsonBodyRenderer from '@/components/user/behaviorMethod/JsonBodyRenderer'; // 위에서 만든 컴포넌트

const BehaviorMethodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // JSON 데이터 여부 판단 상태
  const [isJsonBody, setIsJsonBody] = useState(false);

  // 1. 상태 관리
  const [formData, setFormData] = useState({
    contentId: '',
    contentType: '',
    title: '',
    body: '',
    visibleYn: 'Y',
    contentLink: '',
    createdAt: ''
  });

  const [originData, setOriginData] = useState(null);

  // 에디터 툴바 설정
  const modules = useMemo(() => ({
    toolbar: isEdit ? [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ] : false,
  }), [isEdit]);

  // 2. 데이터 로드 (API 연동)
  useEffect(() => {
    const getDetailData = async () => {
      setLoading(true);
      try {
        // [API 호출] contentId로 상세 조회
        const data = await behaviorMethodService.getBehaviorMethodDetail(id);

        if (data) {
          setFormData(data);
          setOriginData(data);
          setBreadcrumbTitle(data.title);

          // body가 JSON인지 단순 HTML/Text인지 판단
          try {
             const parsed = JSON.parse(data.body);
             // 단순 숫자가 아니고 객체 타입이면 JSON으로 간주
             if (parsed && typeof parsed === 'object') {
                 setIsJsonBody(true);
             }
          } catch (e) {
             setIsJsonBody(false); // 파싱 실패 시 일반 텍스트 모드
          }
        } else {
          alert("해당 데이터를 찾을 수 없습니다.");
          navigate("/admin/contents/behaviorMethodList");
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
        navigate("/admin/contents/behaviorMethodList");
      } finally {
        setLoading(false);
      }
    };

    if (id) getDetailData();
    return () => setBreadcrumbTitle("");
  }, [id, setBreadcrumbTitle, navigate]);

  // 3. 이벤트 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  const handleToggle = () => {
    // 조회 모드에서도 상태 변경을 허용하고 싶다면 !isEdit 조건을 제거하세요.
    // 여기선 수정 모드일 때만 변경 가능하도록 유지
    if (!isEdit) return; 
    setFormData(prev => ({
      ...prev,
      visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y'
    }));
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하고 원래대로 되돌리시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
    }
  };

  const handleSave = async () => {
    if (!window.confirm("변경 사항을 저장하시겠습니까?")) return;

    try {
      // [API 호출] 수정 요청
      await behaviorMethodService.updateBehaviorMethod(id, formData);
      
      setOriginData(formData);
      setIsEdit(false);
      alert("성공적으로 저장되었습니다.");
      
      // 저장 후 JSON 여부 재판단 (텍스트를 JSON으로 바꿨을 수도 있으니)
      try {
         const parsed = JSON.parse(formData.body);
         if (parsed && typeof parsed === 'object') setIsJsonBody(true);
      } catch (e) {
         setIsJsonBody(false);
      }
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // JSON 모드 강제 해제 (텍스트로 수정하고 싶을 때)
  const toggleRawEdit = () => {
    if(window.confirm("JSON 구조가 깨질 수 있습니다. 일반 에디터로 전환하시겠습니까?")) {
        setIsJsonBody(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-admin-text-secondary">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">
              행동요령 {isEdit ? '수정' : '상세 정보'}
            </h2>
          </div>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button onClick={() => navigate("/admin/contents/behaviorMethodList")} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all">목록으로</button>
                <button onClick={() => setIsEdit(true)} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">수정하기</button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all">취소</button>
                <button onClick={handleSave} className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md">저장하기</button>
              </div>
            )}
          </div>
        </div>

        {/* 메인 폼 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            
            {/* 1열: 유형 & 제목 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-3 md:col-span-1">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형 코드</label>
                <input 
                  name="contentType"
                  value={formData.contentType || ''}
                  onChange={handleChange}
                  disabled={!isEdit} // PK나 타입은 수정 불가 정책일 수 있음
                  className="h-14 px-5 rounded-lg border border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed outline-none text-body-m"
                />
              </div>
              <div className="flex flex-col gap-3 md:col-span-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">제목</label>
                <input 
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                />
              </div>
            </div>

            {/* 2. 본문 내용 (JSON 렌더러 vs Quill 에디터) */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">본문 내용</label>
                  {isEdit && isJsonBody && (
                      <button onClick={toggleRawEdit} className="text-xs text-red-500 underline">JSON 직접 수정하기</button>
                  )}
              </div>
              
              <div className={`rounded-lg transition-all ${isEdit ? 'bg-white' : 'view-mode-container shadow-inner'}`}>
                {/* JSON 형식이고 수정 모드가 아닐 때 (또는 JSON 렌더러 모드일 때) */}
                {isJsonBody && !isEdit ? (
                    <JsonBodyRenderer jsonString={formData.body} />
                ) : (
                    // 수정 모드이거나 일반 텍스트일 때는 에디터 사용
                    // (JSON 데이터를 텍스트로 수정할 때는 TextArea가 나을 수 있으나 통일성을 위해 Quill 사용)
                    <ReactQuill 
                      theme={isEdit ? "snow" : null} 
                      value={formData.body || ''} 
                      onChange={handleEditorChange} 
                      modules={modules} 
                      readOnly={!isEdit}
                    />
                )}
              </div>
            </div>

            {/* 4열: 노출 여부 토글 */}
            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">현재 노출 상태</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={!isEdit}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'
                  } ${isEdit ? 'cursor-pointer hover:shadow-inner' : 'cursor-not-allowed opacity-60'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
                <div className="flex flex-col">
                  <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'}`}>
                    {formData.visibleYn === 'Y' ? "활성화 (Y)" : "비활성화 (N)"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default BehaviorMethodDetail;