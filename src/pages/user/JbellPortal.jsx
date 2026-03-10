import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Shield, Github, ChevronRight } from 'lucide-react';
import JbellProjectSummary from '@/pages/user/JbellProjectSummary';


const JbellPortal = () => {
  const navigate = useNavigate();

  // 테스트 계정 정보 상수화
  const TEST_ACCOUNTS = {
    USER: { id: 'user', pw: 'user1234' },
    ADMIN: { id: 'admin', pw: 'admin1234' }
  };

  // 링크 이동 및 자동완성 State 전달 핸들러
  const handleNavigateWithAutoFill = (path, accountInfo = null) => {
    if (accountInfo) {
      // 로그인 페이지로 이동 시 state로 계정 정보 전달 (URL에 노출되지 않음)
      navigate(path, { state: { autoId: accountInfo.id, autoPw: accountInfo.pw } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-graygray-90">전북안전누리 (JBELL)</h1>
        </div>
        <p className="text-lg text-graygray-70 mb-6">
          인사담당자 및 평가자님을 위한 프로젝트 테스트 포털입니다.
        </p>
        <a 
          href="https://github.com/wjsdnsgh0206-ai/jbell_frontend"
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-graygray-90 text-white rounded-md hover:bg-graygray-70 transition-colors"
        >
          <Github className="w-5 h-5" />
          GitHub 프로젝트 이동
        </a>
      </div>

      {/* Account Cards Section */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* 1. 비회원 메인화면 */}
        <div className="bg-white p-6 rounded-lg border border-graygray-20 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-graygray-5 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-graygray-50" />
          </div>
          <h2 className="text-xl font-bold text-graygray-90 mb-2">비회원 (Guest)</h2>
          <p className="text-sm text-graygray-70 mb-6 flex-grow">
            로그인 없이 누구나 접근 가능한 재난/안전 정보 메인 화면입니다.
          </p>
          <button
            onClick={() => handleNavigateWithAutoFill('/')}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-graygray-20 text-graygray-90 rounded hover:bg-graygray-5 transition-colors"
          >
            메인으로 이동 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. 일반회원 로그인 */}
        <div className="bg-white p-6 rounded-lg border border-graygray-20 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-secondary-5 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-secondary-50" />
          </div>
          <h2 className="text-xl font-bold text-graygray-90 mb-2">일반회원 (User)</h2>
          <div className="bg-graygray-5 p-3 rounded w-full mb-6 text-sm text-left">
            <p className="text-graygray-70">아이디 : <strong className="text-graygray-90">{TEST_ACCOUNTS.USER.id}</strong></p>
            <p className="text-graygray-70">비밀번호 : <strong className="text-graygray-90">{TEST_ACCOUNTS.USER.pw}</strong></p>
          </div>
          <button
            onClick={() => handleNavigateWithAutoFill('/idPwLogin', TEST_ACCOUNTS.USER)}
            className="w-full mt-auto flex justify-center items-center gap-2 px-4 py-2 bg-secondary-50 text-white rounded hover:bg-opacity-90 transition-colors"
          >
            자동입력 후 로그인 이동 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. 관리자 로그인 */}
        <div className="bg-white p-6 rounded-lg border border-admin-border shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-admin-primary" />
          </div>
          <h2 className="text-xl font-bold text-graygray-90 mb-2">관리자 (Admin)</h2>
          <div className="bg-graygray-5 p-3 rounded w-full mb-6 text-sm text-left">
            <p className="text-graygray-70">아이디 : <strong className="text-graygray-90">{TEST_ACCOUNTS.ADMIN.id}</strong></p>
            <p className="text-graygray-70">비밀번호 : <strong className="text-graygray-90">{TEST_ACCOUNTS.ADMIN.pw}</strong></p>
          </div>
          <button
            onClick={() => handleNavigateWithAutoFill('/idPwLogin', TEST_ACCOUNTS.ADMIN)}
            className="w-full mt-auto flex justify-center items-center gap-2 px-4 py-2 bg-admin-primary text-white rounded hover:bg-opacity-90 transition-colors"
          >
            자동입력 후 로그인 이동 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
      <div>
        <JbellProjectSummary />
      </div>
    </div>
  );
};

export default JbellPortal;