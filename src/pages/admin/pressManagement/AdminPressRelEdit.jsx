// src/pages/admin/pressManagement/AdminPressRelEdit.jsx
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { pressService } from '@/services/api';
import { Paperclip, X, Calendar } from 'lucide-react';
// React-Quill 및 Quill 내부 설정 임포트
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// 관리자 보도자료 수정 페이지 //

const Block = Quill.import('blots/block');
Block.tagName = 'P';
Quill.register(Block, true);

const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill} />
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#E15141" />
    <path d="M10 6L6 10M6 6L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

const AdminPressRelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  const quillRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileToDeleteIdx, setFileToDeleteIdx] = useState(null);
  const [rawFiles, setRawFiles] = useState([]);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({ mgmtId: false, title: false, source: false, content: false });
  const [isDirty, setIsDirty] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await pressService.getPressDetail(id);
        if (data) {
          setFormData({
            mgmtId: data.contentId,
            title: data.title,
            content: data.body,
            source: data.source,
            sourceUrl: data.contentLink || '',
            isPublic: data.visibleYn === 'Y',
            createdAt: data.createdAt,
            updatedAt: data.lastUpdateDate,
            files: data.fileList || []
          });
          setBreadcrumbTitle(data.title);
        }
      } catch (error) {
        console.error("Data Load Error:", error);
        alert("해당 데이터를 찾을 수 없거나 불러오는데 실패했습니다.");
        navigate('/admin/contents/pressRelList', { replace: true });
      }
    };
    fetchDetail();
  }, [id, navigate, setBreadcrumbTitle]);

  useEffect(() => {
    return () => {
      setBreadcrumbTitle("");
    };
  }, [setBreadcrumbTitle]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (formData?.files) {
        formData.files.forEach(file => {
          if (file.url?.startsWith('blob:')) URL.revokeObjectURL(file.url);
        });
      }
    };
  }, [isDirty, formData?.files]);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg, image/png, image/gif, image/webp');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert("jpg, png, gif, webp 형식의 이미지 파일만 업로드 가능합니다.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("이미지 용량은 최대 5MB까지 가능합니다.");
        return;
      }
      const quill = quillRef.current.getEditor();
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
      reader.readAsDataURL(file);
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
    const limits = { title: 100, mgmtId: 20, source: 20, sourceUrl: 500 };
    if (limits[name] && value.length > limits[name]) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    setIsDirty(true);
    const pureText = content.replace(/<(.|\n)*?>/g, '').trim();
    if (pureText && errors.content) setErrors(prev => ({ ...prev, content: false }));
  };

  const addFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'hwp', 'hwpx', 'docx', 'xlsx', 'zip'];
    const MAX_FILE_COUNT = 5;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const currentFiles = formData.files || [];
    const incomingFiles = Array.from(newFiles);

    const validPreviews = [];
    const validRawFiles = [];

    for (const file of incomingFiles) {
      // 중복 체크 로직
      // 중복 체크 통합 (서버 파일 realName + 신규 파일 name 모두 체크)
      const isDuplicate = currentFiles.some(f =>
        (f.realName === file.name) || (f.name === file.name)
      );

      if (isDuplicate) {
        alert(`"${file.name}"은(는) 이미 추가된 파일입니다.`);
        continue;
      }

      if (currentFiles.length + validPreviews.length >= MAX_FILE_COUNT) {
        alert(`파일은 최대 ${MAX_FILE_COUNT}개까지만 등록 가능합니다.`);
        break;
      }
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        alert(`${file.name}은(는) 허용되지 않는 형식입니다.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}의 용량이 너무 큽니다. (최대 10MB)`);
        continue;
      }

      validPreviews.push({
        name: file.name,
        realName: file.name,
        url: URL.createObjectURL(file),
        size: formatBytes(file.size),
        isNew: true // 신규 파일임을 표시
      });
      console.log(validPreviews);
      validRawFiles.push(file);
    }

    if (validPreviews.length > 0) {

      setFormData(prev => ({ ...prev, files: [...prev.files, ...validPreviews] }));
      console.log("formData", formData);
      setRawFiles(prev => [...prev, ...validRawFiles]); // 실제 파일 보관
      setIsDirty(true);
    }
  };

  const handleFileDeleteClick = (idx) => {
    setFileToDeleteIdx(idx);
    setIsFileModalOpen(true);
  };

  const confirmFileDelete = () => {
    const fileToDelete = formData.files[fileToDeleteIdx];

    if (fileToDelete.isNew) {
      setRawFiles(prev => prev.filter(f => f.name !== fileToDelete.name));
    }

    if (fileToDelete?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(fileToDelete.url);
    }

    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== fileToDeleteIdx)
    }));
    setIsDirty(true);
    setIsFileModalOpen(false);
  };

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

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    setToastMessage("수정이 취소되었습니다.");
    setShowToast(true);
    setTimeout(() => {
      navigate(`/admin/contents/pressRelDetail/${id}`, { replace: true });
    }, 1000);
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      navigate(`/admin/contents/pressRelDetail/${id}`);
    }
  };

  const searchSpecificTags = () => {
    const quill = quillRef.current.getEditor();
    const editorRoot = quill.root; // 에디터의 컨텐츠 root DOM
    console.log(editorRoot.innerHTML);
    // li 태그 검색
    const olList = editorRoot.querySelectorAll('ol');

    olList.forEach(ol => {
      const firstLi = ol.querySelector('li');
      const type = firstLi.dataset.list;

      if (type === 'bullet') {
        ol.classList.add('list-disc');
        ol.classList.add('list-inside');
      }
      if (type === 'ordered') {
        ol.classList.add('list-decimal');
        ol.classList.add('list-inside');
      }

    });

    formData.content = editorRoot.innerHTML;
    console.log(formData.content);
    setFormData(formData);

  };

  // 저장 확정 시 백엔드 API 호출
  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    searchSpecificTags();
    try {
      const submitData = new FormData();

      const existingFileIds = formData.files
        .filter(f => !f.isNew)
        .map(f => f.id);

      const pressDto = {
        contentId: id,
        title: formData.title,
        body: formData.content,
        visibleYn: formData.isPublic ? 'Y' : 'N',
        source: formData.source,
        contentLink: formData.sourceUrl,
        userId: '관리자', // 필요시 실제 로그인 사용자 정보
        regType: '직접등록',
        existingFileIds: existingFileIds
      };

      // JSON 데이터 추가
      submitData.append("data", new Blob([JSON.stringify(pressDto)], { type: "application/json" }));

      // 신규 파일들만 추가
      if (rawFiles.length > 0) {
        rawFiles.forEach(file => {
          submitData.append('files', file);
        });
      }

      // API 호출
      await pressService.admin.update(id, submitData);

      setToastMessage("성공적으로 수정되었습니다.");
      setShowToast(true);
      setTimeout(() => navigate(`/admin/contents/pressRelDetail/${id}`, { replace: true }), 1200);
    } catch (error) {
      console.error("Update Error:", error);
      alert("수정 저장 중 오류가 발생했습니다. (사유: " + error.message + ")");
    }
  };

  if (!formData) return null;


  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            {!toastMessage.includes("취소") && <SuccessIcon fill="#4ADE80" />}
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">보도자료 수정</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">보도자료 정보 수정</h3>

          <div className="flex flex-col">
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">관리번호 ID</label>
              <input
                name="mgmtId"
                value={formData.mgmtId}
                readOnly
                className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium"
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 관리번호(ID)는 고유 식별자로 수정할 수 없습니다.</p>
            </div>

            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">제목 (필수)</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium text-[16px] ${errors.title ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              <div className="flex justify-between items-start mt-2 px-1 text-[13px] font-medium text-gray-400">
                <span>{errors.title && <span className="text-[#E15141] flex items-center gap-1"><ErrorIcon /> 제목을 입력해주세요</span>}</span>
                <span className={formData.title.length >= 100 ? 'text-red-500 font-bold' : ''}>{formData.title.length} / 100자</span>
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
              <div className="flex justify-between mt-2 px-1 text-[13px] font-medium text-gray-400">
                <span>{errors.source && <span className="text-[#E15141] flex items-center gap-1"><ErrorIcon /> 출처를 입력해주세요</span>}</span>
                <span className={formData.source.length >= 20 ? 'text-red-500 font-bold' : ''}>{formData.source.length} / 20자</span>
              </div>
            </div>

            <div className="mb-10 w-full">
              <div className="flex justify-between items-end mb-3">
                <label className="block font-bold text-[16px] text-[#111]">원문 링크 (URL)</label>
                {formData.sourceUrl && (
                  <button type="button" onClick={() => window.open(formData.sourceUrl, '_blank')} className="text-[13px] font-bold text-[#2563EB] hover:underline">새 창에서 링크 열기 ↗</button>
                )}
              </div>
              <textarea
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleChange}
                rows="2"
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-5 py-4 outline-none focus:border-[#2563EB] transition-all font-medium text-blue-600 resize-none bg-white"
              />
            </div>

            <div className="w-full text-left mb-10">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">내용 (필수)</label>
              <div className={`custom-quill-wrapper ${errors.content ? 'error-border' : ''}`} style={{ marginBottom: '0px' }}>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={handleEditorChange}
                  modules={modules}
                  placeholder="내용을 입력해주세요."
                  className="custom-quill bg-white"
                />
              </div>

              {errors.content && (
                <div className="text-[#E15141] text-[13px] font-medium mt-2 px-1 flex items-center gap-1">
                  <ErrorIcon /> 내용을 입력해주세요
                </div>
              )}
            </div>
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3">첨부파일 관리</label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                className="w-full flex flex-col items-center justify-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2563EB] transition-all"
              >
                <label className="flex flex-col items-center cursor-pointer">
                  <Paperclip className="text-gray-400 mb-2" size={24} />
                  <span className="text-[14px] font-bold text-gray-600">파일을 드래그하거나 클릭하여 추가</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.hwp,.hwpx,.docx,.xlsx,.zip"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = ''; // "중복" 알람
                    }}
                  />
                </label>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {formData.files?.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg w-full shadow-sm">
                    <div className="flex items-center gap-3">
                      <Paperclip size={18} className="text-[#2563EB]" />
                      <span className="text-[14px] font-bold text-gray-800 truncate">{file.realName}</span>
                      <span className="text-[12px] text-gray-400">{file.size}</span>
                    </div>
                    <button type="button" onClick={() => handleFileDeleteClick(idx)} className="p-1 hover:bg-red-50 text-red-400 transition-colors"><X size={18} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px]">노출 여부</label>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }));
                  setIsDirty(true);
                }}
                className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isPublic ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.isPublic ? 'translate-x-[26px]' : 'translate-x-0'}`} />
              </button>
              <span className={`text-[14px] font-bold ${formData.isPublic ? 'text-[#2563EB]' : 'text-gray-400'}`}>{formData.isPublic ? '노출' : '비노출'}</span>
            </div>

            <div className="pt-10 mt-10 border-t border-gray-100 flex flex-col space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} />
                  {(formData.createdAt || formData.date)?.replace('T', ' ')}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} />
                  {(formData.updatedAt || formData.createdAt)?.replace('T', ' ')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold">취소</button>
          <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold">저장</button>
        </div>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSave} title="변경사항을 저장하시겠습니까?" message="수정된 내용은 즉시 반영됩니다." type="save" />
      <AdminConfirmModal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)} onConfirm={confirmFileDelete} title="첨부파일을 삭제하시겠습니까?" message="삭제된 파일은 복구할 수 없습니다." type="delete" />
      <AdminConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancel}
        title="수정을 취소하시겠습니까?"
        message="작성 중인 내용이 저장되지 않고 이전 페이지로 이동합니다."
        type="delete"
      />
    </div>
  );
};

export default AdminPressRelEdit;