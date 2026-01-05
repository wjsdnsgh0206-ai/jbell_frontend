// src/pages/user/facility/UserFacilityDetail.jsx
import React from 'react';
import { Info } from 'lucide-react'; // 아이콘 변경 (Lucide)
import DetailPageTemplate from '@/components/shared/DetailPageTemplate';
import InfoList from '@/components/shared/InfoList';

const UserFacilityDetail = () => {
  // [더미 데이터] 추후 API 연동 시 props나 query로 받아옴
  const facilityData = {
    name: "전주 시민 체육관 대피소",
    lastUpdated: "2025년 12월 16일",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "본 대피소는 내진 설계가 적용되어 있으며, 비상 급수 시설과 자가 발전기를 갖추고 있습니다.",
    details: [
      { label: "시설유형", value: "대피소" },
      { label: "관리기관", value: "전주시청 안전총괄과" },
      { label: "시설규모", value: "1200 ㎡" },
      { label: "수용 가능 인원", value: "500명" },
      { label: "주소", value: "전주시 완산구 효자로 225" },
      { label: "평상시 활용 유형", value: "지하주차장" },
      { label: "운영여부", value: "운영중" },
      { label: "문의 전화", value: "063-252-0000" },
    ]
  };

  return (
    <DetailPageTemplate
      title={facilityData.name}
      lastUpdated={facilityData.lastUpdated}
      breadcrumbItems={[
        { label: "홈", path: "/", hasIcon: true },
        { label: "대피소 소개", path: "/facilityList", hasIcon: false }, // 리스트로 이동 가능하게 path 추가
        { label: facilityData.name, hasIcon: false },
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
              src={facilityData.locationImage}
            />
          </div>

          {/* 안내 박스 */}
          <aside className="p-5 bg-graygray-5 rounded-xl border border-graygray-20">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-secondary-50" />
              <h3 className="text-body-m-bold text-graygray-90">안내사항</h3>
            </div>
            <p className="text-body-s text-graygray-70 pl-7 leading-relaxed">
              {facilityData.description}
            </p>
          </aside>
        </div>

        {/* 3. 오른쪽: 시설 정보 리스트 */}
        <div className="flex-1">
           <InfoList items={facilityData.details} />
        </div>

      </div>
    </DetailPageTemplate>
  );
};

export default UserFacilityDetail;