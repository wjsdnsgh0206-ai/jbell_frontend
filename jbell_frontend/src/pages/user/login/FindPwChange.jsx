import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

const FindPwChange = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 간단한 유효성 검사 예시
  const isLengthValid = password.length >= 8;
  const isMatch = password === confirmPassword && password !== '';

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-left">
          비밀번호 찾기
        </h1>

        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          <form className="space-y-8">
            {/* 새 비밀번호 입력 */}
            <div className="space-y-3 text-left">
              <label 
                htmlFor="new-pw" 
                className="text-sm font-medium text-gray-500"
              >
                새 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-pw"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                  placeholder="새 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className={`text-xs flex items-center gap-1 ${isLengthValid ? 'text-blue-600' : 'text-gray-400'}`}>
                <CheckCircle2 size={14} /> 8자 이상 입력해주세요.
              </p>
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="space-y-3 text-left">
              <label 
                htmlFor="new-pw-confirm" 
                className="text-sm font-medium text-gray-500"
              >
                새 비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="new-pw-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-4 pr-12 border rounded-xl focus:ring-2 outline-none transition-all text-base ${
                    isMatch ? 'border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="비밀번호를 한 번 더 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs ${isMatch ? 'text-blue-600' : 'text-red-500'}`}>
                  {isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* 하단 버튼 액션 */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <button 
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 border border-gray-400 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소하기
          </button>
          <button 
            type="button"
            disabled={!isMatch || !isLengthValid}
            className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100"
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindPwChange;