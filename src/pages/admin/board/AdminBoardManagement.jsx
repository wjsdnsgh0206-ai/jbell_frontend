import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Paperclip, ArrowLeft, Save } from 'lucide-react';
import { noticeApi } from '@/services/api';
import axios from 'axios';

const AdminBoardManagement = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const isEditMode = !!noticeId;

/** <============================================================ useState ============================================================> **/
  const [formData, setFormData] = useState({
    noticeId: '',
    title: '',
    content: '',
    isPublic: true,
    author: 'admin',
    files: []
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);  // 에러 상태 추가
  const [uploadFiles, setUploadFiles] = useState([]);  // 업로드할 파일들
  const [existingFiles, setExistingFiles] = useState([]);  // 기존 파일들 (수정 모드)
  const [deleteFileIds, setDeleteFileIds] = useState([]);  // 삭제할 파일 ID들
/** <============================================================ useState ============================================================> **/



  // 1. 데이터 로드 (수정 모드)
  useEffect(() => {
    if (isEditMode && noticeId) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          // noticeApi.getNoticeDetail 대신 직접 axios 호출
          const response = await axios.get(`/api/notice/${noticeId}`);
          const data = response.data;

          if (data) {
            setFormData({
              noticeId: data.id, // DTO에서 id로 넘어오므로
              title: data.title || '',
              content: data.content || '',
              isPublic: data.isPublic ?? true,
              author: data.author || 'admin'
            });
            if (data.files) {
              setExistingFiles(data.files);
            }
          }
        } catch (error) {
                console.error("데이터 로드 실패:", error);
                setError("내용을 불러오지 못했습니다.");
                alert("내용을 불러오지 못했습니다.");
                navigate('/admin/contents/adminBoardList');  // 목록으로 이동
              } finally {
                setLoading(false);
              }
            };
            fetchDetail();
          }
        }, [isEditMode, noticeId, navigate]);  // navigate 의존성 추가

  // 로딩/에러 처리
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">정보를 가져오는 중입니다...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

/** <============================================================ handler ============================================================> **/

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, isPublic: status }));
  };

// <-------------------------------------------------------------------------------------->
 // 2. 등록 및 수정 실행
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 본문을 모두 입력해주세요.");
      return;
    }

    try {
      const submitData = new FormData();
    
      // 1. 공지사항 텍스트 데이터 (JSON을 Blob으로 감싸서 'notice'라는 이름으로 추가)
      const noticeData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        isPublic: formData.isPublic,
        author: formData.author || "admin"
      };
      
      submitData.append('notice', new Blob([JSON.stringify(noticeData)], {
        type: 'application/json'
      }));
      
      // 2. 새 첨부 파일들 추가 ('files'라는 이름으로 추가)
      uploadFiles.forEach((file) => {
        submitData.append('files', file);
      });
      
      // 3. 삭제할 파일 ID 리스트 추가 (수정 모드일 때만)
      if (isEditMode) {
        // 백엔드에서 @RequestPart List<Long>으로 받으므로 JSON Blob으로 처리
        // 만약 삭제할 파일이 없더라도 빈 배열([])을 보내주는 것이 백엔드 에러 방지에 좋습니다.
        submitData.append('deleteFileIds', new Blob([JSON.stringify(deleteFileIds)], {
          type: 'application/json'
        }));
      }

      // axios 설정 (Content-Type 명시)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      
      if (isEditMode) {
        // 수정 API 호출
        await axios.put(`/api/notice/${noticeId}`, submitData, config);
        alert("공지사항이 수정되었습니다.");
      } else {
        // 등록 API 호출
        await axios.post(`/api/notice`, submitData, config);
        alert("공지사항이 등록되었습니다.");
      }
      navigate('/admin/contents/adminBoardList');
    } catch (error) {
      console.error("저장 실패:", error);
      // 서버에서 보내주는 상세 에러 메시지가 있다면 출력
      const errorMsg = error.response?.data?.message || error.message;
      alert(`저장 중 오류가 발생했습니다: ${errorMsg}`);
    }
  };
// <-------------------------------------------------------------------------------------->


// <-------------------------------------------------------------------------------------->
  // 공지사항 첨부파일 관련
  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // 파일 크기 체크 (예: 10MB 제한)
    const maxSize = 10 * 1024 * 1024;  // 10MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name}은(는) 10MB를 초과합니다.`);
        return false;
      }
      return true;
    });
    
    setUploadFiles(prev => [...prev, ...validFiles]);
  };

  // ✅ 새로 추가한 파일 삭제
  const handleRemoveUploadFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ 기존 파일 삭제 (수정 모드)
  const handleRemoveExistingFile = (fileId) => {
    setDeleteFileIds(prev => [...prev, fileId]);
    setExistingFiles(prev => prev.filter(f => f.fileId !== fileId));
  };
