import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Calendar, User, Eye, Paperclip, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminBoardDetail = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();

  // 상태 변수 이름
  const [post, setPost] = useState(null);

  // location.state로 넘어온 데이터 또는 id로 찾기
  // const post = location.state || noticeData.find(p => p.boardId === parseInt(boardId));

  // 조회수 방어 코드
  useEffect(() => {
    if (!noticeId) return;

    axios.get(`/api/notice/${noticeId}`)
      .then(res => {
        // 데이터가 정상적으로 들어왔는지 로그로 확인해 보세요.
        console.log("받은 데이터:", res.data);
        setPost(res.data);
      })
      .catch(err => {
        console.error("데이터 로딩 실패:", err);
        // 에러 발생 시 알림을 주면 파악이 쉽습니다.
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
      });
  }, [noticeId]);

  // 데이터가 없으면 에러 처리
  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-admin-bg">
        <p className="text-xl text-gray-500 mb-4">게시글을 불러오는 중이거나 찾을 수 없습니다.</p>
        <button 
          onClick={() => navigate('/admin/contents/adminBoardList')}
          className="px-6 py-2 bg-admin-primary text-white rounded-md"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }
/** <============================================================ ... ============================================================> **/
/** <============================================================ ... ============================================================> **/
  // 파일 다운로드 핸들러
  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`/api/notice/file/download/${fileId}`, {
        responseType: 'blob'
      });
      
      // 파일명 추출
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'download';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // 다운로드 트리거
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('다운로드 실패:', error);
        alert('파일 다운로드에 실패했습니다.');
      }
  };
/** <============================================================ ... ============================================================> **/




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
            {/* 기존 post.isPublic 부분을 아래와 같이 수정 */}
              <span className={`px-3 py-1 rounded-md text-[12px] font-bold border ${
                (post.isPublic === true || post.isPublic === 'Y') 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-gray-50 text-gray-400 border-gray-200'
                }`}>
                {(post.isPublic === true || post.isPublic === 'Y') ? '사용' : '미사용'}
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
              <span>조회수: {(post.views ?? 0).toLocaleString()}</span>
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
                  key={file.fileId}
                  className="flex items-center justify-between p-3 bg-graygray-5 rounded-md border border-graygray-10 hover:bg-graygray-10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Paperclip size={16} className="text-graygray-40" />
                    <span className="text-[14px] text-graygray-70">{file.name || file}</span>
                    {file.size && (
                      <span className="text-[12px] text-graygray-30">
                        ({(file.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                  <button 
                  onClick={() => handleDownload(file.fileId)}
                  className="text-[13px] text-admin-primary font-bold hover:underline">
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
          onClick={() => navigate(`/admin/contents/adminBoardEdit/${noticeId}`, { state: post })}
          className="px-10 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
        >
          <Edit size={20} /> 수정하기
        </button>
      </div>
    </div>
  );
};

export default AdminBoardDetail;