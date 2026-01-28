// src/pages/user/behaviorMethod/natural/EarthquakeBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const EarthquakeBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="EARTHQUAKE"
      pageTitle="지진"
      category="자연재난"
      categoryPath="/behaviorMethod/earthquake"
    />
  );
};

export default EarthquakeBehaviorMethod;

