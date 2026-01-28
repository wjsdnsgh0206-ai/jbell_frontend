import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Home, CheckCircle, Copy, Check, Key, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { userService } from '@/services/api'; 
import EmailAuthSection from '@/components/user/auth/EmailAuthSection'; 

const FindIdCheck = () => {
  const navigate = useNavigate();
  
  // react-hook-form 초기화 (이름 관련 로직 제거)
  const { register, watch, formState: { errors } } = useForm();
  
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [copied, setCopied] = useState(false);

  // 실시간 이메일 입력값 모니터링
  const userEmail = watch('userEmail');

  // 아이디 찾기 최종 제출 핸들러
  const handleFindIdSubmit = async () => {
    if (!isAuthVerified) return alert('이메일 인증을 완료해주세요.');

    try {
      // 1. 이름은 빈 값으로, 이메일은 넘겨서 호출
      const response = await userService.findId(userEmail);
      
      if (response && response.status === "SUCCESS") {
        // [수정] 데이터가 존재할 경우 문자열 처리를 거칩니다.
        const originalId = response.data;
        
        // 만약 대소문자를 유지한 채 저장하고 싶다면 그대로 set
        // 혹은 소문자로 통일하고 싶다면 .toLowerCase() 추가
        setFoundId(originalId); 
      } else {
        alert("입력하신 정보와 일치하는 회원이 존재하지 않습니다.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "아이디 조회 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(foundId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        <div className="flex items-center gap-2 mb-10 group cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-left">아이디 찾기</h1>
        </div>

        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          {!foundId ? (
            <div className="space-y-8 text-left animate-in fade-in duration-500">
              {/* 공통 이메일 인증 섹션 (이메일 입력 + 인증번호 확인) */}
              <EmailAuthSection 
                register={register}
                watch={watch}
                errors={errors}
                userEmail={userEmail}
                isAuthVerified={isAuthVerified}
                setIsAuthVerified={setIsAuthVerified}
              />

              <button
                type="button"
                onClick={handleFindIdSubmit}
                disabled={!isAuthVerified}
                className="w-full py-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-lg shadow-blue-50 mt-4"
              >
                아이디 확인하기
              </button>
            </div>
          ) : (
            <div className="py-2 text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle size={40} />
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-5 group transition-colors hover:bg-slate-200/70">
                <span className="text-xl font-semibold text-slate-700 flex-1 break-all tracking-wider font-mono">
                  {/* font-mono를 쓰면 i, l, 1 같은 헷갈리는 글자 구분이 쉬워집니다 */}
                  {foundId}
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    copied ? 'bg-green-500 text-white scale-105' : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  {copied ? <><Check size={16} /> 복사됨</> : <><Copy size={16} /> 복사</>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {foundId ? (
              <button
                onClick={() => navigate('/idPwLogin')}
                className="px-10 py-4 bg-gray-800 text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
              >
                로그인하러 가기 <ArrowRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> 메인화면
              </button>
            )}
          </div>

          {foundId && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <Key size={18} className="text-blue-500" />
                <span>비밀번호도 잊으셨나요?</span>
              </div>
              <button 
                onClick={() => navigate('/findPwCheck')}
                className="group flex items-center text-gray-500 hover:text-blue-600 transition-colors text-base font-medium"
              >
                비밀번호 찾기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindIdCheck;