import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, Paperclip, Edit } from 'lucide-react';
import { noticeData } from '@/pages/user/openboards/BoardData';

const AdminBoardDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // location.state로 넘어온 데이터 또는 id로 찾기
  const post = location.state || noticeData.find(p => p.id === parseInt(id));

  // 데이터가 없으면 에러 처리
  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-admin-bg">
        <p className="text-xl text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
        <button 
          onClick={() => navigate('/admin/contents/adminBoardList')}
          className="px-6 py-2 bg-admin-primary text-white rounded-md"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg p-10 font-sans">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <button 
            onClick={() => navigate('/admin/contents/adminBoardList')} 
            className="flex items-center text-graygray-50 hover:text-admin-text-primary mb-2 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" /> 목록으로 돌아가기
          </button>
          <h2 className="text-heading-l text-admin-text-primary tracking-tight">공지사항 상세 보기</h2>
        </div>
      </div>

      {/* 본문 영역 */}
      <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard">
        {/* 상단 정보 영역 */}
        <div className="p-8 border-b border-admin-border">
          <div className="flex items-center gap-3 mb-4">
            {post.isPin && (
              <span className="px-3 py-1 bg-red-50 text-red-500 text-[12px] font-bold rounded border border-red-100">
                공지
              </span>
            )}
            <span className={`px-3 py-1 rounded-md text-[12px] font-bold border ${
              post.isPublic 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}>
              {post.isPublic ? '사용' : '미사용'}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-admin-text-primary mb-6">
            {post.title}
          </h1>
          
          {/* 메타 정보 */}
          <div className="flex items-center gap-6 text-[14px] text-graygray-50">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>작성일: {post.createdAt}</span>
            </div>
            {post.updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>수정일: {post.updatedAt}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>조회수: {post.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="p-8 border-b border-admin-border">
          <div className="text-body-m text-graygray-70 whitespace-pre-wrap leading-relaxed min-h-[300px]">
            {post.content}
          </div>
        </div>

        {/* 첨부파일 영역 */}
        {post.files && post.files.length > 0 && (
          <div className="p-8">
            <h3 className="text-body-m-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <Paperclip size={18} />
              첨부파일 ({post.files.length})
            </h3>
            <ul className="space-y-2">
              {post.files.map((file, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-between p-3 bg-graygray-5 rounded-md border border-graygray-10 hover:bg-graygray-10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Paperclip size={16} className="text-graygray-40" />
                    <span className="text-[14px] text-graygray-70">{file.name || file}</span>
                    {file.size && (
                      <span className="text-[12px] text-graygray-30">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                  <button className="text-[13px] text-admin-primary font-bold hover:underline">
                    다운로드
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 하단 버튼 영역 */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={() => navigate('/admin/contents/adminBoardList')}
          className="px-10 h-14 bg-white border border-admin-border text-graygray-50 font-bold rounded-md hover:bg-gray-50 transition-all"
        >
          목록으로
        </button>
        <button 
          onClick={() => navigate(`/admin/contents/adminBoardRegister/${post.boardTitle}`, { state: post })}
          className="px-10 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
        >
          <Edit size={20} /> 수정하기
        </button>
      </div>
    </div>
  );
};

export default AdminBoardDetail;