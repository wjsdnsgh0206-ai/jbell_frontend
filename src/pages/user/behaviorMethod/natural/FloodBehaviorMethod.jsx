// src/pages/user/behaviorMethod/natural/FloodBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';

const FloodBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="FLOOD"
      category="자연재난"
      categoryPath="/behaviorMethod/earthquake"
    />
  );
};

export default FloodBehaviorMethod;