// src/pages/admin/customerservice/faq/AdminFAQDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, List, Eye, EyeOff, Clock, User, Calendar, CheckCircle, AlertCircle, Save, X } from 'lucide-react';
import { AdminFAQData, FAQ_CATEGORIES } from './AdminFAQData';
import { faqService } from '@/services/api';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const AdminFAQDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 초기 상태 설정
  const [data, setData] = useState({
      faqId: 0,
      faqCategory: '기타',
      faqTitle: '',
      faqContent: [], 
      faqWrite: '',
      faqViewCount: 0,
      faqVisibleYn: 'N', // 백엔드 DTO 타입이 String ("Y"/"N") 인지 Boolean 인지 확인 필요.
                        // 파일상 FaqList는 String "Y"/"N" 주석이 있고, 
                        // DTO에는 String faqVisibleYn으로 되어 있음.
  });
  const [isEditing, setIsEditing] = useState(false);

  // [API 호출] 상세 조회
  useEffect(() => {
    if (id) {
      // 서비스 함수 호출
      faqService.getFaqDetail(id)
        .then(res => {
          const item = res.data; // res.data가 실제 DTO 내용
          
          let parsedContent = [];
          if (item.faqContent) {
             if (typeof item.faqContent === 'string') {
                 try {
                   parsedContent = JSON.parse(item.faqContent);
                 } catch (e) {
                   parsedContent = [{ type: 'text', value: item.faqContent }];
                 }
             } else {
                 parsedContent = item.faqContent;
             }
          }
          setData({ ...item, faqContent: parsedContent || [] });
        })
        .catch(err => {
            console.error(err);
            alert("데이터 조회 실패");
            navigate('/admin/contents/FAQList');
        });
    }
  }, [id, navigate]);

  // [API 호출] 수정 저장
  const handleSave = async () => {
    // ... 유효성 검사 유지
    if (window.confirm('저장하시겠습니까?')) {
        try {
            const payload = {
                faqId: data.faqId,
                faqCategory: data.faqCategory,
                faqVisibleYn: data.faqVisibleYn,
                faqContent: data.faqContent
            };
            
            // [수정] 서비스 함수 호출
            await faqService.updateFaq(data.faqId, payload);
            
            alert('저장되었습니다.');
            setIsEditing(false);
        } catch (error) {
            console.error("수정 실패:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    }
  };

   // [API 호출] 삭제
  const handleDelete = async () => {
    if (window.confirm('삭제하시겠습니까?')) {
        try {
            // [수정] 서비스 함수 호출
            await faqService.deleteFaq({ faqId: [data.faqId] });
            
            alert('삭제되었습니다.');
            navigate('/admin/contents/FAQList');
        } catch (error) {
            alert("삭제 실패");
        }
    }
  };

  // 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 모드에서 JSON Content를 텍스트로 단순 변환해서 편집 (임시 처리)
  // 실제로는 Block Editor가 필요하지만, 여기서는 첫 번째 텍스트 블록만 수정하거나 
  // 전체를 JSON 문자열로 보여주는 방식 중 간단히 텍스트 입력만 받는 형태로 예외 처리
  const handleContentChange = (e) => {
    // 수정 시에는 모든 내용을 하나의 텍스트 블록으로 덮어씀 (간소화)
    const newContent = [{ type: 'text', value: e.target.value }];
    setData(prev => ({ ...prev, faqContent: newContent }));
  };

  // 편집 모드일 때 보여줄 텍스트 추출 함수
  const getEditableContentString = () => {
    if (Array.isArray(data.faqContent)) {
      return data.faqContent.map(block => {
        if (block.type === 'text' || block.type === 'note') return block.value;
        if (block.type === 'list') return block.items.join('\n');
        return '';
      }).join('\n\n');
    }
    return '';
  };

  const handleToggleStatus = () => {
    const newStatus = !data.faqVisibleYn;
    const action = newStatus ? '공개' : '비공개';
    if (window.confirm(`[${action}] 상태로 변경하시겠습니까?`)) {
      setData(prev => ({ ...prev, faqVisibleYn: newStatus }));
    }
  };

  const handleBack = () => {
    navigate('/admin/contents/FAQList');
  };

  // JSON Content 렌더러
  const renderContent = (contentData) => {
    if (!Array.isArray(contentData)) return <p>내용이 없습니다.</p>;

    return contentData.map((block, index) => {
      switch (block.type) {
        case 'text':
          return (
            <p key={index} className={cn("mb-4", block.isBold && "font-bold")}>
              {block.value}
            </p>
          );
        case 'list':
          const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className={cn("mb-4 ml-5 space-y-1", block.style === 'ordered' ? 'list-decimal' : 'list-disc')}>
              {block.items.map((item, idx) => <li key={idx}>{item}</li>)}
            </ListTag>
          );
        case 'table':
          return (
            <div key={index} className="overflow-x-auto mb-6 border border-gray-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b">
                  <tr>
                    {block.headers.map((h, i) => <th key={i} className="px-4 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b last:border-0">
                      {row.map((cell, cIdx) => <td key={cIdx} className="px-4 py-3">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case 'note':
          return (
            <p key={index} className="mb-4 text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
              {block.value}
            </p>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-gray-900">
      <main className="p-10">
        
        {/* 헤더 영역 */}
        <div className="mb-8">
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {isEditing ? 'FAQ 수정' : 'FAQ 상세 정보'}
                </h2>
                
                <span className={cn(
                    "px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-1.5 bg-white shadow-sm",
                    data.faqVisibleYn 
                        ? "text-blue-600 border-blue-100" 
                        : "text-gray-500 border-gray-200"
                )}>
                    {data.faqVisibleYn ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {data.faqVisibleYn ? '사용 중 (공개)' : '미사용 (비공개)'}
                </span>
            </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1">
                <div className={cn(
                    "bg-white border rounded-xl shadow-sm p-10 transition-all min-h-[600px]", 
                    isEditing ? "border-blue-300 ring-4 ring-blue-50/50" : "border-gray-200"
                )}>
                    
                    {/* 카테고리 */}
                    <div className="mb-4">
                        {isEditing ? (
                            <select
                                name="faqCategory"
                                value={data.faqCategory}
                                onChange={handleInputChange}
                                className="h-9 px-3 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none bg-white min-w-[140px]"
                            >
                                {FAQ_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        ) : (
                            <span className="inline-block px-3 py-1 text-xs font-bold text-slate-600 bg-slate-100 rounded border border-slate-200">
                                {data.faqCategory}
                            </span>
                        )}
                    </div>

                    {/* 질문 (Q) */}
                    <div className="flex items-start gap-3 mb-8 border-b border-gray-100 pb-8">
                        <span className="text-blue-600 font-extrabold text-2xl mt-[-2px] shrink-0">Q.</span>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="faqTitle"
                                    value={data.faqTitle}
                                    onChange={handleInputChange}
                                    className="w-full text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none pb-2 bg-transparent placeholder-gray-300"
                                    placeholder="질문 제목을 입력해주세요"
                                />
                            ) : (
                                <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                                    {data.faqTitle}
                                </h3>
                            )}
                        </div>
                    </div>

                    {/* 답변 (A) - JSON Renderer 사용 */}
                    <div className="flex items-start gap-3">
                        <span className="text-red-500 font-extrabold text-2xl mt-[-2px] shrink-0">A.</span>
                        <div className="flex-1 min-h-[300px]">
                            {isEditing ? (
                                <textarea
                                    value={getEditableContentString()}
                                    onChange={handleContentChange}
                                    className="w-full h-[400px] p-4 text-base border border-gray-300 rounded focus:border-blue-500 outline-none resize-none bg-gray-50 leading-relaxed"
                                    placeholder="내용을 입력해주세요. (수정 시 텍스트 블록으로 변환됩니다)"
                                />
                            ) : (
                                <div className="text-gray-700 leading-loose text-base">
                                    {renderContent(data.faqContent)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 그룹 */}
                <div className="mt-8 flex justify-between items-center">
                    <button 
                        onClick={handleBack} 
                        className="flex items-center gap-2 px-6 h-12 border border-gray-300 bg-white rounded-md hover:bg-gray-50 text-sm font-bold shadow-sm transition-all"
                    >
                        <List size={16}/> 목록으로
                    </button>

                    <div className="flex gap-3">
                        {!isEditing ? (
                            <>
                                <button 
                                    onClick={handleDelete} 
                                    className="flex items-center gap-2 px-6 h-12 border border-red-200 bg-white text-red-600 rounded-md hover:bg-red-50 text-sm font-bold shadow-sm transition-all"
                                >
                                    <Trash2 size={16}/> 삭제
                                </button>
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="flex items-center gap-2 px-8 h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-bold shadow-sm transition-all"
                                >
                                    <Edit2 size={16}/> 수정
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setIsEditing(false)} 
                                    className="flex items-center gap-2 px-6 h-12 border border-gray-300 bg-white text-gray-600 rounded-md hover:bg-gray-50 text-sm font-bold shadow-sm transition-all"
                                >
                                    <X size={16}/> 취소
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    className="flex items-center gap-2 px-8 h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-bold shadow-sm transition-all"
                                >
                                    <Save size={16}/> 저장
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-full xl:w-80 shrink-0 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h4 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                        관리 정보
                    </h4>
                    <ul className="space-y-5 text-sm text-gray-600">
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><User size={15}/> 작성자</span> 
                            <span className="font-medium text-gray-900">{data.faqWrite}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><Calendar size={15}/> 등록일</span> 
                            <span className="font-medium text-gray-900">{String(data.faqCreatedAt).substring(0,10)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><Clock size={15}/> 수정일</span> 
                            <span className="font-medium text-gray-900">{String(data.faqUpdatedAt).substring(0,10)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><Eye size={15}/> 조회수</span> 
                            <span className="font-medium text-gray-900">{data.faqViewCount.toLocaleString()}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-graygray-5 border border-slate-200 p-6 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h4>
                    <button 
                        onClick={handleToggleStatus} 
                        className="w-full h-12 bg-white border border-gray-300 rounded-md text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 flex justify-center items-center gap-2 shadow-sm transition-all"
                    >
                        {data.faqVisibleYn ? <EyeOff size={16}/> : <Eye size={16}/>}
                        {data.faqVisibleYn ? '비공개로 전환' : '공개로 전환'}
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminFAQDetail;