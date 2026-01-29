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
    title: '',
    content: '',
    isPublic: true,
    author: 'admin',  // ✅ 추가!
    files: []
  });

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);  // 에러 상태 추가

  // 1. 데이터 로드 (수정 모드)
  useEffect(() => {
    if (isEditMode && noticeId) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          setError(null);  // 에러 초기화
          
          const response = await noticeApi.getNoticeDetail(noticeId);
          
          // 응답 데이터 확인 (콘솔로 구조 확인용)
          console.log("백엔드 응답:", response);
          
          // 백엔드 응답 구조에 따라 수정
          const data = response.data || response;  // Axios 설정에 따라
          
          if (data) {
            setFormData({
              noticeId: data.noticeId || data.id,  // 둘 다 대응
              title: data.title || '',
              content: data.content || '',
              isPublic: data.isPublic ?? true,
              author: data.author || 'admin'
            });
          } else {
            throw new Error("데이터가 없습니다.");
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
      title: formData.title.trim(),  // 공백 제거
      content: formData.content.trim(),
      isPublic: formData.isPublic,
      author: formData.author || "admin"  // author 포함
    };

    try {
      if (isEditMode) {
        // 수정 API 호출
        await noticeApi.updateNotice(noticeId, payload);
        alert("공지사항이 수정되었습니다.");
      } else {
        // 등록 API 호출
        await noticeApi.createNotice(payload);
        alert("공지사항이 등록되었습니다.");
      }
      navigate('/admin/contents/adminBoardList');
    } catch (error) {
      console.error("저장 실패:", error);
      alert(`서버 통신 중 오류가 발생했습니다: ${error.message}`);
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