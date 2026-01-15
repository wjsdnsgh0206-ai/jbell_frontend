import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import AdminCodeConfirmModal from '../CodeManagement/AdminCodeConfirmModal'; 
import { pressData } from '@/pages/user/openboards/BoardData'; 
import { Paperclip, X } from 'lucide-react';

// 보도자료 관리자 등록 페이지//

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

  const [errors, setErrors] = useState({ mgmtId: false, title: false, source: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setFormData(prev => ({ ...prev, files: [...prev.files, ...uploadedFiles] }));
  };

  const handleSave = () => {
    const newErrors = {
      mgmtId: !formData.mgmtId.trim(),
      title: !formData.title.trim(),
      source: !formData.source.trim()
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);

    // 더미 데이터 배열에 실제 추가 (메모리상 유지)
    const newEntry = {
      id: Date.now(),
      mgmtId: formData.mgmtId,
      regType: formData.regType,
      source: formData.source,
      sourceUrl: formData.sourceUrl,
      title: formData.title,
      author: formData.author,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      isPublic: formData.isPublic,
      views: 0,
      isPin: formData.isPin,
      files: formData.files,
      content: formData.content
    };

    pressData.unshift(newEntry); // 배열 맨 앞에 추가

    setShowToast(true);
    setTimeout(() => navigate('/admin/content/pressRelList'), 1500);
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
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">보도자료 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">보도자료 정보 입력</h3>
          
          <div className="flex flex-col">
            {/* 관리번호 (ID) */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">관리번호 (ID) (필수)</label>
              <input 
                name="mgmtId"
                value={formData.mgmtId}
                onChange={handleChange}
                placeholder="W-2025-001"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.mgmtId ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              {errors.mgmtId && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium"><ErrorIcon /> 관리번호를 입력해주세요</div>}
            </div>

            {/* 제목 */}
            <div className="mb-10 w-full max-w-[800px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">보도자료 제목 (필수)</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력해주세요"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.title ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              {errors.title && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium"><ErrorIcon /> 제목을 입력해주세요</div>}
            </div>

            {/* 출처 */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">출처 기관 (필수)</label>
              <input 
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.source ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              {errors.source && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium"><ErrorIcon /> 출처 기관을 입력해주세요</div>}
            </div>

            {/* 원문 링크 */}
            <div className="mb-10 w-full max-w-[800px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">원문 링크 (URL)</label>
              <input 
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-5 py-4 outline-none focus:border-[#2563EB] font-medium"
              />
            </div>

            {/* 상세 내용 (Textarea) */}
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 내용</label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium"
              />
            </div>

            {/* 파일 첨부 */}
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">파일 첨부</label>
              <div className="flex flex-col gap-3">
                <label className="w-fit flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all text-[15px] font-bold text-gray-600 border-dashed border-2">
                  <Paperclip size={18} /> 파일 선택
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-[14px] font-medium">
                      <span>{file.name}</span>
                      <button onClick={() => setFormData(prev => ({...prev, files: prev.files.filter((_, i) => i !== idx)}))} className="text-red-500 hover:text-red-700 transition-colors"><X size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 노출 여부 (토글) */}
            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">노출 여부</label>
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

        {/* 하단 버튼 (상세코드 등록 페이지와 동일한 스타일) */}
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

      <AdminCodeConfirmModal 
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