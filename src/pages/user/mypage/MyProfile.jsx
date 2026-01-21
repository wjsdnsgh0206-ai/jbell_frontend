import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Lock, Check, CalendarDays } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { userService } from '@/services/api';

const MyProfile = () => {
  const navigate = useNavigate();
  
  // 1. 상태 관리: 초기값은 빈 객체로 설정
  const [formData, setFormData] = useState({
    city: '', 
    district: '', 
    name: '로딩 중...', 
    birthDate: '',
    gender: '',
    userId: '', 
    email: '', 
  });
  const [loading, setLoading] = useState(true);

  // 2. DB 통신 및 데이터 매핑
  useEffect(() => {
    // 예시: 현재 로그인한 사용자의 아이디 등으로 검색하거나 전체 조회
    const searchOptions = { user_id: "admin" }; // 테스트용 조건

    userService.getUsers(searchOptions)
      .then(data => {
        console.log("✅ 백엔드 데이터 수신:", data);
        
        if (data && data.length > 0) {
          const dbUser = data[0]; // 첫 번째 검색 결과 사용
          
          // 백엔드 Entity 구조를 프론트엔드 formData 구조로 변환
          setFormData({
            // residenceArea가 "서울특별시 종로구" 형태라면 분리해서 넣어줌
            city: dbUser.residenceArea?.split(' ')[0] || '정보 없음',
            district: dbUser.residenceArea?.split(' ')[1] || '정보 없음',
            name: dbUser.name,
            birthDate: dbUser.birthDate || '미등록',
            gender: dbUser.userGrade === 'A' ? 'male' : 'female', // 등급으로 성별 임시 구분 예시
            userId: dbUser.userId,
            email: dbUser.email
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ 데이터 로드 실패", err);
        setLoading(false);
      });
  }, []);

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "마이페이지", path: "/myProfile" },
    { label: "내 정보" },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen">데이터를 불러오는 중...</div>;

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0">
      <PageBreadcrumb items={breadcrumbItems} />

      <div className="max-w-[1280px] w-full">
        <header className="flex flex-col w-full gap-8 lg:gap-10 mb-16">
          <div className="flex flex-col gap-4">
            <h1 className="text-heading-xl text-graygray-90">프로필 정보</h1>
            <p className="text-detail-m text-graygray-70">실시간 DB 데이터가 연동된 프로필입니다.</p>
          </div>
        </header>

        <div className="space-y-6">
          {/* 거주지 섹션 (DB 연동) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <MapPin size={20} className="text-blue-600" /> 거주 지역
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                {formData.city}
              </div>
              <div className="h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                {formData.district}
              </div>
            </div>
          </section>

          {/* 기본 정보 섹션 (DB 연동) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <User size={20} className="text-blue-600" /> 기본 정보
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1">이름</label>
              <div className="w-full h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                {formData.name}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1 ml-1">
                <CalendarDays size={14}/> 생년월일
              </label>
              <div className="w-full h-12 px-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                {formData.birthDate}
              </div>
            </div>

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

          {/* 연락처 섹션 (DB 연동) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <Mail size={20} className="text-blue-600" /> 연락처 정보
            </h2>
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
        </div>
      </div>
    </div>
  );
};

export default MyProfile;