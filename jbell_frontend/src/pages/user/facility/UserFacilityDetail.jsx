// src/pages/user/facility/UserFacilityDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams 추가
import { Info, AlertCircle } from 'lucide-react'; // 아이콘 추가

import DetailPageTemplate from '@/components/shared/DetailPageTemplate';
import InfoList from '@/components/shared/InfoList';
// [핵심] 가상 API 함수 import
import { getFacilityDetail } from './data';

const UserFacilityDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 id 추출 (예: /facility/detail/1 -> id: "1")
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 컴포넌트 마운트 시 데이터 조회 (API 연동 시뮬레이션)
  useEffect(() => {
    // 실제 API 호출처럼 보이게 하기
    const fetchData = () => {
      const result = getFacilityDetail(id); // 가상 API 호출
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // 1. 로딩 중일 때
  if (loading) {
    return <div className="flex h-96 justify-center items-center">로딩 중...</div>;
  }

  // 2. 데이터가 없을 때 (잘못된 ID 접근)
  if (!data) {
    return (
      <div className="flex flex-col h-96 justify-center items-center gap-4">
        <AlertCircle className="w-10 h-10 text-graygray-40" />
        <p className="text-body-l text-graygray-70">해당 시설 정보를 찾을 수 없습니다.</p>
        <button 
          onClick={() => navigate('/facilityList')}
          className="px-4 py-2 bg-graygray-90 text-white rounded-lg hover:bg-graygray-70 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 3. 데이터가 있을 때 렌더링
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
      <h2 className="text-title-xl text-graygray-90">
        시설 위치 및 정보
      </h2>

      <div className="flex flex-col lg:flex-row gap-10 w-full">
        
        {/* 2. 왼쪽: 지도 및 안내사항 */}
        <div className="flex flex-col gap-6 flex-1">
          {/* 지도 이미지 영역 */}
          <div className="w-full h-[350px] bg-graygray-10 rounded-xl overflow-hidden border border-graygray-20">
            <img
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              alt="위치 지도"
              src={data.locationImage}
            />
          </div>

          {/* 안내 박스 */}
          <aside className="p-5 bg-graygray-5 rounded-xl border border-graygray-20">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-secondary-50" />
              <h3 className="text-body-m-bold text-graygray-90">안내사항</h3>
            </div>
            <p className="text-body-s text-graygray-70 pl-7 leading-relaxed">
              {data.description}
            </p>
          </aside>
        </div>

        {/* 3. 오른쪽: 시설 정보 리스트 */}
        <div className="flex-1">
           <InfoList items={data.details} />
        </div>

      </div>
    </DetailPageTemplate>
  );
};

export default UserFacilityDetail;