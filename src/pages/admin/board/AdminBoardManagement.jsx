import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Paperclip, ArrowLeft, Save } from 'lucide-react';
import { noticeApi } from '@/services/api';

const AdminBoardManagement = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const isEditMode = !!noticeId;

  const [formData, setFormData] = useState({
    noticeId: '',
    title: '', // 백엔드 Notice 엔티티 필드명과 일치
    content: '',
    isPublic: true,
    files: []
  });

  // 1. 데이터 로드 (수정 모드)
  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        try {
          // noticeApi.getNoticeDetail 또는 적절한 상세조회 메서드 사용
          const response = await noticeApi.getNoticeDetail(boardId);
          const data = response.data;
          
          setFormData({
            noticeId: data.Id,
            title: data.title,
            content: data.content,
            isPublic: data.isPublic === 'Y' || data.isPublic === true,
            files: [] // 파일은 백엔드 구현에 따라 추가 처리 필요
          });
        } catch (error) {
          console.error("데이터 로드 실패:", error);
          alert("정보를 불러오는데 실패했습니다.");
        }
      };
      fetchDetail();
    }
  }, [isEditMode, boardId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, isPublic: status }));
  };

  // 2. 등록 및 수정 실행
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 본문을 모두 입력해주세요.");
      return;
    }

    const payload = {
      noticeId: isEditMode ? Number(boardId) : null,
      title: formData.title,
      content: formData.content,
      isPublic: formData.isPublic, // 여기서 true/false가 전달
      author: "admin"
    };

    try {
      if (isEditMode) {
        // 수정 API 호출
        await noticeApi.updateNotice(boardId, payload);
        alert("공지사항이 수정되었습니다.");
      } else {
        // 등록 API 호출
        await noticeApi.createNotice(payload);
        alert("공지사항이 등록되었습니다.");
      }
      navigate('/admin/contents/adminBoardList');
    } catch (error) {
      console.error("저장 실패:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

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
                value={isEditMode ? boardId : "자동 생성"} 
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