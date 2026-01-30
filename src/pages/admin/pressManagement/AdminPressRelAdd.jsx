import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal'; 
import { pressService } from '@/services/api';
import { Paperclip, X } from 'lucide-react';

// ReactQuill과 Quill 임포트 (중복 제거)
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// [수정] 중복 등록 방지: Quill 등록 로직을 컴포넌트 외부에서 안전하게 처리
const registerQuill = () => {
  const Block = Quill.import('blots/block');
  Block.tagName = 'P';
  Quill.register(Block, true);
  
  // 이미 등록된 포맷은 다시 등록하지 않도록 방어 로직이 필요할 수 있습니다.
  // 보통 React-Quill-new는 기본 포맷을 다 포함하고 있으므로, 
  // 특별한 커스터마이징이 없다면 아래 register들은 생략해도 에러가 사라집니다.
};
registerQuill();

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

  // 폼 데이터 초기 상태 (rawFiles 추가)
  const [formData, setFormData] = useState({
    title: '',
    source: '',
    sourceUrl: '',
    isPublic: true,
    content: '',
    files: [],      // 화면 목록용 (미리보기)
    rawFiles: []    // 실제 전송용 (File 객체 원본)
  });

  const [errors, setErrors] = useState({ title: false, source: false, content: false });

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

 // [수정] 이탈 방지 로직에서 mgmtId 참조 제거
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isDirty = formData.title.trim() || formData.content.replace(/<(.|\n)*?>/g, '').trim();
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData.title, formData.content]); // 의존성 배열 최적화

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

  const handleEditorChange = (content) => {
  setFormData(prev => ({ ...prev, content }));
  if (errors.content) setErrors(prev => ({ ...prev, content: false }));
};

  // [수정] handleChange에서 mgmtId 제한 제거
  const handleChange = (e) => {
    const { name, value } = e.target;
    const limits = { title: 100, source: 20 }; // mgmtId 삭제
    if (limits[name] && value.length > limits[name]) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  // --- [핸들러 구역 수정] ---

  const addFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'hwp', 'docx', 'xlsx', 'zip'];
    const MAX_FILE_COUNT = 5;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const currentFiles = formData.files || [];
    const incomingFiles = Array.from(newFiles);

    const validFilePreviews = []; // 화면 표시용
    const validFileObjects = [];  // 백엔드 전송용

    for (const file of incomingFiles) {
      // 1. 중복 체크
      const isDuplicate = currentFiles.some(existingFile => existingFile.name === file.name);
      if (isDuplicate) {
        alert(`"${file.name}"은(는) 이미 추가된 파일입니다.`);
        continue; 
      }

      // 2. 개수 체크
      if (currentFiles.length + validFilePreviews.length >= MAX_FILE_COUNT) {
        alert(`파일은 최대 ${MAX_FILE_COUNT}개까지만 등록 가능합니다.`);
        break; 
      }

      // 3. 확장자 체크
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        alert(`${file.name}은(는) 허용되지 않는 파일 형식입니다.`);
        continue; 
      }

      // 4. 용량 체크
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}의 용량이 너무 큽니다. (최대 10MB)`);
        continue;
      }

      // 검증 통과: 미리보기 데이터와 실제 파일 객체 각각 저장
      validFilePreviews.push({
        name: file.name,
        url: URL.createObjectURL(file), 
        size: formatBytes(file.size)
      });
      validFileObjects.push(file);
    }

    if (validFilePreviews.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        files: [...prev.files, ...validFilePreviews],
        rawFiles: [...(prev.rawFiles || []), ...validFileObjects]
      }));
      setToastMessage(`${validFilePreviews.length}개의 파일이 추가되었습니다.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // 첨부파일 삭제 핸들러 (이후 코드는 동일)

  // 첨부파일 삭제 핸들러
