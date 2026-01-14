//src/pages/admin/customerservice/faq/AdminFAQAdd.jsx

import React, { useState } from 'react';
import { 
  Save, 
  X, 
  RotateCcw, 
  ChevronRight, 
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';

/**
 * FAQ 신규 등록 전용 컴포넌트
 */
const FaqRegisterPage = ({ onCancel, onSave }) => {
  // 폼 상태 관리 (초기값 설정)
  const [formData, setFormData] = useState({
    category: '회원/계정',
    title: '',
    content: '',
    status: true, // true: 사용(공개)
    order: 1,     // 기본 노출 순서
  });

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 라디오 버튼 핸들러 (상태값)
  const handleStatusChange = (val) => {
    setFormData((prev) => ({ ...prev, status: val }));
  };

  // 저장 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('제목을 입력해주세요.');
    if (!formData.content.trim()) return alert('내용을 입력해주세요.');

    // 저장 로직 호출
    if (onSave) onSave(formData);
    
    alert('FAQ가 정상적으로 등록되었습니다.');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] font-sans antialiased text-gray-900">
      <main className="p-10">
        
        {/* 1. Header Area (Breadcrumb & Title) */}
        <div className="mb-8">
            {/* 타이틀 (리스트 페이지와 동일한 스타일) */}
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                FAQ 신규 등록
            </h2>
        </div>

        {/* 2. Content Area (White Card) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit}>
                <div className="border-t-2 border-gray-800">
                <table className="w-full text-sm text-left border-b border-gray-300">
                    <tbody>
                    {/* 카테고리 & 노출순서 */}
                    <tr>
                        <th className="w-[140px] px-4 py-3 bg-[#f8f9fa] border-b border-gray-300 font-semibold text-gray-700">
                        분류 <span className="text-red-500">*</span>
                        </th>
                        <td className="px-4 py-3 border-b border-gray-300">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="h-9 border border-gray-300 rounded-sm px-3 min-w-[200px] focus:border-blue-500 focus:outline-none"
                        >
                            <option value="회원/계정">회원/계정</option>
                            <option value="결제/환불">결제/환불</option>
                            <option value="이용문의">이용문의</option>
                            <option value="시스템">시스템</option>
                            <option value="기타">기타</option>
                        </select>
                        </td>
                        
                        {/* 2단 레이아웃: 노출 순서 */}
                        <th className="w-[140px] px-4 py-3 bg-[#f8f9fa] border-b border-gray-300 font-semibold text-gray-700 border-l border-gray-200">
                        노출 순서
                        </th>
                        <td className="px-4 py-3 border-b border-gray-300">
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="h-9 w-[100px] border border-gray-300 rounded-sm px-3 focus:border-blue-500 focus:outline-none text-right"
                            min="1"
                        />
                        <span className="ml-2 text-xs text-gray-400">* 숫자가 낮을수록 상단에 노출됩니다.</span>
                        </td>
                    </tr>

                    {/* 제목 */}
                    <tr>
                        <th className="px-4 py-3 bg-[#f8f9fa] border-b border-gray-300 font-semibold text-gray-700">
                        제목 <span className="text-red-500">*</span>
                        </th>
                        <td colSpan="3" className="px-4 py-3 border-b border-gray-300">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="질문 제목을 입력해주세요."
                            className="h-9 w-full border border-gray-300 rounded-sm px-3 focus:border-blue-500 focus:outline-none"
                        />
                        </td>
                    </tr>

                    {/* 사용 여부 (Radio Style) */}
                    <tr>
                        <th className="px-4 py-3 bg-[#f8f9fa] border-b border-gray-300 font-semibold text-gray-700">
                        사용 여부 <span className="text-red-500">*</span>
                        </th>
                        <td colSpan="3" className="px-4 py-3 border-b border-gray-300">
                        <div className="flex items-center gap-8">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="radio"
                                name="status"
                                checked={formData.status === true}
                                onChange={() => handleStatusChange(true)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">사용(공개)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="radio"
                                name="status"
                                checked={formData.status === false}
                                onChange={() => handleStatusChange(false)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">미사용(비공개)</span>
                            </label>
                        </div>
                        </td>
                    </tr>

                    {/* 본문 (Editor Mockup) */}
                    <tr>
                        <th className="px-4 py-3 bg-[#f8f9fa] border-b border-gray-300 font-semibold text-gray-700 align-top pt-4">
                        내용 <span className="text-red-500">*</span>
                        </th>
                        <td colSpan="3" className="px-4 py-3 border-b border-gray-300">
                        {/* Editor UI Frame */}
                        <div className="border border-gray-300 rounded-sm overflow-hidden">
                            {/* Toolbar */}
                            <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex gap-1">
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4"/></button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4"/></button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Underline className="w-4 h-4"/></button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4"/></button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><LinkIcon className="w-4 h-4"/></button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><ImageIcon className="w-4 h-4"/></button>
                            </div>
                            {/* Text Area */}
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full h-64 p-4 text-sm focus:outline-none resize-y placeholder-gray-400"
                                placeholder="답변 내용을 입력해주세요."
                            />
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
                
                {/* 3. Action Buttons */}
                <div className="flex justify-center gap-3 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-12 px-8 border border-gray-300 bg-white text-gray-700 text-sm font-bold rounded-md hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
                    >
                        <X className="w-4 h-4" /> 취소
                    </button>
                    
                    <button
                        type="submit"
                        className="h-12 px-10 bg-[#1e3a8a] text-white text-sm font-bold rounded-md hover:bg-[#1e293b] flex items-center gap-2 shadow-sm transition-all"
                    >
                        <Save className="w-4 h-4" /> 등록
                    </button>
                </div>
            </form>
        </section>
      </main>
    </div>
  );
};

export default FaqRegisterPage;