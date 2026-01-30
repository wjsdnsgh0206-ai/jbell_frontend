// src/pages/user/behaviorMethod/natural/EarthquakeBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const EarthquakeBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="EARTHQUAKE" // 혹은 DB에 저장된 실제 코드 (예: NATURAL_EARTHQUAKE)
      category="자연재난"
      categoryPath="/behaviorMethod/earthquake"
    />
  );
};

export default EarthquakeBehaviorMethod;
