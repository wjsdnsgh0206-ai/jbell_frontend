// src\pages\user\behaviorMethod\life\ElevatorAccidentBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const ElevatorAccidentBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="ELEVATOR_ACCIDENT"
      category="생활안전"
      categoryPath="/behaviorMethod/firstAid"
    />
  );
};

export default ElevatorAccidentBehaviorMethod;