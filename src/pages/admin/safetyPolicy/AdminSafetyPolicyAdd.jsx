import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// API & Service
import { safetyPolicyService, fileService } from '@/services/api';

const AdminSafetyPolicyAdd = () => {
  const navigate = useNavigate();
  const quillRef = useRef(null);

  // =========================================================
  // 1. 상태 관리
  // =========================================================
  const [formData, setFormData] = useState({
    title: '',
    source: '',       // 출처 (예: 전북특별자치도)
    contentLink: '',  // 관련 링크
    body: '',
    visibleYn: 'Y',
    fileIds: []
  });

  // =========================================================
  // 2. 에디터 및 핸들러
  // =========================================================
  
  // 이미지 업로드 핸들러 (Quill)
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const res = await fileService.uploadEditorImage(file);
          if (res.status === 'SUCCESS') {
            const { filePath, fileIdx } = res.data;
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', filePath); 
            quill.setSelection(range.index + 1);
            
            setFormData(prev => ({
                ...prev,
                fileIds: [...(prev.fileIds || []), fileIdx]
            }));
          }
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          alert("이미지 업로드 중 오류가 발생했습니다.");
        }
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [imageHandler]);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  const handleToggle = () => {
    setFormData(prev => ({
      ...prev,
      visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y'
    }));
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!formData.title || !formData.body) {
      alert("정책명과 본문 내용은 필수입니다.");
      return;
    }
    if (!window.confirm("등록하시겠습니까?")) return;

    try {
      await safetyPolicyService.createSafetyPolicy(formData);
      alert("등록되었습니다.");
      navigate(-1); // 목록으로 이동
    } catch (error) {
      console.error(error);
      alert("등록 실패: " + (error.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-gray-900">
      <main className="p-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-heading-l text-admin-text-primary tracking-tight">주요 안전정책 등록</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 h-12 border border-gray-300 bg-white text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-all"
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

        {/* Content Body */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            
            {/* 1. 정책명 */}
            <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">정책명 <span className="text-red-500">*</span></label>
                <input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="정책 제목을 입력하세요" 
                  className="h-14 px-5 rounded-lg border border-admin-border bg-white focus:border-admin-primary outline-none text-body-m transition-all"
                />
            </div>

            {/* 2. 출처 및 링크 (2열 배치) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                    <label className="text-body-m-bold text-admin-text-secondary ml-1">출처 기관</label>
                    <input 
                      name="source" 
                      value={formData.source} 
                      onChange={handleChange} 
                      placeholder="예: 전북특별자치도, 행정안전부" 
                      className="h-14 px-5 rounded-lg border border-admin-border bg-white focus:border-admin-primary outline-none text-body-m transition-all"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-body-m-bold text-admin-text-secondary ml-1">관련 링크 (URL)</label>
                    <input 
                      name="contentLink" 
                      value={formData.contentLink} 
                      onChange={handleChange} 
                      placeholder="https://example.com" 
                      className="h-14 px-5 rounded-lg border border-admin-border bg-white focus:border-admin-primary outline-none text-body-m transition-all"
                    />
                </div>
            </div>

            {/* 3. 본문 에디터 */}
            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">상세 내용 <span className="text-red-500">*</span></label>
              <div className="bg-white rounded-lg">
                <ReactQuill 
                  ref={quillRef} 
                  theme="snow" 
                  value={formData.body} 
                  onChange={handleEditorChange} 
                  modules={modules} 
                  className="bg-white rounded-lg"
                />
              </div>
            </div>
            
            {/* 4. 노출 여부 */}
            <div className="flex items-center gap-6 pt-4 border-t border-admin-border">
              <label className="text-body-m-bold text-admin-text-secondary">노출 상태 설정</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={handleToggle} 
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'} cursor-pointer hover:shadow-inner`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-gray-400'}`}>
                    {formData.visibleYn === 'Y' ? "활성화 (Y)" : "비활성화 (N)"}
                </span>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminSafetyPolicyAdd;