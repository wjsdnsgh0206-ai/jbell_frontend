import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { pressService } from '@/services/api'; // API 서비스 임포트
import { Button } from '@/components/shared/Button';

// 보도자료 상세페이지 //

const UserPressRelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

// --- [추가] 서버 데이터 상태 관리 ---
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);  

  // --- 라이프사이클 관리 --- //
  // 페이지 진입 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- 데이터 매칭 --- //
  // URL의 id와 일치하는 데이터를 pressData에서 검색
  // --- [수정] 데이터 가져오기 ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        // 서버 API 호출
        const result = await pressService.getPressDetail(id);
        setData(result);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("게시글을 찾을 수 없습니다.");
        navigate('/userPressRelList');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, navigate]);

  // 로딩 중일 때 표시할 화면
  if (loading) return <div className="py-20 text-center">로딩 중...</div>;



  // --- 핸들러 (Handlers) --- //
  // 첨부파일 다운로드 로직
 const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.setAttribute('download', file.realName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // 데이터가 없을 경우 예외 처리
  if (!data) {
    return (
      <div className="py-20 text-center font-sans">
        <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/userPressRelList')} className="mt-4 text-blue-600 underline">목록으로 돌아가기</button>
      </div>
    );
  }

  // 브레드크럼(경로 표시) 데이터
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userPressRelList", hasIcon: false },
    { label: "보도자료", path: "/userPressRelList", hasIcon: false },
  ];

  return (
    <div className="w-full px-5 md:px-0">
      {/* 페이지 상단 경로 안내 */}
      <PageBreadcrumb items={breadcrumbItems} />
      <main className="w-full">
        <h1 className="text-heading-xl text-graygray-90 pb-10">보도자료</h1>

        {/* --- 게시글 헤더 영역 (제목 및 정보) --- */}
        <div className="border-t border-gray-200">
          <div className="py-8 px-2 text-left">
            <h3 className="text-[20px] font-bold text-black mb-6">제목 : {data.title}</h3>
            <div className="flex items-center gap-x-6 text-[14px] text-[#222]">
  <div><span className="text-[#444]">등록인 :</span> 관리자</div>
  <div className="w-[1px] h-3 bg-gray-300"></div>
  <div><span className="text-[#444]">등록일 :</span> {data.createdAt?.split('T')[0]}</div>
</div>

            {/* 첨부파일이 있을 경우에만 렌더링 */}
            {/* --- 첨부파일 리스트 부분 --- */}
{data.fileList && data.fileList.length > 0 && (
  <div className="mt-6 flex items-start gap-2 text-[16px]">
    <span className="font-bold text-[#333] shrink-0"> [첨부파일] </span>
    <div className="flex flex-wrap items-center">
      {data.fileList.map((file, idx) => (
        <React.Fragment key={idx}>
          <button onClick={() => handleDownload(file)} className="text-blue-600 hover:underline">
            {file.realName}
          </button>
          {idx < data.fileList.length - 1 && <span className="text-gray-400 mx-1.5">,</span>}
        </React.Fragment>
      ))}
    </div>
  </div>
)}
          </div>
        </div>

        {/* --- 게시글 본문 영역 --- */}    
        <div className="border-t border-black"></div>
          <div className="py-12 px-2 min-h-[400px] text-left">
            {/* dangerouslySetInnerHTML를 사용하여 HTML을 렌더링합니다. */}
            <div 
              className="text-[16px] leading-[1.8] text-[#222] font-normal ql-editor"
              dangerouslySetInnerHTML={{ __html: data.body }}
            />
        </div>
        
        <div className="border-t border-gray-200"></div>
        
        {/* --- 하단 버튼 영역 --- */}
        <div className="flex justify-center md:justify-end pt-10 border-t border-graygray-20">
          <Button 
            variant="tertiary"
            onClick={() => navigate('/userPressRelList')}
            className="px-8" 
          >
            목록으로
          </Button>
        </div>
      </main>
    </div>
  );
};

export default UserPressRelDetail;