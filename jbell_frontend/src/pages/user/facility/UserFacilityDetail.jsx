 import BreadCrumb from '@/components/user/board/BreadCrumb';

const UserFacilityDetail = () => {
  const facilityDetails = [
    { label: "시설유형", value: "대피소" },
    { label: "관리기관", value: "전주시청 안전총괄과" },
    { label: "시설규모", value: "1200 ㎡" },
    { label: "수용 가능 인원", value: "500명" },
    { label: "주소", value: "전주시 완산구 효자로 225" },
    { label: "평상시 활용 유형", value: "지하주차장" },
    { label: "운영여부", value: "운영중" },
    { label: "문의 전화", value: "063-252-0000" },
  ];

  return (
    <div className="flex w-full min-h-screen justify-center">
      {/* List 페이지와 동일하게 max-w-[1000px]와 gap-10 설정 */}
      <div className="w-full max-w-[1000px] flex flex-col gap-10 pt-10 pb-20">
        
        {/* 브레드크럼 (3단계까지 표시) */}
        <BreadCrumb
          firstPath="홈"
          secondPath="대피소 소개"
          thirdPath="전주 시민 체육관 대피소"
        />

        {/* 헤더 */}
        <header className="flex flex-col items-start gap-4 w-full">
          <h1 className="text-2xl lg:text-3xl font-bold text-graygray-90">
            전주 시민 체육관 대피소
          </h1>
          <p className="text-sm lg:text-base text-[#555555]">
            최종 정보 수정일: 2025년 12월 16일
          </p>
        </header>

        {/* 컨텐츠 섹션 */}
        <section className="flex flex-col gap-10">
          <h2 className="text-xl lg:text-2xl font-bold text-graygray-90 border-b pb-4">
            시설 위치 및 정보
          </h2>

          <div className="flex flex-col lg:flex-row gap-10 w-full">
            {/* 왼쪽: 지도 및 안내사항 */}
            <div className="flex flex-col gap-6 flex-1">
              <div className="w-full h-[350px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img
                  className="w-full h-full object-cover"
                  alt="위치 지도"
                  src="https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png"
                />
              </div>
              <aside className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <img src="https://c.animaapp.com/PZUA6SpP/img/icon-system-info.svg" alt="icon" className="w-5 h-5" />
                  <h3 className="font-bold text-gray-800">안내사항</h3>
                </div>
                <p className="text-[15px] text-gray-600 pl-7 leading-relaxed">
                  본 대피소는 내진 설계가 적용되어 있으며, 비상 급수 시설과 자가 발전기를 갖추고 있습니다.
                </p>
              </aside>
            </div>

            {/* 오른쪽: 시설 정보 리스트 */}
            <dl className="flex flex-col gap-3 flex-1">
              {facilityDetails.map((detail, index) => (
                <div key={index} className="flex items-center justify-between p-4 lg:p-5 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                  <dt className="text-gray-500 text-sm lg:text-base">{detail.label}</dt>
                  <dd className="font-bold text-gray-900 text-base lg:text-lg">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserFacilityDetail;