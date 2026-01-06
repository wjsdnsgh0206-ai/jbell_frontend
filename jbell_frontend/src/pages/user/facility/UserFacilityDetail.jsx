// src/pages/user/facility/UserFacilityDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Info, AlertCircle } from 'lucide-react';

import DetailPageTemplate from '@/components/user/facility/DetailPageTemplate';
import InfoList from '@/components/user/facility/InfoList';
import { getFacilityDetail } from './data';

const UserFacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 페이지 진입 시 스크롤 최상단 이동 (UX 개선)
    window.scrollTo(0, 0);

    // 2. 데이터 조회
    const fetchData = () => {
      const result = getFacilityDetail(id);
      
      // 약간의 지연 효과를 주어 로딩 UI 확인 가능 (실제 API 연동 시 제거 가능)
      setTimeout(() => {
        setData(result);
        setLoading(false);
      }, 300);
    };

    fetchData();
  }, [id]);

  // 1. 로딩 중
  if (loading) {
    return (
      <div className="flex h-[60vh] justify-center items-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-graygray-20 border-t-secondary-50 rounded-full animate-spin"></div>
        <p className="text-body-m text-graygray-50">시설 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 2. 데이터 없음 (잘못된 접근)
  if (!data) {
    return (
      <div className="flex flex-col h-[60vh] justify-center items-center gap-6">
        <AlertCircle className="w-16 h-16 text-graygray-30" />
        <div className="text-center">
          <p className="text-title-m font-bold text-graygray-90">시설 정보를 찾을 수 없습니다.</p>
          <p className="text-body-m text-graygray-50 mt-2">삭제되었거나 존재하지 않는 페이지입니다.</p>
        </div>
        <button 
          onClick={() => navigate('/facilityList')}
          className="px-6 py-3 bg-secondary-50 text-white rounded-lg font-bold hover:bg-secondary-60 transition-colors shadow-md"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 3. 정상 렌더링
  return (
    <DetailPageTemplate
      title={data.name}
      lastUpdated={data.lastUpdated}
      breadcrumbItems={[
        { label: "홈", path: "/", hasIcon: true },
        { label: "대피소 소개", path: "/facilityList", hasIcon: false },
        { label: data.name, hasIcon: false },
      ]}
    >
      {/* 1. 중간 타이틀 */}
      <div className="flex items-center gap-2">
        <h2 className="text-heading-m text-graygray-90">
          시설 위치 및 정보
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 w-full mb-10">
        
        {/* 2. 왼쪽: 지도 및 안내사항 */}
        <div className="flex flex-col gap-6 flex-1">
          {/* 지도 이미지 영역 */}
          <div className="w-full h-[350px] bg-graygray-5 rounded-xl overflow-hidden border border-graygray-20 relative group">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={`${data.name} 위치 지도`}
              src={data.locationImage}
              onError={(e) => {
                // 이미지 로드 실패 시 Fallback UI 표시
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback UI (이미지 에러 시 등장) */}
            <div className="hidden w-full h-full flex-col justify-center items-center gap-3 bg-graygray-10 text-graygray-40 absolute top-0 left-0">
              <span className="text-body-s font-medium">지도 이미지를 불러올 수 없습니다.</span>
            </div>
          </div>

          {/* 안내 박스 */}
          <aside className="p-6 bg-secondary-5 rounded-xl border border-secondary-50/20">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-secondary-50" />
              <h3 className="text-title-s font-bold text-graygray-90">안내사항</h3>
            </div>
            <p className="text-body-m text-graygray-70 leading-relaxed pl-1">
              {data.description}
            </p>
          </aside>
        </div>

        {/* 3. 오른쪽: 시설 정보 리스트 */}
        <div className="flex-1">
           <InfoList items={data.details} />
        </div>

      </div>
      
      {/* 하단 목록 버튼 영역 */}
      <div className="flex justify-center md:justify-end pt-10 border-t border-graygray-20">
        <button 
          onClick={() => navigate('/facilityList')}
          className="h-16 px-8 rounded-lg border border-graygray-70 bg-graygray-0 flex items-center justify-center hover:bg-graygray-5 transition-all active:scale-95"
        >
          <span className="text-title-m text-graygray-90">
            목록으로
          </span>
        </button>
      </div>

      

    </DetailPageTemplate>
  );
};

export default UserFacilityDetail;