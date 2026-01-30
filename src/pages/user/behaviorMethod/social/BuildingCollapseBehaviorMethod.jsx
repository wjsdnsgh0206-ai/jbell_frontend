// src\pages\user\behaviorMethod\social\BuildingCollapseBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const BuildingCollapseBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="BUILDING_COLLAPSE"
      pageTitle="건축물붕괴"
      category="사회재난"
      categoryPath="/behaviorMethod/fire"
    />
  );
};

export default BuildingCollapseBehaviorMethod;