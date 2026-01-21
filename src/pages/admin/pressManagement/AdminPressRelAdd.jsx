import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal'; 
import { pressData } from '@/pages/user/openboards/BoardData'; 
import { Paperclip, X } from 'lucide-react';

// ReactQuill과 Quill 임포트 (중복 제거)
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// [에러 해결] 명시적 포맷 및 모듈 등록
// 1. 기본 블록 포맷 등록
const Block = Quill.import('blots/block');
Block.tagName = 'P'; 
Quill.register(Block, true);

// 2. 폰트 등록
const Font = Quill.import('formats/font');
Quill.register(Font, true);

// 3. 리스트 및 불렛 모듈 강제 등록 (질문하신 부분 포함)
const ListItem = Quill.import('formats/list/item');
if (ListItem) {
  Quill.register(ListItem, true);
}

// 아이콘 컴포넌트
const SuccessIcon = ({ fill = "#4ADE80" }) => (
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

const formatBytes = (bytes, decimals = 1) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const AdminPressRelAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  const quillRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 폼 데이터 초기 상태
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

  const [errors, setErrors] = useState({ mgmtId: false, title: false, source: false, content: false });

  // Quill에서 허용할 포맷 지정
  const allFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 
  'link', 'image', 'color', 'background', 'align'
];

  // 브레드크럼 설정
  useEffect(() => {
    setBreadcrumbTitle("보도자료 등록");
    return () => setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // 메모리 해제
  useEffect(() => {
    return () => {
      if (formData.files) {
        formData.files.forEach(file => {
          if (file.url && file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.url);
          }
        });
      }
    };
  }, [formData.files]);

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

  // --- [핸들러 구역] ---

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert("jpg, png, gif, webp 형식의 이미지 파일만 업로드 가능합니다.");
        return;
      }

      const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 
      if (file.size > MAX_IMAGE_SIZE) {
        alert(`이미지 용량이 너무 큽니다. (최대 5MB) \n현재 용량: ${formatBytes(file.size)}`);
        return;
      }

      const quill = quillRef.current.getEditor();
      const existingImgs = quill.root.querySelectorAll('img').length;
      if (existingImgs >= 10) {
        alert("본문 이미지는 최대 10개까지만 삽입할 수 있습니다.");
        return;
      }

      // 등록 페이지 이미지 처리 (Base64 방식)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target.result;
        let range = quill.getSelection();
        if (!range) range = { index: quill.getLength() };
        
        quill.insertEmbed(range.index, 'image', base64Url);
        setTimeout(() => {
          quill.setSelection(range.index + 1);
          quill.focus();
        }, 100);
      };
      reader.readAsDataURL(file); // tempUrl 대신 Base64 사용
      
      setToastMessage("이미지가 삽입되었습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    };
  };

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
    },
  }), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limits = { title: 100, mgmtId: 20, source: 20 };
    if (limits[name] && value.length > limits[name]) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) setErrors(prev => ({ ...prev, content: false }));
  };

  const addFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    const MAX_FILE_COUNT = 5;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; 
    const currentFiles = formData.files || [];
    const incomingFiles = Array.from(newFiles);

    if (currentFiles.length + incomingFiles.length > MAX_FILE_COUNT) {
      alert(`파일은 최대 ${MAX_FILE_COUNT}개까지만 등록 가능합니다.`);
      return;
    }

    const validFiles = [];
    incomingFiles.forEach(file => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push({
          name: file.name,
          url: URL.createObjectURL(file), 
          size: formatBytes(file.size)
        });
      } else {
        alert(`${file.name}의 용량이 너무 큽니다. (최대 10MB)`);
      }
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, files: [...prev.files, ...validFiles] }));
      setToastMessage(`${validFiles.length}개의 파일이 추가되었습니다.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // 첨부파일 삭제 핸들러
const handleRemoveFile = (idx) => {
  const fileToRemove = formData.files[idx];

  // 브라우저 메모리 누수 방지
  if (fileToRemove.url && fileToRemove.url.startsWith('blob:')) {
    URL.revokeObjectURL(fileToRemove.url);
  }

  setFormData(prev => ({
    ...prev,
    files: prev.files.filter((_, i) => i !== idx)
  }));
};

  const handleSave = () => {
    const pureText = formData.content.replace(/<(.|\n)*?>/g, '').trim();
    const newErrors = {
      mgmtId: !formData.mgmtId.trim(),
      title: !formData.title.trim(),
      source: !formData.source.trim(),
      content: !pureText 
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      alert("필수 입력 사항을 모두 작성해주세요."); 
      return; 
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
  setIsModalOpen(false);
  const now = new Date();
  const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

  const newEntry = {
    ...formData, // mgmtId, title, content, files 등 모든 데이터 포함
    id: Date.now(),
    date: formattedDate.split(' ')[0],
    createdAt: formattedDate,
    updatedAt: formattedDate,
    views: 0,
    // author: '관리자', // 이미 formData 초기값에 있다면 생략 가능
  };

  pressData.unshift(newEntry);
  setToastMessage("보도자료가 성공적으로 등록되었습니다.");
  setShowToast(true);
  
  // 토스트 메시지를 보여준 후 페이지 이동
  setTimeout(() => navigate('/admin/contents/pressRelList'), 1500);
};

// 1. 취소 실행 로직 (별도 함수 분리)
const confirmCancel = () => {
  setIsCancelModalOpen(false);
  setToastMessage("등록이 취소되었습니다.");
  setShowToast(true);
  
  setTimeout(() => {
    navigate(-1);
  }, 1200);
};

// 2. 취소 버튼 클릭 핸들러
const handleCancel = () => {
  // 제목, 관리번호, 본문 중 하나라도 입력값이 있다면 모달을 띄움
  const isStarted = formData.title.trim() || formData.mgmtId.trim() || formData.content.replace(/<(.|\n)*?>/g, '').trim();
  
  if (isStarted) {
    setIsCancelModalOpen(true);
  } else {
    // 아무것도 입력 안 했으면 바로 뒤로 가기 (토스트 없이 즉시 이동)
    navigate(-1);
  }
};

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}
      

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">보도자료 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">보도자료 정보 입력</h3>
          
          <div className="flex flex-col">
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
              <div className="flex justify-between mt-2 px-1">
                <span className="h-5">{errors.mgmtId && <span className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 관리번호를 입력해주세요</span>}</span>
                <span className={`text-[13px] font-medium ${formData.mgmtId.length >= 20 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{formData.mgmtId.length} / 20자</span>
              </div>
            </div>

            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">제목 (필수)</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="제목을 입력해주세요"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.title ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              <div className="flex justify-between mt-2 px-1">
                <span>{errors.title && <span className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 제목을 입력해주세요</span>}</span>
                <span className={`text-[13px] font-medium ${formData.title.length >= 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{formData.title.length} / 100자</span>
              </div>
            </div>

            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3">출처 (필수)</label>
              <input 
                name="source"
                value={formData.source}
                onChange={handleChange}
                maxLength={20}
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.source ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              <div className="flex justify-between mt-2 px-1 text-[13px]">
                <span>{errors.source && <span className="text-[#E15141] flex items-center gap-1 font-medium"><ErrorIcon /> 출처 입력 필수</span>}</span>
                <span className={formData.source.length >= 20 ? 'text-red-500 font-bold' : 'text-gray-400'}>{formData.source.length} / 20자</span>
              </div>
            </div>

            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">원문 링크 (URL)</label>
              <textarea 
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleChange}
                rows="2"
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-5 py-4 outline-none focus:border-[#2563EB] transition-all font-medium resize-none"
              />
            </div>

            <div className="mb-10 w-full text-left">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">내용 (필수)</label>
              <div className={`bg-white rounded-lg overflow-hidden ${errors.content ? 'custom-quill error-border' : 'custom-quill'}`}> 
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleEditorChange} 
                  modules={modules}
                  formats={allFormats}
                  placeholder="내용을 입력해주세요." 
                />
              </div>
              {errors.content && <div className="text-[#E15141] text-[13px] flex items-center gap-1.5 font-medium mt-2 px-1"><ErrorIcon />내용을 입력해주세요</div>}
            </div>

            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3">첨부파일</label>
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                className="w-full flex flex-col items-center justify-center py-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2563EB] transition-all group"
              >
                <label className="flex flex-col items-center cursor-pointer w-full">
                  <Paperclip className="text-gray-400 group-hover:text-[#2563EB] mb-3" size={32} />
                  <span className="text-[16px] font-bold text-gray-600">파일을 마우스로 끌어오거나 클릭하세요</span>
                  <input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                </label>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                {formData.files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <Paperclip size={20} className="text-[#2563EB]" />
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-gray-800">{file.name}</span>
                        <span className="text-[13px] text-gray-400">{file.size}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFile(idx)}
                      className="p-2 hover:bg-red-50 rounded-full text-red-400 transition-colors"
                    >
                      <X size={20}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px]">노출 여부</label>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({...prev, isPublic: !prev.isPublic}))}
                className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isPublic ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.isPublic ? 'translate-x-[26px]' : 'translate-x-0'}`} />
              </button>
              <span className={`text-[14px] font-bold ${formData.isPublic ? 'text-[#2563EB]' : 'text-gray-400'}`}>{formData.isPublic ? '노출' : '비노출'}</span>
            </div>
          </div>
        </section>

        {/* 하단 버튼 구역 */}
<div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
  {/* onClick을 handleCancel로 변경 */}
  <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 rounded-lg font-bold text-[16px] text-gray-500 bg-white hover:bg-gray-50">취소</button>
  <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700">저장</button>
</div>
      </main>

      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="보도자료를 저장하시겠습니까?" 
        message="작성하신 내용이 목록에 즉시 반영됩니다."
        type="save"
      />

      <AdminConfirmModal 
  isOpen={isCancelModalOpen} 
  onClose={() => setIsCancelModalOpen(false)} 
  onConfirm={confirmCancel} 
  title="등록을 취소하시겠습니까?" 
  message="작성 중인 내용이 저장되지 않고 목록으로 이동합니다." 
  type="delete" 
/>
    </div>
  );
};

export default AdminPressRelAdd;