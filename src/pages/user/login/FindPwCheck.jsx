import React, { useState, useEffect } from 'react';
import { Mail, User, ShieldCheck, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Home, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { userService } from '@/services/api'; 
import EmailAuthSection from '@/components/user/auth/EmailAuthSection'; 

const FindPwCheck = () => {
  const navigate = useNavigate();
  const { register, watch, formState: { errors } } = useForm();
  
  // 상태 관리
  const [isAuthVerified, setIsAuthVerified] = useState(false); // 이메일 인증 완료 여부
  const [isResetComplete, setIsResetComplete] = useState(false); // 최종 변경 완료 여부
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 실시간 값 모니터링
  const userId = watch('userId');
  const userEmail = watch('userEmail');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // 1. 비밀번호 재설정 요청 (최종 단계)
  const handleResetPassword = async () => {
  if (newPassword !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const response = await userService.resetPassword(userId, userEmail, newPassword);

    // 백엔드에서 유저가 없으면 500이나 특정 에러를 던질 것이므로 catch에서 처리됨
    if (response) { 
      alert("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.");
      navigate('/idPwLogin');
    }
  } catch (error) {
    // 백엔드의 throw new RuntimeException("정보가 일치하지 않습니다.") 처리
    const errorMsg = error.response?.data?.message || "존재하지 않는 사용자입니다.";
    alert(errorMsg);
    // 만약 사용자가 없어서 실패했다면 다시 1단계로 이동
    setIsAuthVerified(false);
  }
};


  const handleCheckAndSendEmail = async (email) => {
  if (!userId) {
    alert("아이디를 먼저 입력해주세요.");
    return false; // 이메일 발송 중단
  }

  try {
    // 1. 유저 존재 여부 체크 (백엔드에 해당 엔드포인트가 있어야 함)
    // 만약 별도 체크 API가 없다면 resetPassword 로직을 활용해 에러를 잡아야 합니다.
    const response = await userService.checkUserExists(userId, email);
    
    if (response.status === "FAIL") {
      alert("존재하지 않는 사용자이거나 정보가 일치하지 않습니다.");
      return false;
    }
    
    return true; // 체크 통과 시 이메일 발송 진행
  } catch (error) {
    alert("사용자 정보를 확인하는 중 오류가 발생했습니다.");
    return false;
  }
};

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-2 mb-10 group cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-left">비밀번호 찾기</h1>
        </div>

        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          {!isAuthVerified ? (
            /* 1단계: 아이디 입력 및 이메일 인증 */
            <div className="space-y-8 text-left animate-in fade-in duration-500">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <User size={14} /> 아이디
                </label>
                <input
                  type="text"
                  {...register('userId', { required: true })}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="아이디를 입력하세요"
                />
              </div>

              {/* 기존에 만든 공통 이메일 인증 섹션 재사용 */}
              <EmailAuthSection 
                register={register}
                watch={watch}
                errors={errors}
                userEmail={userEmail}
                isAuthVerified={isAuthVerified}
                setIsAuthVerified={setIsAuthVerified}
              />

              <div className="pt-4 text-center">
                <p className="text-sm text-gray-400">
                  인증이 완료되면 비밀번호 재설정 버튼이 활성화됩니다.
                </p>
              </div>
            </div>
          ) : !isResetComplete ? (
            /* 2단계: 새 비밀번호 설정 */
            <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-500">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 size={18} /> 본인 인증 완료! 새로운 비밀번호를 입력해주세요.
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Lock size={14} /> 새 비밀번호
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register('newPassword')}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="8~16자, 영문+숫자+특수문자"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500">새 비밀번호 확인</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register('confirmPassword')}
                      className={`w-full px-4 py-4 border rounded-xl focus:ring-2 outline-none transition-all ${
                        confirmPassword && newPassword === confirmPassword 
                        ? 'border-green-500 focus:ring-green-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="다시 한번 입력하세요"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                className="w-full py-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-50"
              >
                비밀번호 변경하기
              </button>
            </div>
          ) : (
            /* 3단계: 변경 완료 안내 */
            <div className="py-10 text-center space-y-8 animate-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900">변경 완료!</h2>
                <p className="text-gray-500 text-lg">새로운 비밀번호로 안전하게 로그인하세요.</p>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-end gap-3">
          {isResetComplete ? (
            <button
              onClick={() => navigate('/idPwLogin')}
              className="w-full sm:w-auto px-12 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              로그인 화면으로 <ArrowRight size={20} />
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
      </div>
    </div>
  );
};

export default FindPwCheck;