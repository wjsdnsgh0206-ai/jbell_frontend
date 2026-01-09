import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 임포트
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'; // 1. import

const EditProfileCheck = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // 2. 네비게이트 함수 선언

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError('');

    try {
      // --- 실제 API 호출 예시 ---
      // const response = await fetch('/api/user/verify-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password })
      // });
      // const data = await response.json();
      
      // 시뮬레이션 (1초 대기)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 가짜 검증 로직 (비밀번호가 '1234'라고 가정)
      if (password === '1234') {
        // 3. 검증 성공 시 이동할 경로 설정
        navigate('/editProfile'); 
      } else {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "마이페이지",path: "/myProfile", hasIcon: false }, // 중간 경로 (클릭 안되게 하려면 path 생략)
    { label: "내 정보 수정", hasIcon: false },    // 현재 페이지
  ];

  return (
    
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0">
            {/* 브레드크럼 */}
    <PageBreadcrumb items={breadcrumbItems} />
      
    {/* 헤더 타이틀 */}
    <header className="flex flex-col w-full gap-8 lg:gap-10 mb-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-heading-xl text-graygray-90">프로필 정보</h1>
        <p className="text-detail-m text-graygray-70">회원님의 등록된 정보를 수정하실 수 있습니다.</p>
      </div>
    </header>

      <div className="max-w-[1280px] w-full animate-in fade-in slide-in-from-top-4 duration-700">
        
    

        <form onSubmit={handleSubmit}>
          <div className={`bg-white border ${error ? 'border-red-500 shadow-sm shadow-red-50' : 'border-slate-200'} rounded-2xl p-8 sm:p-10 transition-all`}>
            <div className="mb-8">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <ShieldCheck size={20} />
                <h2 className="text-xl font-bold text-slate-900">본인 확인</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                안전을 위해 현재 사용 중인 비밀번호를 확인합니다.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="비밀번호 입력"
                  className={`w-full h-[56px] px-4 pr-12 border rounded-xl outline-none transition-all focus:ring-4 ${
                    error ? 'border-red-500 focus:ring-red-50' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)} // 뒤로 가기
              className="h-[56px] px-8 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!password || isLoading}
              className={`h-[56px] px-10 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center min-w-[140px]
                ${password && !isLoading ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed shadow-none'}
              `}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileCheck;