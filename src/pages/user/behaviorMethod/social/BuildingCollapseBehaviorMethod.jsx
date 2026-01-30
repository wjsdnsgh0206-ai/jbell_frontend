// src\pages\user\behaviorMethod\social\BuildingCollapseBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const BuildingCollapseBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="BUILDING_COLLAPSE"
      category="사회재난"
      categoryPath="/behaviorMethod/fire"
    />
  );
};

export default BuildingCollapseBehaviorMethod;