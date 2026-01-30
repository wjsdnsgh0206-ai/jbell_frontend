// src\pages\user\behaviorMethod\life\TrafficAccidentBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const TrafficAccidentBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="TRAFFIC_ACCIDENT"
      category="생활안전"
      categoryPath="/behaviorMethod/firstAid"
    />
  );
};

export default TrafficAccidentBehaviorMethod;