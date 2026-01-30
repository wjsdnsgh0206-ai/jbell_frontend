// src\pages\user\behaviorMethod\social\RailwaySubwayAccidentBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const RailwaySubwayAccidentBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="RAILWAY_SUBWAY_ACCIDENT"
      pageTitle="철도, 지하철 사고"
      category="사회재난"
      categoryPath="/behaviorMethod/fire"
    />
  );
};

export default RailwaySubwayAccidentBehaviorMethod;