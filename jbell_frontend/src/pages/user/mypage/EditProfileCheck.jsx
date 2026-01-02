import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

const EditProfileCheck3 = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    // 여기에 비밀번호 검증 API 로직 추가
    console.log('비밀번호 확인 시도:', password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-start py-20 px-5 font-sans text-slate-900">
      <div className="max-w-[540px] w-full animate-in fade-in slide-in-from-top-4 duration-700">
        
        <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-left">
          내 정보 수정
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm transition-all hover:shadow-md">
            {/* Card Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <ShieldCheck size={20} />
                <h2 className="text-xl font-bold text-slate-900">회원 정보 수정</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed break-keep">
                정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 입력해 주세요.
              </p>
            </div>

            {/* Input Group */}
            <div className="space-y-3 text-left">
              <label className="text-[13px] font-bold text-slate-600 ml-1 flex items-center gap-1.5">
                <Lock size={14} /> 비밀번호
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  className="w-full h-[56px] px-4 pr-12 border border-slate-300 rounded-xl text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-[12px] text-slate-400 ml-1 mt-3">
                비밀번호는 타인에게 노출되지 않도록 주의해 주세요.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 h-[56px] sm:w-[140px] bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-[15px] hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <ArrowLeft size={18} /> 취소
            </button>
            <button
              type="submit"
              disabled={!password}
              className={`h-[56px] sm:w-[140px] rounded-xl font-bold text-[15px] transition-all shadow-lg
                ${password 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-100' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
            >
              확인하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileCheck;