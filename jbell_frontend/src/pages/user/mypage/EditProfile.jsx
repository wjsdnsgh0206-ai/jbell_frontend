import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Lock, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    city: "11", // 서울특별시
    district: "110", // 강남구
    name: "홍길동",
    birthDate: "1990-01-01",
    gender: "male",
    id: "korea_user01",
    email: "contact@email.com"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-5 sm:py-16 font-sans text-slate-900">
      <div className="max-w-[500px] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8 text-left">
          내 정보 수정
        </h1>

        {/* 1. 거주지 설정 카드 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={18} className="text-blue-600" />
            <h2 className="text-[17px] font-bold">거주지 설정</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">맞춤형 정책 알림을 받고 싶은 지역을 선택해 주세요.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              name="city"
              value={profile.city}
              onChange={handleChange}
              className="flex-1 h-12 px-3 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500 bg-white"
            >
              <option value="">시도 선택</option>
              <option value="11">서울특별시</option>
            </select>
            <select 
              name="district"
              value={profile.district}
              onChange={handleChange}
              className="flex-1 h-12 px-3 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500 bg-white"
            >
              <option value="">시군구 선택</option>
              <option value="110">강남구</option>
            </select>
          </div>
        </div>

        {/* 2. 계정 정보 관리 카드 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <User size={18} className="text-blue-600" />
            <h2 className="text-[17px] font-bold">계정 정보 관리</h2>
          </div>

          {/* 이름 */}
          <div className="text-left">
            <label className="block text-[13px] font-bold text-slate-600 mb-2">이름</label>
            <input 
              type="text" 
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 생년월일 */}
          <div className="text-left">
            <label className="block text-[13px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
              <Calendar size={14} /> 생년월일
            </label>
            <input 
              type="date" 
              name="birthDate"
              value={profile.birthDate}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500"
            />
          </div>

          {/* 성별 */}
          <div className="text-left">
            <label className="block text-[13px] font-bold text-slate-600 mb-2">성별</label>
            <div className="flex gap-10 py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male"
                  checked={profile.gender === "male"}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600 cursor-pointer" 
                />
                <span className="text-[15px] group-hover:text-blue-600 transition-colors">남</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female"
                  checked={profile.gender === "female"}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600 cursor-pointer" 
                />
                <span className="text-[15px] group-hover:text-blue-600 transition-colors">여</span>
              </label>
            </div>
          </div>

          {/* 아이디 (Readonly) */}
          <div className="text-left">
            <label className="flex items-center text-[13px] font-bold text-slate-600 mb-2">
              아이디 <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[11px] font-normal">수정불가</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={profile.id}
                readOnly 
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-lg text-[15px] text-slate-400 cursor-not-allowed outline-none"
              />
              <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          <hr className="border-slate-100 !my-8" />

          {/* 비밀번호 변경 */}
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-[13px] font-bold text-slate-600 mb-2">새 비밀번호</label>
              <input 
                type="password" 
                className="w-full h-12 px-4 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500"
                placeholder="변경할 경우에만 입력하세요"
              />
            </div>
            <div className="text-left">
              <label className="block text-[13px] font-bold text-slate-600 mb-2">새 비밀번호 확인</label>
              <input 
                type="password" 
                className="w-full h-12 px-4 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500"
                placeholder="비밀번호 재입력"
              />
            </div>
          </div>

          <hr className="border-slate-100 !my-8" />

          {/* 이메일 및 인증 */}
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-[13px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                <Mail size={14} /> 이메일 주소
              </label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="flex-1 h-12 px-4 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500"
                  placeholder="email@example.com"
                />
                <button type="button" className="px-4 bg-white border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors whitespace-nowrap">
                  인증요청
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-600 mb-2">인증번호 확인</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 h-12 px-4 border border-slate-300 rounded-lg text-[15px] outline-none focus:border-blue-500"
                  placeholder="인증번호 6자리"
                />
                <button type="button" className="px-4 text-blue-600 border border-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
                  인증하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button 
            onClick={() => window.history.back()}
            className="flex-1 h-14 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> 취소하기
          </button>
          <button 
            type="submit"
            className="flex-1 h-14 bg-blue-600 text-white border-none rounded-xl font-bold text-base hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} /> 정보 수정완료
          </button>
        </div>

        {/* 회원 탈퇴 안내 */}
        <div className="mt-10 flex justify-center">
          <button className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 underline underline-offset-4">
            <ShieldAlert size={14} /> 탈퇴를 원하시나요?
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;