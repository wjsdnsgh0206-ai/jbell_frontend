import React from 'react';

const FacilityDetail = ({ data, onEdit, onDelete, onGoBack }) => {
  // 백엔드에서 받아온 데이터 예시 (data 프롭스로 전달받음)
  // const data = { fcltNm: "전주 시민공원 대피소", fcltSeCd: "민방위대피소", ... };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <button onClick={onGoBack} className="mr-4 text-2xl">←</button>
        <h1 className="text-2xl font-bold">{data?.fcltNm || "전주 시민공원 대피소"}</h1>
      </div>

      <div className="flex gap-6">
        {/* 기본 정보 카드 */}
        <div className="flex-[2] bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6">기본정보</h2>
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            <InfoItem label="시설명" value={data?.fcltNm} />
            <InfoItem label="시설유형" value={data?.fcltSeCd || "민방위대피소"} />
            <InfoItem label="시설규모" value={`${data?.fcltArea || '1200'} m²`} />
            <InfoItem label="예측 수용 가능 인원" value={`${data?.rcptnPsncnt || '500'} 명`} />
            <InfoItem label="시군구" value={data?.sggNm || "전북특별자치도"} />
            <InfoItem label="도로명 주소" value={data?.roadNmAddr || "전주시 완산구 효자로 225"} />
            <InfoItem label="최종업데이트 일시" value={data?.lastModDt || "2026-01-15 15:30"} />
          </div>
        </div>

        {/* 상태 정보 카드 */}
        <div className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-6">상태 정보</h2>
          <div className="space-y-6">
            <InfoItem label="운영여부" value={data?.opnYn === 'Y' ? "운영중" : "미운영"} />
            <InfoItem label="노출여부" value={data?.useYn === 'Y' ? "노출중" : "미노출"} />
          </div>
        </div>
      </div>

      {/* 하단 버튼 바 */}
      <div className="flex justify-center gap-4 mt-10">
        <button 
          onClick={onGoBack}
          className="px-10 py-3 border border-gray-400 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          목록으로 이동
        </button>
        <button 
          onClick={onDelete}
          className="px-10 py-3 border border-red-400 text-red-500 rounded-lg font-medium hover:bg-red-50 transition"
        >
          시설 삭제
        </button>
        <button 
          onClick={onEdit}
          className="px-10 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          정보 수정
        </button>
      </div>
    </div>
  );
};

// 재사용 가능한 정보 항목 컴포넌트
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-gray-900 font-bold text-lg">{value || "-"}</p>
  </div>
);

export default FacilityDetail;