// src\pages\user\behaviorMethod\life\MountainSafetyBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const MountainSafetyBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="MOUNTAIN_SAFETY"
      pageTitle="산행안전사고"
      category="생활안전"
      categoryPath="/behaviorMethod/firstAid"
    />
  );
};

export default MountainSafetyBehaviorMethod;