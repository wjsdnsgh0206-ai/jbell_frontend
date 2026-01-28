import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Check, Edit3, CalendarDays } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { userService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

// 1. 지역 코드 매핑 객체
const AREA_MAP = {
  'L1060100': '고창', 'L1060200': '부안', 'L1060300': '군산',
  'L1060400': '김제', 'L1060500': '완주', 'L1060600': '진안',
  'L1060700': '무주', 'L1060800': '장수', 'L1060900': '임실',
  'L1061000': '순창', 'L1061100': '익산', 'L1061200': '정읍',
  'L1061300': '전주', 'L1061400': '남원'
};

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. 날짜 포맷팅 함수 (라이브러리 미설치 대응)
  const formatDate = (dateString, type = 'dot') => {
    if (!dateString) return '미등록';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // 변환 실패 시 원본 반환

    if (type === 'ko') {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
    // yyyy. MM. dd 형식
    return date.toLocaleDateString('ko-KR').replace(/\.$/, ""); 
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        const myRes = await userService.getUserInfo(user.userId);
        if (myRes?.data) setMyProfile(myRes.data);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const getAreaName = (code) => AREA_MAP[code] || code || '미등록';

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "마이페이지", path: "/myProfile" },
    { label: "내 정보 조회" },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen font-bold text-blue-600">데이터를 동기화 중입니다...</div>;

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0 text-left">
      <PageBreadcrumb items={breadcrumbItems} />

      <div className="max-w-[1280px] w-full space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">마이페이지</h1>
            <p className="text-slate-500 mt-2">나의 정보 관리 및 시스템 권한을 확인합니다.</p>
          </div>
          <button 
            onClick={() => navigate('/editProfileCheck')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <Edit3 size={18} /> 정보 수정하기
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-bold">{myProfile?.userName}</h2>
                <p className="text-slate-400 text-sm">{myProfile?.userId} ({myProfile?.userGrade})</p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={16} /> {myProfile?.userEmail}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={16} /> {getAreaName(myProfile?.userResidenceArea)}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Check className="text-blue-600" /> 상세 계정 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">생년월일</label>
                  <p className="text-lg font-semibold text-slate-700 mt-1">
                    {formatDate(myProfile?.userBirthDate, 'ko')}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">성별</label>
                  <p className="text-lg font-semibold text-slate-700 mt-1">
                    {myProfile?.userGender === 'M' ? '남성' : myProfile?.userGender === 'F' ? '여성' : '미선택'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">거주 지역</label>
                  <p className="text-lg font-semibold text-slate-700 mt-1">
                    {getAreaName(myProfile?.userResidenceArea)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={14} /> 가입일
                  </label>
                  <p className="text-lg font-semibold text-slate-700 mt-1">
                    {formatDate(myProfile?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;