import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/api'; // userService 임포트 확인

const EditProfileCheck = () => {
  const [password, setPassword] = useState('');
  const { user } = useAuth(); // AuthContext에서 유저 정보 가져옴
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유저 아이디가 없거나 비밀번호를 입력하지 않았으면 중단
    if (!password || !user?.userId) {
      if (!user?.userId) setError('로그인 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. userService를 이용해 본인 확인 요청
      // loginData 구조와 동일하게 전달
      const response = await userService.verifyPassword({
        userId: user.userId,
        userPw: password
      });

      // 2. 응답 상태가 SUCCESS인 경우 수정 페이지로 이동
      if (response.data && response.data.status === "SUCCESS") {
        navigate('/editProfile'); 
      } else {
        // 백엔드에서 에러 메시지를 보낸 경우 활용
        setError(response.data?.message || '비밀번호가 일치하지 않습니다.');
      }

    } catch (err) {
      // 401 Unauthorized 등 에러 발생 시 처리
      const serverMsg = err.response?.data?.message;
      setError(serverMsg || '비밀번호가 일치하지 않거나 오류가 발생했습니다.');
      console.error("인증 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "마이페이지", path: "/myProfile", hasIcon: false },
    { label: "내 정보 수정", hasIcon: false },
  ];

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0">
      <PageBreadcrumb items={breadcrumbItems} />
      
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
              onClick={() => navigate(-1)}
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