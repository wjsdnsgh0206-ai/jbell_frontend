// src/pages/user/behaviorMethod/natural/LandslideBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const LandslideBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="LANDSLIDE"
      pageTitle="산사태"
      category="자연재난"
      categoryPath="/behaviorMethod/earthquake"
    />
  );
};

export default LandslideBehaviorMethod;