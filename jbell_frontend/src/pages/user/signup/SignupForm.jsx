import React, { useState } from 'react';
import { User, Calendar, Mail, Lock, CheckCircle2, MapPin } from 'lucide-react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    city: '',
    district: '',
    name: '',
    birthDate: '',
    gender: 'male',
    userId: '',
    password: '',
    confirmPassword: '',
    email: '',
    authCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("회원가입 데이터:", formData);
    alert("가입이 완료되었습니다!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-4 font-sans text-slate-900">
      <div className="max-w-[550px] w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">회원가입</h1>
          <p className="text-slate-500 mt-2 text-sm">대한민국 디지털정부 서비스 이용을 위한 정보를 입력해주세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 거주지 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-blue-600" /> 거주지
            </h2>
            <p className="text-xs text-slate-500 mb-4">살고있는 혹은 정보를 받고 싶은 지역을 선택해 주세요.</p>
            <div className="grid grid-cols-2 gap-3">
              <select 
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              >
                <option value="">시도 선택</option>
                <option value="seoul">서울특별시</option>
                <option value="gyeonggi">경기도</option>
              </select>
              <select 
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              >
                <option value="">시군구 선택</option>
              </select>
            </div>
          </section>

          {/* 회원 정보 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <User size={20} className="text-blue-600" /> 회원 정보
            </h2>

            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">이름</label>
              <input 
                type="text"
                name="name"
                placeholder="이름을 입력하세요"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>

            {/* 생년월일 & 성별 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">생년월일</label>
                <div className="relative">
                  <input 
                    type="date"
                    name="birthDate"
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">성별</label>
                <div className="flex bg-slate-100 p-1 rounded-xl h-12">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, gender: 'male'}))}
                    className={`flex-1 rounded-lg text-sm font-bold transition-all ${formData.gender === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                  >남</button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, gender: 'female'}))}
                    className={`flex-1 rounded-lg text-sm font-bold transition-all ${formData.gender === 'female' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                  >여</button>
                </div>
              </div>
            </div>

            {/* 아이디 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">아이디</label>
              <input 
                type="text"
                name="userId"
                placeholder="아이디를 입력하세요"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            {/* 비밀번호 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 text-blue-600">비밀번호</label>
                <input 
                  type="password"
                  name="password"
                  placeholder="최소 8자 이상"
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">비밀번호 확인</label>
                <input 
                  type="password"
                  name="confirmPassword"
                  placeholder="다시 입력하세요"
                  onChange={handleChange}
                  className={`w-full h-12 px-4 rounded-xl border outline-none transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500'}`}
                />
              </div>
            </div>

            {/* 이메일 인증 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">이메일</label>
              <div className="flex gap-2">
                <input 
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  onChange={handleChange}
                  className="flex-1 h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
                <button type="button" className="px-4 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">번호전송</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">인증번호 입력</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  name="authCode"
                  placeholder="6자리 숫자"
                  onChange={handleChange}
                  className="flex-1 h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
                <button type="button" className="px-4 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">인증하기</button>
              </div>
            </div>
          </section>

          {/* 하단 버튼 */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
            >취소하기</button>
            <button 
              type="submit"
              className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >가입하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;