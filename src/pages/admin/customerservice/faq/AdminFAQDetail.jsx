// src/pages/admin/customerservice/faq/AdminFAQDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Edit2, Trash2, List, Eye, EyeOff, Clock, 
  User, Calendar, CheckCircle, AlertCircle, Save, X, Home 
} from 'lucide-react';
import { AdminFAQData, FAQ_CATEGORIES } from './AdminFAQData';

// 유틸리티: 클래스 병합
const cn = (...classes) => classes.filter(Boolean).join(' ');

const AdminFAQDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. 데이터 초기화 함수
  const normalizeData = (item) => {
    if (!item) return {
      id: 0,
      category: '기타',
      title: '',
      content: '',
      author: '관리자',
      date: new Date().toISOString().substring(0, 10), 
      views: 0,
      status: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    };
  };

  const [data, setData] = useState(normalizeData(null));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
        const found = AdminFAQData.find(item => item.id === parseInt(id, 10));
        setData(normalizeData(found));
    }
  }, [id]);

  // 핸들러들
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = () => {
    const newStatus = !data.status;
    const action = newStatus ? '공개' : '비공개';
    if (window.confirm(`[${action}] 상태로 변경하시겠습니까?`)) {
      setData(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('삭제되었습니다.');
      navigate('/admin/customer/FAQList');
    }
  };

  const handleSave = () => {
    if (!data.title.trim()) return alert('제목을 입력해주세요.');
    if (window.confirm('저장하시겠습니까?')) {
      const now = new Date().toISOString();
      const updatedData = { ...data, updatedAt: now };
      setData(updatedData);
      setIsEditing(false);
      alert('저장되었습니다.');
    }
  };

  const handleBack = () => {
    navigate('/admin/customer/FAQList');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] font-sans antialiased text-gray-900">
      <main className="p-10">
        
        {/* ==================================================================================
            [헤더 영역] 타이틀 & 상태 뱃지 (나란히 배치)
           ================================================================================== */}
        <div className="mb-8">
            {/* 타이틀과 상태 뱃지 */}
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {isEditing ? 'FAQ 수정' : 'FAQ 상세 정보'}
                </h2>
                
                <span className={cn(
                    "px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-1.5 bg-white shadow-sm",
                    data.status 
                        ? "text-blue-600 border-blue-100" 
                        : "text-gray-500 border-gray-200"
                )}>
                    {data.status ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {data.status ? '사용 중 (공개)' : '미사용 (비공개)'}
                </span>
            </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
            {/* ==================================================================================
                [메인 콘텐츠] 카드 스타일 (하나의 흰 바탕)
               ================================================================================== */}
            <div className="flex-1">
                <div className={cn(
                    "bg-white border rounded-xl shadow-sm p-10 transition-all min-h-[600px]", 
                    isEditing ? "border-blue-300 ring-4 ring-blue-50/50" : "border-gray-200"
                )}>
                    
                    {/* 1. 카테고리 (좌측 상단 뱃지 형태) */}
                    <div className="mb-4">
                        {isEditing ? (
                            <select
                                name="category"
                                value={data.category}
                                onChange={handleInputChange}
                                className="h-9 px-3 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none bg-white min-w-[140px]"
                            >
                                {FAQ_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        ) : (
                            <span className="inline-block px-3 py-1 text-xs font-bold text-slate-600 bg-slate-100 rounded border border-slate-200">
                                {data.category}
                            </span>
                        )}
                    </div>

                    {/* 2. 질문 (Q. 제목) */}
                    <div className="flex items-start gap-3 mb-8 border-b border-gray-100 pb-8">
                        <span className="text-blue-600 font-extrabold text-2xl mt-[-2px] shrink-0">Q.</span>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    onChange={handleInputChange}
                                    className="w-full text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none pb-2 bg-transparent placeholder-gray-300"
                                    placeholder="질문 제목을 입력해주세요"
                                />
                            ) : (
                                <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                                    {data.title}
                                </h3>
                            )}
                        </div>
                    </div>

                    {/* 3. 답변 (A. 내용) */}
                    <div className="flex items-start gap-3">
                        <span className="text-red-500 font-extrabold text-2xl mt-[-2px] shrink-0">A.</span>
                        <div className="flex-1 min-h-[300px]">
                            {isEditing ? (
                                <textarea
                                    name="content"
                                    value={data.content}
                                    onChange={handleInputChange}
                                    className="w-full h-[400px] p-4 text-base border border-gray-300 rounded focus:border-blue-500 outline-none resize-none bg-gray-50 leading-relaxed"
                                    placeholder="답변 내용을 입력해주세요."
                                />
                            ) : (
                                <div 
                                    className="prose prose-slate max-w-none text-gray-700 leading-loose text-base" 
                                    dangerouslySetInnerHTML={{ __html: data.content }} 
                                />
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
                                    className="flex items-center gap-2 px-8 h-12 bg-[#1e293b] text-white rounded-md hover:bg-slate-800 text-sm font-bold shadow-sm transition-all"
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

            {/* Sidebar Info (우측: 메타데이터 & 빠른 액션) */}
            <div className="w-full xl:w-80 shrink-0 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h4 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                        관리 정보
                    </h4>
                    <ul className="space-y-5 text-sm text-gray-600">
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><User size={15}/> 작성자</span> 
                            <span className="font-medium text-gray-900">{data.author}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><Calendar size={15}/> 등록일</span> 
                            <span className="font-medium text-gray-900">{String(data.createdAt).substring(0,10)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><Clock size={15}/> 수정일</span> 
                            <span className="font-medium text-gray-900">{String(data.updatedAt).substring(0,10)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-500"><Eye size={15}/> 조회수</span> 
                            <span className="font-medium text-gray-900">{data.views.toLocaleString()}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-[#f8fafc] border border-slate-200 p-6 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h4>
                    <button 
                        onClick={handleToggleStatus} 
                        className="w-full h-12 bg-white border border-gray-300 rounded-md text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 flex justify-center items-center gap-2 shadow-sm transition-all"
                    >
                        {data.status ? <EyeOff size={16}/> : <Eye size={16}/>}
                        {data.status ? '비공개로 전환' : '공개로 전환'}
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminFAQDetail;