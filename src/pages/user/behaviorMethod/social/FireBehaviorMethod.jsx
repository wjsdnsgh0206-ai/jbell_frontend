// src\pages\user\behaviorMethod\social\FireBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const FireBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="FIRE"
      pageTitle="화재"
      category="사회재난"
      categoryPath="/behaviorMethod/fire"
    />
  );
};

export default FireBehaviorMethod;