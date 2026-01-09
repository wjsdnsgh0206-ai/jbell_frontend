import React, { useState } from 'react';
import { User, MapPin, Mail, Lock, Check, CalendarDays } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import PageBreadcrumb from '@/components/shared/PageBreadcrumb'; // 1. import

const MyProfile = () => {
  // 2. 이 페이지에 맞는 경로 데이터 정의
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "마이페이지",path: "/myProfile", hasIcon: false }, // 중간 경로 (클릭 안되게 하려면 path 생략)
    { label: "내 정보", hasIcon: false },    // 현재 페이지
  ];

  const navigate = useNavigate();
  
  // 초기 상태값 (조회용 데이터)
  const [formData] = useState({
    city: '서울특별시', 
    district: '강남구', 
    name: '홍길동', 
    birthDate: '1990-01-01',
    gender: 'male',
    userId: 'hong1234', 
    email: 'hong@example.com', 
  });

  return (
    <>
    <PageBreadcrumb items={breadcrumbItems} />
    <div className="min-h-screen bg-white flex justify-center py-10 px-4 font-sans text-slate-900 text-left">
      <div className="max-w-[1280px] w-full">
        {/* 3. 데이터 전달 */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">프로필 정보</h1>
          <p className="text-slate-500 mt-2">회원님의 등록된 정보를 확인하실 수 있습니다.</p>
        </header>

        <div className="space-y-6">
          {/* 거주지 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><MapPin size={20} className="text-blue-600" /> 거주 지역</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                {formData.city}
              </div>
              <div className="h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                {formData.district}
              </div>
            </div>
          </section>

          {/* 기본 정보 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><User size={20} className="text-blue-600" /> 기본 정보</h2>
            
            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1">이름</label>
              <div className="w-full h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                {formData.name}
              </div>
            </div>

            {/* 생년월일 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1 ml-1">
                <CalendarDays size={14}/> 생년월일
              </label>
              <div className="w-full h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                {formData.birthDate}
              </div>
            </div>

            {/* 성별 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1">성별</label>
              <div className="flex gap-3">
                <div className={`flex-1 h-12 flex items-center justify-center rounded-xl border font-bold text-sm ${formData.gender === 'male' ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                  남성
                </div>
                <div className={`flex-1 h-12 flex items-center justify-center rounded-xl border font-bold text-sm ${formData.gender === 'female' ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                  여성
                </div>
              </div>
            </div>

            {/* 아이디 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1">아이디</label>
              <div className="relative">
                <div className="w-full h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-medium italic">
                  {formData.userId}
                </div>
                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
            </div>
          </section>

          {/* 연락처 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><Mail size={20} className="text-blue-600" /> 연락처 정보</h2>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1">이메일 주소</label>
              <div className="w-full h-12 px-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                {formData.email}
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold italic">
                  <Check size={14}/> Verified
                </div>
              </div>
            </div>
          </section>

          {/* <div className="pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/myProfile')} 
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
            >
              확인 완료
            </button>
          </div> */}
        </div>
      </div>
    </div>
    </>
  );
};

export default MyProfile;