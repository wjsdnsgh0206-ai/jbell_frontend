// src\pages\user\behaviorMethod\life\CprBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const CprBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="CPR"
      category="생활안전"
      categoryPath="/behaviorMethod/firstAid"
    />
  );
};

export default CprBehaviorMethod;