import React from 'react';
import PolicyPageEditor from '@/pages/admin/contents/safetyPolicy/PolicyPageEditor';

const EarthquakeManagement = () => {
  const tabs = [
    { id: 0, label: "지진 발생 추이" },
    { id: 1, label: "지진방재 종합대책" },
    { id: 2, label: "행동요령" }, // 필요시 행동요령 탭 포함
  ];

  return (
    <PolicyPageEditor 
      pageTitle="[재난별] 지진 안전정책 관리"
      policyType="EARTHQUAKE"
      tabs={tabs}
    />
  );
};

export default EarthquakeManagement;