import React from 'react';
import { 
  UserCircle, 
  MapPinned, 
  IdentificationCard, 
  Mail, 
  Settings2,
  CalendarDays
} from 'lucide-react';

const MyProfile = () => {
  // 실제 환경에서는 API를 통해 가져올 사용자 데이터
  const userData = {
    city: "서울특별시",
    district: "강남구",
    name: "홍길동",
    birthDate: "1990-01-01",
    gender: "male",
    id: "korea_user01",
    email: "contact@email.com"
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-5 sm:py-16 font-sans text-slate-900">
      <div className="max-w-[500px] w-full">
        <h1 className="text-2xl font-bold tracking-tight mb-8 text-left border-b pb-4 border-slate-900">
          내 정보
        </h1>

        {/* 거주지 카드 */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-5 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <MapPinned size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">거주지</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-slate-500 ml-1">시도</label>
              <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 font-medium cursor-default">
                {userData.city}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-slate-500 ml-1">시군구</label>
              <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 font-medium cursor-default">
                {userData.district}
              </div>
            </div>
          </div>
        </div>

        {/* 회원 정보 카드 */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <UserCircle size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">회원 정보</h2>
          </div>

          {/* 이름 */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-slate-500 ml-1">이름</label>
            <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 font-medium cursor-default">
              {userData.name}
            </div>
          </div>

          {/* 생년월일 */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1">
              <CalendarDays size={13} /> 생년월일
            </label>
            <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 font-medium cursor-default">
              {userData.birthDate}
            </div>
          </div>

          {/* 성별 */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-slate-500 ml-1">성별</label>
            <div className="flex gap-10 py-1 opacity-60">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="radio" checked={userData.gender === 'male'} readOnly className="w-4 h-4 accent-blue-600" /> 남
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="radio" checked={userData.gender === 'female'} readOnly className="w-4 h-4 accent-blue-600" /> 여
              </label>
            </div>
          </div>

          {/* 아이디 */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1">
              <IdentificationCard size={13} /> 아이디
            </label>
            <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 font-medium cursor-default">
              {userData.id}
            </div>
          </div>

          {/* 이메일 */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1">
              <Mail size={13} /> 이메일
            </label>
            <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 font-medium cursor-default">
              {userData.email}
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="footer-actions">
          <button 
            type="button"
            className="w-full h-[54px] bg-blue-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
          >
            <Settings2 size={18} /> 정보 수정하기
          </button>
          <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
            회원 정보는 개인정보처리방침에 따라 안전하게 보호됩니다.<br/>
            수정이 필요한 경우 위의 버튼을 클릭하여 본인 확인 절차를 진행해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;