// <-------------------------------------------------------------------------------------->
/** <============================================================ handler ============================================================> **/



  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg p-10 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center text-graygray-50 hover:text-admin-text-primary mb-2 transition-colors">
            <ArrowLeft size={20} className="mr-1" /> 목록으로 돌아가기
          </button>
          <h2 className="text-heading-l text-admin-text-primary tracking-tight">
            공지사항 {isEditMode ? '수정' : '등록'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-graygray-5">
            <div>
              <label className="block text-body-m-bold text-admin-text-primary mb-3">공지 번호</label>
              <input 
                type="text" 
                value={isEditMode ? noticeId : "자동 생성"} 
                disabled 
                className="w-full h-12 px-4 bg-graygray-5 border border-admin-border rounded-md text-graygray-40 font-mono"
              />
            </div>
            <div>
              <label className="block text-body-m-bold text-admin-text-primary mb-3">게시 여부</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => handleStatusChange(true)} className={`flex items-center gap-2 ${formData.isPublic ? 'text-admin-primary font-bold' : 'text-gray-500'}`}>
                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.isPublic ? 'border-admin-primary bg-admin-primary' : 'border-gray-300'}`}>
                    {formData.isPublic && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div> 사용함
                </button>
                <button type="button" onClick={() => handleStatusChange(false)} className={`flex items-center gap-2 ${!formData.isPublic ? 'text-admin-primary font-bold' : 'text-gray-500'}`}>
                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!formData.isPublic ? 'border-admin-primary bg-admin-primary' : 'border-gray-300'}`}>
                    {!formData.isPublic && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div> 사용 안 함
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-body-m-bold text-admin-text-primary mb-3">제목</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="공지사항 제목을 입력하세요"
              className="w-full h-14 px-5 border border-admin-border rounded-md text-body-m outline-none focus:border-admin-primary transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-body-m-bold text-admin-text-primary mb-3">본문 내용</label>
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="내용을 작성해주세요"
              className="w-full h-80 p-5 border border-admin-border rounded-md text-body-m outline-none focus:border-admin-primary transition-all resize-none"
            />
          </div>


          {/* 첨부파일 영역 추가 */}
          <div className="mb-6">
            <label className="block text-body-m-bold text-admin-text-primary mb-3 flex items-center gap-2">
              <Paperclip size={18} />
              첨부파일
            </label>
            
            {/* 파일 선택 버튼 */}
            <div className="mb-4">
              <input
                type="file"
                id="fileUpload"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="*/*"
              />
              <label
                htmlFor="fileUpload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-admin-border rounded-md cursor-pointer hover:border-admin-primary hover:bg-gray-50 transition-all"
              >
                <Paperclip size={18} className="text-graygray-40" />
                <span className="text-body-m text-graygray-70">파일 선택</span>
              </label>
              <p className="text-[13px] text-graygray-40 mt-2">
                * 최대 10MB까지 업로드 가능합니다.
              </p>
            </div>

            {/* 기존 파일 목록 (수정 모드) */}
            {isEditMode && existingFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-[13px] text-graygray-50 font-bold mb-2">기존 파일</p>
                <ul className="space-y-2">
                  {existingFiles.map((file) => (
                    <li
                      key={file.fileId}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip size={16} className="text-blue-600" />
                        <span className="text-[14px] text-graygray-70">{file.fileRealName || file.originalName}</span>
                        <span className="text-[12px] text-graygray-40">
                          ({(file.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingFile(file.fileId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 새로 추가한 파일 목록 */}
            {uploadFiles.length > 0 && (
              <div>
                <p className="text-[13px] text-graygray-50 font-bold mb-2">새로 추가한 파일</p>
                <ul className="space-y-2">
                  {uploadFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip size={16} className="text-green-600" />
                        <span className="text-[14px] text-graygray-70">{file.name}</span>
                        <span className="text-[12px] text-graygray-40">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveUploadFile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-center gap-4 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-10 h-14 bg-white border border-admin-border text-graygray-50 font-bold rounded-md hover:bg-gray-50 transition-all">
            취소
          </button>
          <button type="submit" className="px-10 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 transition-all flex items-center gap-2 shadow-md">
            <Save size={20} /> {isEditMode ? '수정하기' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBoardManagement;