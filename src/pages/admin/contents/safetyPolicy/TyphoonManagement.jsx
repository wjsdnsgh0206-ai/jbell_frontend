import React from 'react';
import PolicyPageEditor from '@/pages/admin/contents/safetyPolicy/PolicyPageEditor';

const TyphoonManagement = () => {
  const tabs = [
    { id: 0, label: "기상특보 기준" },
    { id: 1, label: "주요 대책" },
    { id: 2, label: "침수예상도" },
  ];

  return (
    <PolicyPageEditor 
      pageTitle="[재난별] 태풍·호우 안전정책 관리"
      policyType="TYPHOON"
      tabs={tabs}
    />
  );
};

export default TyphoonManagement;