import React from 'react';
import { ChevronRight, MessageCircle, User, Info, LogIn } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const LoginMain = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <header className="mb-10 text-left">
          <p className="text-sm text-gray-500 mb-2 font-medium">대한민국 디지털정부 사용자 로그인</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
            로그인 방식을 선택해주세요.
          </h1>
          <p className="text-base text-gray-600 break-keep leading-relaxed">
            통합 로그인을 사용해 보세요. 한 번의 회원가입과 로그인으로 연계된 모든 공공 서비스를 이용할 수 있는 인증 서비스입니다.<br className="hidden sm:block" />
            모든 정부기관의 서비스를 편리하게 이용하실 수 있습니다.
          </p>
        </header>

        <hr className="border-t border-gray-200 my-8" />

        {/* Login Selection Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-10">
          <div className="flex-1">
            <h2 className="text-xl font-bold leading-snug">
              간단히 로그인하고<br />필요시 본인인증하기
            </h2>
          </div>

          <div className="flex-[1.3] flex flex-col gap-4">
            {/* Social Login Button */}
            <button onClick={() => navigate('/#')}
                    className="group flex items-center justify-between p-6 bg-gray-50 border border-transparent rounded-2xl transition-all hover:bg-gray-100 hover:border-gray-200 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900">
                  <MessageCircle size={24} fill="currentColor" />
                </div>
                <div>
                  <span className="block text-lg font-bold">소셜(SNS)계정으로 로그인</span>
                  <span className="text-sm text-gray-500">카카오 계정으로 로그인하기</span>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" size={20} />
            </button>

            {/* ID/PW Login Button */}
            <button  onClick={() => navigate('/idPwLogin')}
              className="group flex items-center justify-between p-6 bg-gray-50 border border-transparent rounded-2xl transition-all hover:bg-gray-100 hover:border-gray-200 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <LogIn size={24} />
                </div>
                <div>
                  <span className="block text-lg font-bold">아이디/비밀번호</span>
                  <span className="text-sm text-gray-500">회원가입 시 등록한 정보로 로그인</span>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>

        <hr className="border-t border-gray-200 my-8" />

        {/* Signup Row */}
        <div className="flex items-center gap-2 mb-8 text-base">
          <span className="font-semibold text-gray-800">아직 대한민국 디지털정부 회원이 아니신가요?</span>
          <a href="/SignupAgreement" className="text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center font-medium">
            회원가입 <ChevronRight size={16} />
          </a>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 font-bold text-blue-900 mb-4">
            <Info size={18} />
            <span>로그인에 어려움이 있으신가요?</span>
          </div>
          <ul className="space-y-3">
            {[
              "이전에 이용한 로그인 수단이 안 보인다면 상단 통합 로그인 설정을 확인해보세요.",
              "로그인 관련 도움말이나 자주 찾는 질문을 확인해보세요.",
              "고객센터: 02-3703-2500 (내선 4번)"
            ].map((text, index) => (
              <li key={index} className="relative pl-4 text-sm text-gray-600 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginMain;