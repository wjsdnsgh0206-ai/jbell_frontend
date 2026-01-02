import React, { useState } from 'react';
import { Check, Copy, Key, Home, ChevronRight } from 'lucide-react';

const FindIdShow = () => {
  const [copied, setCopied] = useState(false);
  const foundId = "user_example_id"; // 실제 데이터는 props나 state로 전달받음

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(foundId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 아이콘 복구
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-left">
          아이디 찾기
        </h1>

        {/* Result Card */}
        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          <div className="text-left">
            <label className="text-sm font-medium text-gray-500 mb-3 block">찾으시는 아이디</label>
            <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-5 group transition-colors hover:bg-slate-200/70">
              <span className="text-xl font-semibold text-slate-700 flex-1 break-all">
                {foundId}
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  copied 
                  ? 'bg-green-500 text-white scale-105' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                {copied ? (
                  <><Check size={16} /> 복사됨</>
                ) : (
                  <><Copy size={16} /> 복사</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mb-12">
          <button
            onClick={() => window.location.href = '/login'}
            className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100"
          >
            로그인 화면으로 <Home size={20} />
          </button>
        </div>

        {/* Password Suggestion */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-6 border-t border-gray-100">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            <Key size={18} className="text-blue-500" />
            <span>비밀번호를 찾으러 가시겠습니까?</span>
          </div>
          <button 
            onClick={() => window.location.href = '/find-pw'}
            className="group flex items-center text-gray-500 hover:text-blue-600 transition-colors text-base font-medium"
          >
            비밀번호 찾기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindIdShow;