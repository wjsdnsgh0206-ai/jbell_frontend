// src/pages/admin/customerservice/qna/AdminQnADetail.jsx

import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Trash2, CheckCircle, FileText, CornerDownRight, Edit } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { qnaService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

// 유틸리티: 클래스 병합
const cn = (...classes) => classes.filter(Boolean).join(' ');

const AdminQnADetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 상태 관리
  const [inquiry, setInquiry] = useState(null); // 문의 상세 데이터 (DTO 구조)
  const [answerMode, setAnswerMode] = useState('VIEW'); // 상태: VIEW(조회), CREATE(작성), EDIT(수정)
  const [answerInput, setAnswerInput] = useState('');   // 답변 입력창 데이터
  const [loading, setLoading] = useState(true);         // 로딩 상태

  // 0. 관리자 권한 체크 (진입 시 실행)
  useEffect(() => {
    // 유저 정보 로딩이 끝났는데, 유저가 없거나 등급이 ADMIN이 아니면 튕겨냄
    if (user) {
        // user_grade 필드명은 DB 컬럼에 따라 userGrade, grade, user_grade 중 하나일 것임 (AuthContext 확인 필요)
        // 여기서는 userGrade로 가정 (일반적 관례)
        if (user.userGrade !== 'ADMIN') { 
            alert('관리자 권한이 없습니다.');
            navigate('/'); // 메인 페이지로 이동
        }
    }
  }, [user, navigate]);

  // 1. 상세 데이터 로드
  const fetchDetail = async () => {
    try {
      setLoading(true);
      // GET /api/admin/qnadetail?qnaId={id}
      const data = await qnaService.getQnaDetail(id);
      setInquiry(data);
      
      // DTO에 qnaAnswerId가 있으면 답변이 존재하는 것으로 판단
      if (data.qnaAnswerId) {
        setAnswerMode('VIEW');
        setAnswerInput(data.answerContent); // 수정 시 기존 내용 표시를 위해 세팅
      } else {
        setAnswerMode('CREATE');
        setAnswerInput('');
      }
    } catch (error) {
      console.error("상세 조회 실패:", error);
      alert("데이터를 불러올 수 없습니다.");
      navigate('/admin/contents/QnAList');
    } finally {
      setLoading(false);
    }
  };

  // 초기 진압 시 데이터 로드
  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  // 2. 답변 등록 및 수정 핸들러
  const handleSaveAnswer = async () => {
    if (!answerInput.trim()) {
      return alert('답변 내용을 입력해주세요.');
    }

    if (!user || !user.userId) {
      return alert('로그인 정보가 확인되지 않습니다. 다시 로그인해주세요.');
    }

    // 프론트에서도 한 번 더 체크
    if (user.userGrade !== 'ADMIN') {
        return alert('관리자만 답변을 작성할 수 있습니다.');
    }

    try {
      if (answerMode === 'CREATE') {
        // 등록
        await qnaService.createAnswer({
          qnaId: inquiry.qnaId,
          content: answerInput,
          userId: user.userId
        });
        alert('답변이 등록되었습니다.');
      } else if (answerMode === 'EDIT') {
        // PATCH /api/qna/answers/{qnaAnswerId}
        await qnaService.updateAnswer(inquiry.qnaAnswerId, answerInput);
        alert('답변이 수정되었습니다.');
      }
      
      // 성공 후 데이터 새로고침
      await fetchDetail();

    } catch (error) {
      console.error("답변 저장 실패:", error);
      alert("처리에 실패했습니다. (로그를 확인해주세요)");
    }
  };

  // 3. 답변 삭제 핸들러
  const handleDeleteAnswer = async () => {
    if (!window.confirm('답변을 삭제하시겠습니까?\n문의 상태가 [답변대기]로 변경됩니다.')) {
      return;
    }

    try {
      // [삭제] DELETE /api/qna/answers/{qnaAnswerId}
      await qnaService.deleteAnswer(inquiry.qnaAnswerId);
      alert('답변이 삭제되었습니다.');
      
      // 삭제 후 데이터 갱신 (입력 모드로 전환됨)
      await fetchDetail();
    } catch (error) {
      console.error("답변 삭제 실패:", error);
      alert("삭제 처리에 실패했습니다.");
    }
  };

  // 4. 문의글(질문) 삭제 핸들러
  const handleDeleteInquiry = async () => {
    if (window.confirm('이 문의 내역을 완전히 삭제하시겠습니까? (복구 불가)')) {
      try {
        // [삭제] DELETE /api/admin/qnadelete (List<Long>)
        await qnaService.deleteQna([inquiry.qnaId]);
        alert('문의글이 삭제되었습니다.');
        navigate('/admin/contents/QnAList');
      } catch (error) {
        console.error("문의 삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // --- Logic: 목록으로 이동 ---
  const handleGoBack = () => {
    navigate('/admin/contents/QnAList');
  };

 // 로딩 중 화면
  if (loading || !inquiry) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <div className="text-gray-500 font-medium">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      <main className="p-10">
        
        {/* 헤더 영역 */}
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">1:1 문의 상세 정보</h2>
        </div>

        {/* 컨텐츠 카드 */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            
            {/* A. 질문(문의) 정보 영역 */}
            <div className="border-t-2 border-gray-800 mb-8">
                {/* 제목 & 상태 */}
                <div className="flex border-b border-gray-200">
                    <div className="w-32 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">
                        제목
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm font-medium text-gray-900 flex items-center justify-between">
                        <span>
                            <span className="text-gray-500 mr-2">[{inquiry.categoryName}]</span>
                            {inquiry.title}
                        </span>
                        {/* 상태 뱃지 */}
                        <span className={cn(
                            "px-2 py-0.5 text-xs font-bold rounded-sm border",
                            inquiry.status === '답변대기' 
                                ? "bg-gray-100 text-gray-600 border-gray-200" 
                                : inquiry.status === '답변 처리중'
                                ? "bg-orange-50 text-orange-600 border-orange-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                        )}>
                            {inquiry.status}
                        </span>
                    </div>
                </div>

                {/* 작성자 & 등록일시 */}
                <div className="flex border-b border-gray-200 flex-wrap sm:flex-nowrap">
                    <div className="w-32 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center border-b sm:border-b-0 border-gray-200">
                        작성자
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-700 border-b sm:border-b-0 border-r-0 sm:border-r border-gray-200">
                        {inquiry.userName} <span className="text-gray-400 text-xs ml-1">({inquiry.userId})</span>
                    </div>
                    <div className="w-32 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center border-b sm:border-b-0 border-gray-200">
                        등록일시
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-700">
                        {inquiry.createdAt ? inquiry.createdAt.replace('T', ' ') : '-'}
                    </div>
                </div>

                {/* 본문 내용 */}
                <div className="min-h-[200px] p-6 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border-b border-gray-200">
                    {inquiry.content}
                </div>
            </div>

            {/* B. 관리자 답변 영역 */}
            <div className="bg-blue-50/50 rounded-sm border border-blue-100 p-6 mb-8 relative">
                <div className="flex items-center gap-2 mb-4">
                    <CornerDownRight className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">관리자 답변</h3>
                </div>

                {/* Case 1: 답변 작성(CREATE) 또는 수정(EDIT) 모드 */}
                {(answerMode === 'CREATE' || answerMode === 'EDIT') && (
                <div className="bg-white border border-blue-200 rounded-sm p-4 shadow-sm">
                    <div className="mb-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-600">
                            {answerMode === 'CREATE' ? '새 답변 작성' : '답변 내용 수정'}
                        </span>
                        {answerMode === 'CREATE' && (
                            <span className="text-xs text-gray-400">작성 시 '답변완료' 상태로 자동 변경됩니다.</span>
                        )}
                    </div>
                    <textarea
                        className="w-full h-40 p-3 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 resize-y"
                        placeholder="문의에 대한 답변을 입력해주세요."
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                        {/* 수정 취소 버튼 */}
                        {answerMode === 'EDIT' && (
                            <button 
                                onClick={() => {
                                    setAnswerMode('VIEW');
                                    setAnswerInput(inquiry.answerContent); // 원래 내용으로 복구
                                }}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-600 text-sm rounded-sm hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                        )}
                        {/* 저장 버튼 */}
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

                {/* Case 2: 답변 완료 조회(VIEW) 모드 - 답변이 있을 때만 표시 */}
                {answerMode === 'VIEW' && inquiry.qnaAnswerId && (
                <div className="bg-white border border-gray-200 rounded-sm">
                    {/* 답변 메타 정보 */}
                    <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center gap-3 text-xs">
                            {/* ▼ [수정됨] 답변자 이름 출력 (이름이 없으면 '관리자' 표시) */}
                            <span className="font-bold text-gray-700">
                                {inquiry.answerUserName || '관리자'}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">
                                {inquiry.answerCreatedAt ? inquiry.answerCreatedAt.replace('T', ' ') : '-'}
                            </span>
                        </div>
                        {/* 수정/삭제 버튼 그룹 */}
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
                    {/* 답변 본문 */}
                    <div className="p-5 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {inquiry.answerContent}
                    </div>
                </div>
                )}
            </div>

            {/* C. 하단 액션 버튼 */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <button 
                    onClick={() => navigate('/admin/contents/QnAList')}
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

        </section>
      </main>
    </div>
  );
};

export default AdminQnADetail;