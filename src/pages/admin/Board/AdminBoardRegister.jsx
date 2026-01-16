import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Paperclip, Save, ArrowLeft } from 'lucide-react';
import { noticeData } from '@/pages/user/openboards/BoardData';

const AdminBoardRegister = () => {
  const navigate = useNavigate();

  // 1. 번호 자동 발급 (기존 데이터의 최대 ID + 1)
  const nextId = noticeData.length > 0 
    ? Math.max(...noticeData.map(post => post.id)) + 1 
    : 1;

  // 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true, // 라디오 버튼 상태
    files: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, isPublic: status }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...selectedFiles] }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 본문을 모두 입력해주세요.");
      return;
    }

    // 실제 전송 로직 예시
    const newPost = {
      id: nextId,
      ...formData,
      author: "관리자",
      createdAt: new Date().toISOString().split('T')[0],
      views: 0
    };
    
    console.log("저장 데이터:", newPost);
    alert("공지사항이 등록되었습니다.");
    navigate('/admin/board/list');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg p-10 font-sans">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-graygray-50 hover:text-admin-text-primary mb-2 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" /> 목록으로 돌아가기
          </button>
          <h2 className="text-heading-l text-admin-text-primary tracking-tight">공지사항 작성</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          {/* 번호 및 게시여부 설정 */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-graygray-5">
            <div>
              <label className="block text-body-m-bold text-admin-text-primary mb-3">공지 번호</label>
              <input 
                type="text" 
                value={nextId} 
                disabled 
                className="w-full h-12 px-4 bg-graygray-5 border border-admin-border rounded-md text-graygray-40 font-mono"
              />
            </div>
            <div>
              <label className="block text-body-m-bold text-admin-text-primary mb-3">게시 여부</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer group">
                  <input 
                    type="radio" 
                    name="isPublic" 
                    checked={formData.isPublic === true}
                    onChange={() => handleStatusChange(true)}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-all ${formData.isPublic ? 'border-admin-primary bg-admin-primary' : 'border-gray-300'}`}>
                    {formData.isPublic && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-body-m ${formData.isPublic ? 'text-admin-primary font-bold' : 'text-gray-500'}`}>사용함</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input 
                    type="radio" 
                    name="isPublic" 
                    checked={formData.isPublic === false}
                    onChange={() => handleStatusChange(false)}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-all ${!formData.isPublic ? 'border-admin-primary bg-admin-primary' : 'border-gray-300'}`}>
                    {!formData.isPublic && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-body-m ${!formData.isPublic ? 'text-admin-primary font-bold' : 'text-gray-500'}`}>사용 안 함</span>
                </label>
              </div>
            </div>
          </div>

          {/* 제목 입력 */}
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

          {/* 본문 입력 */}
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

          {/* 첨부 파일 */}
          <div>
            <label className="block text-body-m-bold text-admin-text-primary mb-3">첨부 파일</label>
            <div className="flex flex-col gap-4">
              <label className="w-fit flex items-center gap-2 px-4 py-2 bg-white border border-admin-border rounded-md cursor-pointer hover:bg-gray-50 transition-all">
                <Paperclip size={18} className="text-graygray-50" />
                <span className="text-body-s-bold text-graygray-60">파일 선택</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
              </label>
              
              {formData.files.length > 0 && (
                <ul className="grid grid-cols-1 gap-2">
                  {formData.files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-graygray-5 rounded-md border border-graygray-10">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip size={14} className="text-graygray-40 flex-shrink-0" />
                        <span className="text-[13px] text-graygray-60 truncate">{file.name}</span>
                        <span className="text-[11px] text-graygray-30">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-graygray-40 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* 하단 버튼 제어 */}
        <div className="flex justify-center gap-4 pt-4">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 h-14 bg-white border border-admin-border text-graygray-50 font-bold rounded-md hover:bg-gray-50 transition-all"
          >
            취소
          </button>
          <button 
            type="submit"
            onClick={() => navigate('/admin/contents/adminBoardList')}
            className="px-10 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
          >
            <Save size={20} /> 등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBoardRegister;