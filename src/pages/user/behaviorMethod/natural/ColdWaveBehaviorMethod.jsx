// src/pages/user/behaviorMethod/natural/ColdWaveBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const ColdWaveBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="COLDWAVE"
      category="자연재난"
      categoryPath="/behaviorMethod/coldWave"
    />
  );
};

export default ColdWaveBehaviorMethod;