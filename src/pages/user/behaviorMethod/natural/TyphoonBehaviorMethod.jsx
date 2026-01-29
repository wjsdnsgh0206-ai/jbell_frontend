// src/pages/user/behaviorMethod/natural/EarthquakeBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const TyphoonBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="TYPHOON"
      category="자연재난"
      categoryPath="/behaviorMethod/earthquake"
    />
  );
};

export default TyphoonBehaviorMethod;