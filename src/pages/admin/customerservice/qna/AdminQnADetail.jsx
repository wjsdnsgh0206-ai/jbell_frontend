//src/pages/admin/customerservice/qna/AdminQnADetail.jsx

import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Trash2, Save, FileText, CornerDownRight, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// 유틸리티: 클래스 병합 (기존 파일과 동일)
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 샘플 데이터 (상세 조회를 위한 Mock Data)
// 실제로는 API 호출을 통해 ID에 해당하는 데이터를 가져와야 합니다.
const mockDetailData = {
  id: 1,
  no: 1024,
  type: '시스템 및 장애',
  title: '로그인이 갑자기 되지 않습니다.',
  author: '김철수',
  date: '2025-01-09 14:30',
  status: 'WAITING', // WAITING | ANSWERED
  content: `안녕하세요.\n오늘 오후 2시경부터 로그인을 시도했는데 계속해서 '서버 연결 실패' 메시지가 뜹니다.\n\n크롬과 엣지 브라우저 모두 동일한 현상입니다.\n확인 부탁드립니다.`,
  files: [
    { name: 'error_screenshot_01.jpg', size: '1.2MB' }
  ],
  // 답변 데이터 (초기에는 null일 수 있음)
    answer: null 
  /* answer: {
    content: '안녕하세요, 관리자입니다. 서버 점검으로 인한 일시적 오류였습니다.',
    author: '관리자',
    date: '2025-01-09 15:00'
  } */
 
};

const InquiryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(mockDetailData);
  
  // 답변 입력/수정 관련 State
  const [answerMode, setAnswerMode] = useState('VIEW'); // VIEW, EDIT, CREATE
  const [answerInput, setAnswerInput] = useState('');

  // 초기 로드 시 답변 상태 확인
  useEffect(() => {
    if (inquiry.answer) {
      setAnswerMode('VIEW');
      setAnswerInput(inquiry.answer.content);
    } else {
      setAnswerMode('CREATE');
      setAnswerInput('');
    }
  }, [inquiry]);

    //실제 구현 시 id를 사용하여 API를 호출하거나 데이터를 필터링해야 합니다.
    // useEffect(() => {
    //    fetchInquiryDetail(id).then(data => setInquiry(data));
    // }, [id]);


  // --- Logic: 답변 등록/수정 ---
  const handleSaveAnswer = () => {
    if (!answerInput.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    const newAnswer = {
      content: answerInput,
      author: '통합관리자', // 실제 로그인한 관리자 이름
      date: new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    };

    setInquiry((prev) => ({
      ...prev,
      status: 'ANSWERED', // 답변 등록 시 상태 변경
      answer: newAnswer
    }));
    setAnswerMode('VIEW');
    alert('답변이 등록되었습니다.');
  };

  // --- Logic: 답변 삭제 ---
  const handleDeleteAnswer = () => {
    if (confirm('등록된 답변을 삭제하시겠습니까?\n문의 상태가 [답변대기]로 변경됩니다.')) {
      setInquiry((prev) => ({
        ...prev,
        status: 'WAITING',
        answer: null
      }));
      setAnswerInput('');
      setAnswerMode('CREATE');
    }
  };

  // --- Logic: 목록으로 이동 ---
  const handleGoBack = () => {
    navigate('/admin/service/QnAList'); // 목록 페이지 경로로 이동
  };

  // --- Logic: 게시글 삭제 ---
  const handleDeleteInquiry = () => {
    if (confirm('이 문의 내역을 완전히 삭제하시겠습니까?')) {
      alert('삭제되었습니다. (목록으로 이동)');
      navigate('/admin/service/QnAList'); // 삭제 후 목록으로 이동
    }
  };

  return (
    <div className="w-full bg-white p-6 font-sans text-slate-800 min-h-screen">
      
      {/* 1. Breadcrumb & Title */}
      <div className="mb-6">
        <div className="flex items-center text-xs text-gray-500 mb-2 font-medium">
          <span>고객센터 관리</span>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span>1:1 문의 관리</span>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-gray-900 font-bold">상세 조회</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">1:1 문의 상세 정보</h2>
      </div>

      {/* 2. Inquiry Content Area (질문 영역) */}
      <div className="border-t-2 border-gray-800 mb-8">
        {/* Row 1: Title & Status */}
        <div className="flex border-b border-gray-200">
          <div className="w-32 bg-[#f8f9fa] px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">
            {/*[#f8f9fa] == RGB: (248, 249, 250)*/}
            제목
          </div>
          <div className="flex-1 px-4 py-3 text-sm font-medium text-gray-900 flex items-center justify-between">
            <span>
              <span className="text-gray-500 mr-2">[{inquiry.type}]</span>
              {inquiry.title}
            </span>
            <span className={cn(
              "px-2 py-0.5 text-xs font-bold rounded-sm border",
              inquiry.status === 'WAITING' 
                ? "bg-gray-100 text-gray-600 border-gray-200" 
                : "bg-blue-100 text-blue-700 border-blue-200"
            )}>
              {inquiry.status === 'WAITING' ? '답변대기' : '답변완료'}
            </span>
          </div>
        </div>

        {/* Row 2: Metadata */}
        <div className="flex border-b border-gray-200 flex-wrap sm:flex-nowrap">
          <div className="w-32 bg-[#f8f9fa] px-4 py-3 text-sm font-semibold text-gray-600 flex items-center border-b sm:border-b-0 border-gray-200">
            {/*[#f8f9fa] == RGB: (248, 249, 250)*/}
            작성자
          </div>
          <div className="flex-1 px-4 py-3 text-sm text-gray-700 border-b sm:border-b-0 border-r-0 sm:border-r border-gray-200">
            {inquiry.author}
          </div>
          <div className="w-32 bg-[#f8f9fa] px-4 py-3 text-sm font-semibold text-gray-600 flex items-center border-b sm:border-b-0 border-gray-200">
            {/*[#f8f9fa] == RGB: (248, 249, 250)*/}
            등록일시
          </div>
          <div className="flex-1 px-4 py-3 text-sm text-gray-700">
            {inquiry.date}
          </div>
        </div>

        {/* Row 3: Files */}
        <div className="flex border-b border-gray-200">
          <div className="w-32 bg-[#f8f9fa] px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">
            {/*[#f8f9fa] == RGB: (248, 249, 250)*/}
            첨부파일
          </div>
          <div className="flex-1 px-4 py-3 text-sm text-gray-700">
            {inquiry.files.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {inquiry.files.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4" />
                    <span className="underline decoration-gray-300 underline-offset-2">{file.name}</span>
                    <span className="text-xs text-gray-400">({file.size})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">첨부된 파일이 없습니다.</span>
            )}
          </div>
        </div>

        {/* Row 4: Content Body */}
        <div className="min-h-[200px] p-6 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border-b border-gray-200">
          {inquiry.content}
        </div>
      </div>

      {/* 3. Administrator Answer Area (답변 영역) */}
      <div className="bg-blue-50/50 rounded-sm border border-blue-100 p-6 mb-8 relative">
        <div className="flex items-center gap-2 mb-4">
          <CornerDownRight className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">관리자 답변</h3>
        </div>

        {/* Case A: 답변 작성/수정 모드 */}
        {(answerMode === 'CREATE' || answerMode === 'EDIT') && (
          <div className="bg-white border border-blue-200 rounded-sm p-4 shadow-sm">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-xs font-bold text-blue-600">답변 내용 작성</span>
              <span className="text-xs text-gray-400">작성 시 '답변완료' 상태로 자동 변경됩니다.</span>
            </div>
            <textarea
              className="w-full h-40 p-3 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 resize-y"
              placeholder="문의에 대한 답변을 입력해주세요."
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-3">
              {answerMode === 'EDIT' && (
                <button 
                  onClick={() => {
                    setAnswerMode('VIEW');
                    setAnswerInput(inquiry.answer.content);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-600 text-sm rounded-sm hover:bg-gray-50"
                >
                  취소
                </button>
              )}
              <button 
                onClick={handleSaveAnswer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-sm flex items-center gap-1 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                {answerMode === 'CREATE' ? '답변 등록' : '수정 완료'}
              </button>
            </div>
          </div>
        )}

        {/* Case B: 답변 완료 (조회 모드) */}
        {answerMode === 'VIEW' && inquiry.answer && (
          <div className="bg-white border border-gray-200 rounded-sm">
             {/* 답변 메타 정보 */}
             <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-gray-700">답변자: {inquiry.answer.author}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{inquiry.answer.date}</span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setAnswerMode('EDIT')}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-white rounded transition-colors"
                  >
                    <Edit className="h-3 w-3" /> 수정
                  </button>
                  <button 
                    onClick={handleDeleteAnswer}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-white rounded transition-colors"
                  >
                    <Trash2 className="h-3 w-3" /> 삭제
                  </button>
                </div>
             </div>
             {/* 답변 내용 */}
             <div className="p-5 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {inquiry.answer.content}
             </div>
          </div>
        )}
      </div>

      {/* 4. Action Buttons (Bottom) */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <button 
          onClick={handleGoBack}
          className="h-10 px-5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </button>

        <button 
          onClick={handleDeleteInquiry}
          className="h-10 px-5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 font-medium text-sm rounded-sm flex items-center gap-2 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          문의 삭제
        </button>
      </div>

    </div>
  );
};

export default InquiryDetailPage;