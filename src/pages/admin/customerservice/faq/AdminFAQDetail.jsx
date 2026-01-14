// src/pages/admin/customerservice/faq/AdminFAQDetail.jsx

import React, { useState, useEffect } from 'react';
import { ChevronRight, Edit2, Trash2, List, Eye, EyeOff, Clock, User, Calendar,CheckCircle, AlertCircle, Save, X } from 'lucide-react';

// 유틸리티: 클래스 병합
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 샘플 데이터: FAQ 상세
const MOCK_HTML_CONTENT = `
  <p>이 내용은 상세 페이지 예시 본문입니다.</p>
  <p>실제 환경에서는 ID를 기반으로 서버에서 내용을 불러옵니다.</p>
  <br/>
  <p><strong>상세 설명:</strong></p>
  <p>고객센터 문의사항에 대한 답변 내용이 이곳에 표시됩니다.</p>
`;

const FaqDetailPage = ({ id, initialData, onBack, onUpdate, onDelete }) => {
  
  // 1. 데이터 초기화 함수
  const normalizeData = (item) => {
    if (!item) return {
      id: 0,
      category: '기타',
      title: '데이터를 불러올 수 없습니다.',
      content: '',
      author: '-',
      date: '-', 
      views: 0,
      status: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      ...item,
      content: item.content || MOCK_HTML_CONTENT, 
      createdAt: item.createdAt || (item.date ? `${item.date} 09:00` : new Date().toISOString()),
      updatedAt: item.updatedAt || (item.date ? `${item.date} 18:00` : new Date().toISOString()),
    };
  };

  const [data, setData] = useState(() => normalizeData(initialData));
  
  // 편집 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setData(normalizeData(initialData));
    setIsEditing(false); // ID가 바뀌면 편집 모드 해제
  }, [initialData, id]);

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 상태 토글 핸들러 (공개/비공개)
  const handleToggleStatus = () => {
    const newStatus = !data.status;
    const action = newStatus ? '공개(사용)' : '비공개(미사용)';
    // 편집 중일 때는 confirm 없이 즉시 토글 반영 (저장 시 일괄 처리 가능하도록 하거나, 여기선 즉시 반영)
    if (window.confirm(`이 게시물을 [${action}] 상태로 변경하시겠습니까?`)) {
      const updatedData = { ...data, status: newStatus };
      setData(updatedData);
      if (onUpdate) onUpdate(updatedData); // 리스트 즉시 동기화
    }
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.')) {
      if (onDelete) {
        onDelete(data.id);
      } else {
        alert('삭제되었습니다.');
        onBack();
      }
    }
  };

  // 수정 저장 핸들러
  const handleSave = () => {
    if (!data.title.trim()) return alert('제목을 입력해주세요.');
    if (!data.content.trim()) return alert('내용을 입력해주세요.');

    if (window.confirm('수정된 내용을 저장하시겠습니까?')) {
      // 현재 시간을 수정일로 갱신
      const now = new Date();
      // YYYY-MM-DD HH:mm 포맷
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 16);

      const updatedData = {
        ...data,
        updatedAt: formattedDate
      };

      setData(updatedData);       // 로컬 상태 업데이트
      setIsEditing(false);        // 편집 모드 종료
      
      if (onUpdate) {
        onUpdate(updatedData);    // [핵심] 부모 컴포넌트(List)에 데이터 전달
      }
      
      alert('저장되었습니다.');
    }
  };

  // 수정 취소 핸들러
  const handleCancelEdit = () => {
    if (window.confirm('작성 중인 내용이 취소됩니다. 계속하시겠습니까?')) {
      setData(normalizeData(initialData)); // 원래 데이터로 복구
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 font-sans text-slate-800">
      
      {/* 1. Breadcrumb & Title */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center text-xs text-gray-500 mb-2 font-medium">
          <span>고객지원 관리</span>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span>FAQ 관리</span>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-gray-900 font-bold">FAQ 상세</span>
        </div>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? 'FAQ 수정' : 'FAQ 상세 정보'}
            </h2>
            <span className={cn(
                "px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-1",
                data.status 
                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                    : "bg-gray-100 text-gray-600 border-gray-200"
            )}>
                {data.status ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {data.status ? '사용 중 (공개)' : '미사용 (비공개)'}
            </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. Main Content */}
        <div className="flex-1">
            <div className={cn("bg-white border rounded-sm shadow-sm", isEditing ? "border-blue-300 ring-2 ring-blue-50" : "border-gray-300")}>
                {/* 헤더: 질문(Q) */}
                <div className="bg-slate-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex flex-col gap-3 mb-2">
                        {/* 카테고리 수정/보기 */}
                        {isEditing ? (
                          <select
                            name="category"
                            value={data.category}
                            onChange={handleInputChange}
                            className="w-40 h-8 text-sm border border-gray-300 rounded px-2 focus:outline-none focus:border-blue-500"
                          >
                            <option value="회원/계정">회원/계정</option>
                            <option value="결제/환불">결제/환불</option>
                            <option value="이용문의">이용문의</option>
                            <option value="시스템">시스템</option>
                            <option value="기타">기타</option>
                          </select>
                        ) : (
                          <div className="flex">
                             <span className="inline-block px-2 py-0.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-sm">
                                {data.category}
                            </span>
                          </div>
                        )}
                    </div>
                    
                    {/* 제목 수정/보기 */}
                    <div className="flex items-start gap-2">
                        <span className="text-blue-600 shrink-0 font-bold text-xl mt-1">Q.</span>
                        {isEditing ? (
                          <input
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={handleInputChange}
                            className="w-full text-lg font-bold text-gray-900 border-b border-gray-400 bg-transparent px-1 py-1 focus:outline-none focus:border-blue-600"
                            placeholder="질문 제목을 입력하세요"
                          />
                        ) : (
                          <h3 className="text-xl font-bold text-gray-900 leading-normal">
                             {data.title}
                          </h3>
                        )}
                    </div>
                </div>

                {/* 본문: 답변(A) 수정/보기 */}
                <div className="p-8 min-h-[300px]">
                    <div className="flex items-start gap-2 h-full">
                        <span className="text-red-500 font-bold text-xl shrink-0 mt-[-2px]">A.</span>
                        {isEditing ? (
                          <textarea
                            name="content"
                            value={data.content}
                            onChange={handleInputChange}
                            className="w-full h-[400px] p-3 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none font-mono leading-relaxed"
                            placeholder="HTML 내용을 입력하세요 (예: <p>내용</p>)"
                          />
                        ) : (
                          <div 
                              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: data.content }}
                          />
                        )}
                    </div>
                </div>
            </div>
            
            <p className="mt-2 text-xs text-gray-400 text-right">
                {isEditing 
                  ? "* HTML 태그를 포함하여 내용을 직접 수정할 수 있습니다." 
                  : "* 위 화면은 고객센터 실제 출력 화면과 유사하게 미리보기 제공됩니다."}
            </p>
        </div>

        {/* 3. Sidebar (Admin Metadata) */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
            {/* 기본 정보 카드 */}
            <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    관리 정보
                </h4>
                <ul className="space-y-4 text-sm">
                    <li className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2">
                            <User className="w-4 h-4" /> 작성자
                        </span>
                        <span className="font-medium text-gray-900">{data.author}</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> 등록일
                        </span>
                        <span className="font-medium text-gray-900">
                          {(data.createdAt || '').split(' ')[0]}
                        </span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> 최종 수정
                        </span>
                        <span className="font-medium text-gray-900">{data.updatedAt}</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> 조회수
                        </span>
                        <span className="font-medium text-gray-900">{data.views.toLocaleString()}</span>
                    </li>
                </ul>
            </div>

            {/* 빠른 액션 패널 */}
            <div className="bg-slate-50 border border-slate-200 rounded-sm p-5">
                 <h4 className="text-sm font-bold text-gray-900 mb-3">빠른 액션</h4>
                 <div className="space-y-2">
                    <button 
                        onClick={handleToggleStatus}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 h-10 text-sm font-medium rounded-sm border transition-colors",
                            data.status 
                                ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                        )}
                    >
                        {data.status ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {data.status ? '비공개로 전환' : '공개로 전환'}
                    </button>
                 </div>
            </div>
        </div>
      </div>

      {/* 4. Bottom Action Bar */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
        {/* 좌측: 목록으로 */}
       <button 
            onClick={onBack}
            className="h-10 px-6 border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 rounded-sm flex items-center gap-2 transition-colors"
        >
            <List className="w-4 h-4" /> 목록으로
        </button>

        {/* 우측: 수정/삭제/저장 */}
        <div className="flex items-center gap-3">
            {/* 편집 모드가 아닐 때 삭제 버튼 노출 */}
            {!isEditing && (
              <button 
                  onClick={handleDelete}
                  className="h-10 px-6 border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 rounded-sm flex items-center gap-2 transition-colors"
              >
                  <Trash2 className="w-4 h-4" /> 삭제
              </button>
            )}

            {/* 편집 모드에 따라 버튼 변경 */}
            {isEditing ? (
              <>
                <button 
                    onClick={handleCancelEdit} 
                    className="h-10 px-6 border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 rounded-sm flex items-center gap-2 transition-colors"
                >
                    <X className="w-4 h-4" /> 취소
                </button>
                <button 
                    onClick={handleSave} 
                    className="h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-sm flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" /> 저장
                </button>
              </>
            ) : (
              <button 
                  onClick={() => setIsEditing(true)} 
                  className="h-10 px-8 bg-slate-800 hover:bg-slate-800 text-white text-sm font-medium rounded-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                  <Edit2 className="w-4 h-4" /> 수정
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default FaqDetailPage;