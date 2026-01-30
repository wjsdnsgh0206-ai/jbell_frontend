// src\pages\user\behaviorMethod\social\ElectricityGasAccidentBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const ElectricityGasAccidentBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="ELECTRICITY_GAS_ACCIDENT"
      category="사회재난"
      categoryPath="/behaviorMethod/fire"
    />
  );
};

export default ElectricityGasAccidentBehaviorMethod;