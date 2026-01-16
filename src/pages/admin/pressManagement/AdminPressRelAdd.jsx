import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal'; 
import { pressData } from '@/pages/user/openboards/BoardData'; 
import { Paperclip, X } from 'lucide-react';

// React-Quill 라이브러리와 스타일 임포트
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// 아이콘 컴포넌트
const SuccessIcon = ({ fill = "#2563EB" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#E15141"/>
    <path d="M10 6L6 10M6 6L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminPressRelAdd = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    mgmtId: '', 
    regType: '직접등록',
    title: '',
    source: '전북안전대책본부',
    sourceUrl: '',
    author: '관리자',
    isPublic: true,
    isPin: false,
    content: '',
    files: []
  });

  // 에러 상태
  const [errors, setErrors] = useState({ mgmtId: false, title: false, source: false });

  // 페이지 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData.title || formData.content || formData.mgmtId) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  // 에디터 설정
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  // ✅ 보완 1: 모든 텍스트 필드에 대한 글자 수 제한 로직
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const limits = {
      title: 100,    // 제목 100자
      mgmtId: 20,   // 관리번호 20자
      source: 20,   // 출처 기관 20자
    };

    // 설정된 글자 수를 초과하면 상태를 업데이트하지 않음 (입력 차단)
    if (limits[name] && value.length > limits[name]) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  // 에디터 핸들러
  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // 파일 업로드 핸들러
  const addFiles = (newFiles) => {
    const fileObjects = Array.from(newFiles).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setFormData(prev => ({ ...prev, files: [...prev.files, ...fileObjects] }));
  };

  const handleSave = () => {
    // 1. 에러 상태 체크
    const newErrors = {
      mgmtId: !formData.mgmtId.trim(),
      title: !formData.title.trim(),
      source: !formData.source.trim(),
      content: !formData.content.replace(/<(.|\n)*?>/g, '').trim() // 에디터 내용이 비어있는지 체크 (HTML 태그 제거 후)
    };

    setErrors(newErrors);

    // 2. 필수 값이 하나라도 비어있을 경우
    if (Object.values(newErrors).some(Boolean)) {
      // 브라우저 기본 alert를 쓰거나, 별도의 경고 모달을 띄울 수 있습니다.
      alert("필수 입력 사항을 모두 작성해주세요."); 
      
      // 첫 번째 에러가 발생한 위치로 포커스를 이동시키면 더 친절한 UI가 됩니다.
      return; 
    }

    // 3. 모든 값이 입력되었을 때만 '저장 확인 모달'을 엽니다.
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);
    const newEntry = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      views: 0
    };
    pressData.unshift(newEntry);
    setShowToast(true);
    setTimeout(() => navigate('/admin/contents/pressRelList'), 1500);
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">보도자료가 성공적으로 등록되었습니다.</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">보도자료 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">보도자료 정보 입력</h3>
          
          <div className="flex flex-col">
            {/* ✅ 보안 2: 관리번호 글자 수 표시 및 차단 적용 */}
            <div className="mb-10 w-full max-w-[500px]">
            <label className="block font-bold text-[16px] mb-3">관리번호 (ID) (필수)</label>
            <input 
              name="mgmtId"
              value={formData.mgmtId}
              onChange={handleChange}
              maxLength={20}
              placeholder="W-2025-001"
              className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.mgmtId ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
            />
            <div className="flex justify-between items-start mt-2 px-1">
              <div className="h-5"> {/* 에러 메시지가 없어도 공간 유지 */}
                {errors.mgmtId && <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 관리번호를 입력해주세요</div>}
              </div>
              {/* ✅ 카운트를 오른쪽 끝으로 밀기 */}
              <span className={`text-[13px] font-medium ${formData.mgmtId.length >= 20 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                {formData.mgmtId.length} / 20자
              </span>
            </div>
          </div>

            {/* ✅ 제목 섹션 (100자 제한 및 너비 확장) */}
            <div className="mb-10 w-full"> {/* 너비를 전체로 확장 */}
              <label className="block font-bold text-[16px] mb-3 text-[#111]">
                제목 (필수)
              </label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100} // ✅ 100자로 변경
                placeholder="제목을 입력해주세요 (최대 100자)"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
                  errors.title ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              <div className="flex justify-between items-start mt-2 px-1">
                <div>
                  {errors.title && (
                    <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
                      <ErrorIcon /> 제목을 입력해주세요
                    </div>
                  )}
                </div>
                {/* ✅ 100자 기준으로 카운트 표시 */}
                <span className={`text-[13px] font-medium ${formData.title.length >= 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                  {formData.title.length} / 100자
                </span>
              </div>
            </div>

            {/* ✅ 보완 3: 출처 기관 글자 수 표시 및 차단 적용 */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3">출처 (필수)</label>
              <input 
                name="source"
                value={formData.source}
                onChange={handleChange}
                maxLength={20}
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.source ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              <div className="flex justify-between mt-2 px-1">
                <div>{errors.source && <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 출처 기관을 입력해주세요</div>}</div>
                <span className={`text-[13px] ${formData.source.length >= 20 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                  {formData.source.length} / 20자
                </span>
              </div>
            </div>

            {/* ✅ 원문 링크 (URL) 추가 */}
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3">원문 링크 (URL)</label>
              <input 
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-lg px-5 py-4 outline-none focus:border-[#2563EB] transition-all font-medium"
              />
            </div>

          {/* 상세 내용 (에디터) */}
            <div className="mb-10 w-full text-left">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">내용 (필수)</label>
              
              {/* ✅ 'custom-quill'을 기본으로 쓰고, 에러일 때만 'error-border'를 추가합니다 */}
              <div className={`bg-white rounded-lg overflow-hidden ${errors.content ? 'custom-quill error-border' : 'custom-quill'}`}> 
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleEditorChange} 
                  modules={modules} 
                  placeholder="내용을 입력해주세요." 
                />
              </div>
              
              {/* 에러 메시지 */}
              {errors.content && (
                <div className="text-[#E15141] text-[13px] flex items-center gap-1.5 font-medium mt-2 px-1">
                  <ErrorIcon /> 
                  <span>내용을 입력해주세요</span>
                </div>
              )}
            </div>
            

            {/* 파일 첨부 */}
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3">첨부파일 (HWP, PDF, 보도용 사진 등)</label>
              <div className="flex flex-col gap-4">
                <div 
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = '#F0F7FF'; }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = '#F9FAFB'; addFiles(e.dataTransfer.files); }}
                  className="w-full flex flex-col items-center justify-center py-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2563EB] hover:bg-[#F0F7FF] transition-all group"
                >
                  <label className="flex flex-col items-center cursor-pointer w-full">
                    <Paperclip className="text-gray-400 group-hover:text-[#2563EB] mb-3" size={32} />
                    <span className="text-[16px] font-bold text-gray-600 mb-1">파일을 마우스로 끌어오거나 클릭하세요</span>
                    <span className="text-[13px] text-gray-400">HWP, PDF, JPG, PNG (최대 10MB)</span>
                    <input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-blue-50 p-2 rounded-md"><Paperclip size={18} className="text-[#2563EB]" /></div>
                        <span className="text-[14px] font-bold truncate text-gray-800">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => setFormData(prev => ({...prev, files: prev.files.filter((_, i) => i !== idx)}))} className="p-2 hover:bg-red-50 rounded-full text-red-400 transition-colors">
                        <X size={18}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 노출 여부 */}
            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px]">노출 여부</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({...prev, isPublic: !prev.isPublic}))}
                  className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isPublic ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.isPublic ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${formData.isPublic ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {formData.isPublic ? '노출' : '비노출'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ 하단 버튼 영역: 태그 누락 방지를 위해 명확히 정리 */}
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-8 py-3.5 border border-gray-300 rounded-lg font-bold text-[16px] text-gray-500 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            취소
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-all"
          >
            저장
          </button>
        </div>
      </main>

      {/* 모달 컴포넌트 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="보도자료를 저장하시겠습니까?" 
        message="작성하신 내용이 목록에 즉시 반영됩니다."
        type="save"
      />
    </div>
  );
};

export default AdminPressRelAdd;