// src\pages\user\behaviorMethod\life\ElevatorAccidentBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const ElevatorAccidentBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="ELEVATOR_ACCIDENT"
      pageTitle="승강기 안전사고"
      category="생활안전"
      categoryPath="/behaviorMethod/firstAid"
    />
  );
};

export default ElevatorAccidentBehaviorMethod;