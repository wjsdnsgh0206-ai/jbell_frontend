// src/pages/user/behaviorMethod/natural/HeavyRainBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const HeavyRainBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="HEAVY_RAIN"
      pageTitle="호우"
      category="자연재난"
      categoryPath="/behaviorMethod/earthquake"
    />
  );
};

export default HeavyRainBehaviorMethod;