const handleRemoveFile = (idx) => {
  const fileToRemove = formData.files[idx];

  if (fileToRemove.url && fileToRemove.url.startsWith('blob:')) {
    URL.revokeObjectURL(fileToRemove.url);
  }

  setFormData(prev => ({
    ...prev,
    files: prev.files.filter((_, i) => i !== idx),
    rawFiles: prev.rawFiles.filter((_, i) => i !== idx) // rawFiles도 함께 삭제
  }));
};

  // [수정] 저장 시 필수값 체크에서 mgmtId 제외
  const handleSave = () => {
    const pureText = formData.content.replace(/<(.|\n)*?>/g, '').trim();
    const newErrors = {
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

 const handleConfirmSave = async () => {
  setIsModalOpen(false);
  
  try {
    const submitData = new FormData();
    
    // 1. 백엔드 PressDTO 구조와 100% 일치하게 객체 생성
    const pressDto = {
      title: formData.title,
      body: formData.content,          // DTO 필드명 body
      visibleYn: formData.isPublic ? 'Y' : 'N',
      source: formData.source,
      contentLink: formData.sourceUrl, // DTO 필드명 contentLink
      userId: 'ADMIN_MASTER', 
      regType: '직접등록'
    };

    // 2. 중요: 스프링 컨트롤러가 @RequestPart("data")로 받으므로 Blob 처리
    submitData.append("data", new Blob([JSON.stringify(pressDto)], { type: "application/json" }));
    
    // 3. 파일 데이터 추가 (rawFiles에서 원본 파일 꺼내기)
    if (formData.rawFiles && formData.rawFiles.length > 0) {
      formData.rawFiles.forEach(file => {
        submitData.append('files', file); // 컨트롤러의 @RequestPart("files")
      });
    }

    // 4. API 호출
    const response = await pressService.admin.create(submitData);

    if (response) {
      setToastMessage("보도자료가 성공적으로 등록되었습니다.");
      setShowToast(true);
      setTimeout(() => navigate('/admin/contents/pressRelList'), 1500);
    }
  } catch (error) {
    console.error("등록 실패:", error);
    alert("등록 중 서버 오류가 발생했습니다.");
  }
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

// [수정] 취소 버튼 클릭 시 mgmtId 참조 제거
  const handleCancel = () => {
    const isStarted = formData.title.trim() || formData.content.replace(/<(.|\n)*?>/g, '').trim();
    if (isStarted) {
      setIsCancelModalOpen(true);
    } else {
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
                placeholder="예: 행정안전부, 전북안전대책본부" // placeholder 추가
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${errors.source ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              <div className="flex justify-between mt-2 px-1 text-[13px]">
                <span>{errors.source && <span className="text-[#E15141] flex items-center gap-1 font-medium"><ErrorIcon /> 출처를 입력해주세요</span>}</span>
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

            {/* 등록 페이지 내용 부분 - 수정 페이지와 동일한 구조로 변경 */}
<div className="mb-10 w-full text-left">
  <label className="block font-bold text-[16px] mb-3 text-[#111]">내용 (필수)</label>
  
  {/* mb-[-40px] 대신 공통 클래스 custom-quill-wrapper 적용 */}
  <div className={`custom-quill-wrapper ${errors.content ? 'error-border' : ''}`}> 
    <ReactQuill 
      ref={quillRef}
      theme="snow" 
      value={formData.content} 
      onChange={handleEditorChange} 
      modules={modules}
      formats={allFormats}
      placeholder="내용을 입력해주세요."
      className="custom-quill bg-white" 
    />
  </div>
  
  {errors.content && (
    <div className="text-[#E15141] text-[13px] flex items-center gap-1.5 font-medium mt-2 px-1">
      <ErrorIcon />내용을 입력해주세요
    </div>
  )}
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
                  <input 
  type="file" 
  multiple 
  className="hidden" 
  accept=".jpg,.jpeg,.png,.webp,.pdf,.hwp,.docx,.xlsx,.zip" 
  onChange={(e) => {
    addFiles(e.target.files);
    e.target.value = ''; // "중복" 알람
  }} 
/>
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