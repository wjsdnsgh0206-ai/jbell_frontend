import React from 'react';
import PolicyPageEditor from '@/pages/admin/contents/safetyPolicy/PolicyPageEditor';

const UrbanPlanManagement = () => {
  // 사용자 페이지와 동일한 탭 구성
  const tabs = [
    { id: 0, label: "개요" },
    { id: 1, label: "안전관리기구" },
    { id: 2, label: "재난안전대책본부" },
  ];

  return (
    <PolicyPageEditor 
      pageTitle="도시안전기본계획 관리"
      policyType="MASTER_PLAN"
      tabs={tabs}
    />
  );
};

export default UrbanPlanManagement;