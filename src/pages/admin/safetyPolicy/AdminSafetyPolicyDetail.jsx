import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// API
import { safetyPolicyService, fileService } from '@/services/api';

const AdminSafetyPolicyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  const quillRef = useRef(null);

  // State
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originData, setOriginData] = useState(null);

  const [formData, setFormData] = useState({
    contentId: '',
    title: '',
    source: '',
    contentLink: '',
    body: '',
    visibleYn: 'Y',
    fileIds: []
  });

  // =========================================================
  // 1. 데이터 조회
  // =========================================================
  useEffect(() => {
    const getDetailData = async () => {
      setLoading(true);
      try {
        const response = await safetyPolicyService.getSafetyPolicyDetail(id);
        if (response && response.status === 'SUCCESS' && response.data) {
          const realData = response.data;
          setFormData({ ...realData, fileIds: [] });
          setOriginData(realData);
          setBreadcrumbTitle(realData.title);
        }
      } catch (error) {
        console.error("로딩 에러", error);
        alert("데이터를 불러오지 못했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (id) getDetailData();
  }, [id, setBreadcrumbTitle]);

  // =========================================================
  // 2. 핸들러 (수정/저장/삭제)
  // =========================================================
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
            setFormData(prev => ({ ...prev, fileIds: [...(prev.fileIds || []), fileIdx] }));
          }
        } catch (error) { console.error(error); alert("오류 발생"); }
      }
    };
  }, []);

  const modules = useMemo(() => {
    if (!isEdit) return { toolbar: false };
    return {
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
    };
  }, [isEdit, imageHandler]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  const handleToggle = () => {
    if (!isEdit) return; 
    setFormData(prev => ({ ...prev, visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y' }));
  };

  const handleCancel = () => {
    if (window.confirm("수정을 취소하시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
    }
  };

  const handleSave = async () => {
    if (!window.confirm("저장하시겠습니까?")) return;
    try {
      await safetyPolicyService.updateSafetyPolicy(id, formData);
      
      // 1. 원본 데이터 갱신
      setOriginData(formData);
      
      // 2. 편집 모드 종료
      setIsEdit(false);
      
      // 3. [추가] 수정된 제목으로 브레드크럼 즉시 업데이트!
      setBreadcrumbTitle(formData.title); 

      alert("저장되었습니다.");
      setFormData(prev => ({ ...prev, fileIds: [] })); 
    } catch (error) { 
        console.error(error);
        alert("저장 실패"); 
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.")) return;
    try {
        await safetyPolicyService.deleteSafetyPolicies([id]);
        alert("삭제되었습니다.");
        navigate(-1); // 목록으로 이동
    } catch (error) { 
        console.error(error); 
        alert("삭제 실패"); 
    }
  };

  if (loading) return <div className="p-10 text-center">로딩중...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-gray-900">
      <main className="p-10">
        
        {/* Header Buttons */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">
              주요 안전정책 {isEdit ? '수정' : '상세 정보'}
            </h2>
          </div>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button onClick={() => navigate(-1)} className="px-6 h-12 border border-gray-300 bg-white text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-all">목록으로</button>
                <button onClick={handleDelete} className="px-6 h-12 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">삭제</button>
                <button onClick={() => setIsEdit(true)} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">수정하기</button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-6 h-12 border border-gray-300 bg-white text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-all">취소</button>
                <button onClick={handleSave} className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md">저장하기</button>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-10 space-y-8">
            
            {/* 1. 정책명 */}
            <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">정책명</label>
                <input 
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                />
            </div>

            {/* 2. 출처 및 링크 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                    <label className="text-body-m-bold text-admin-text-secondary ml-1">출처 기관</label>
                    <input 
                      name="source"
                      value={formData.source || ''}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-body-m-bold text-admin-text-secondary ml-1">관련 링크 (URL)</label>
                    <input 
                      name="contentLink"
                      value={formData.contentLink || ''}
                      onChange={handleChange}
                      disabled={!isEdit}
                      placeholder="https://example.com"
                      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                    />
                </div>
            </div>

            {/* 3. 본문 에디터 */}
            <div className="flex flex-col gap-3">
              <label className="text-body-m-bold text-admin-text-secondary ml-1">상세 내용</label>
              <div className={`rounded-lg transition-all ${isEdit ? 'bg-white' : 'bg-gray-50 shadow-inner'}`}>
                <ReactQuill 
                    ref={quillRef}
                    theme={isEdit ? "snow" : null} 
                    value={formData.body || ''} 
                    onChange={handleEditorChange}
                    modules={modules} 
                    readOnly={!isEdit}
                    className={!isEdit ? 'ql-read-only' : ''}
                />
              </div>
            </div>

            {/* 4. 노출 상태 */}
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
                <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'}`}>
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

export default AdminSafetyPolicyDetail;