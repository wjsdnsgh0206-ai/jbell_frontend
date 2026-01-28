import React from 'react';
import { CheckCircle2, Home, LogIn, Mail, User, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";



const SignupSuccess = () => {
  // 실제 서비스에서는 가입 시 전달된 state나 context에서 가져올 데이터
  const navigate = useNavigate();
  const location = useLocation()
  const { user } = location.state || {};
  const { 
    userName, 
    userBirthDate,
    userId,
    userEmail
  } = user || {};
  
  return (
    <div className="min-h-screen bg-white flex justify-center items-center py-10 px-5 font-sans text-slate-900">
      <div className="max-w-[550px] w-full text-center">
        
        {/* 성공 아이콘 애니메이션 */}
        <div className="flex justify-center mb-8 animate-bounce-short">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 animate-ping opacity-20"></div>
            <CheckCircle2 size={80} className="text-blue-600 relative z-10" strokeWidth={1.5} />
          </div>
        </div>

        {/* 메인 타이틀 */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 leading-tight">
          회원가입이 <span className="text-blue-600">완료</span>되었습니다.
        </h1>

        {/* 정보 요약 박스 */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-10 text-left shadow-sm">
          <div className="space-y-5">
            {/* 회원정보 (이름/생일) */}
            <div className="flex items-start sm:items-center">
              <span className="w-24 text-sm font-bold text-slate-800 flex items-center gap-2 shrink-0">
                <User size={16} className="text-slate-400" /> 회원정보
              </span>
              <div className="flex items-center gap-3 text-[15px] text-slate-600 font-medium">
                <span>{userName}</span>
                <span className="w-[1px] h-3 bg-slate-300"></span>
                <span className="text-slate-500">{userBirthDate || "0000.00.00"}</span>
              </div>
            </div>

            {/* 아이디 */}
            <div className="flex items-start sm:items-center">
              <span className="w-24 text-sm font-bold text-slate-800 flex items-center gap-2 shrink-0">
                <Calendar size={16} className="text-slate-400" /> 아이디
              </span>
              <span className="text-[15px] text-slate-600 font-medium">{userId || "ID 정보 없음"}</span>
            </div>

            {/* 이메일 */}
            <div className="flex items-start sm:items-center">
              <span className="w-24 text-sm font-bold text-slate-800 flex items-center gap-2 shrink-0">
                <Mail size={16} className="text-slate-400" /> 이메일
              </span>
              <span className="text-[15px] text-slate-600 font-medium">{userEmail || "Email 정보 없음"}</span>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex sm:flex-row justify-center gap-3 mt-8 mb-8">
          <button onClick={() => navigate('/#')}
                  className="flex-1 max-w-xs h-[56px] bg-white border border-slate-300 text-slate-600 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]">
            <Home size={18} /> 메인 페이지로
          </button>
          <button onClick={() => navigate('/loginMain')}
                  className="flex-1 max-w-xs h-[56px] bg-white border border-slate-300 text-slate-600 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]">
            <LogIn size={18} />로그인하러 가기 
          </button>
        </div>
        
      
        
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default SignupSuccess;