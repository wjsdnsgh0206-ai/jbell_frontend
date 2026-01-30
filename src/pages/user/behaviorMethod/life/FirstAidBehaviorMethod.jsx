// src\pages\user\behaviorMethod\life\FirstAidBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const FirstAidBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="FIRST_AID"
      pageTitle="응급처치"
      category="생활안전"
      categoryPath="/behaviorMethod/firstAid"
    />
  );
};

export default FirstAidBehaviorMethod;