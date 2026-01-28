// src\pages\user\behaviorMethod\life\FoodPoisoningBehaviorMethod.jsx
import BaseBehaviorMethodPage from '@/pages/user/behaviorMethod/BaseBehaviorMethodPage';
const FoodPoisoningBehaviorMethod = () => {
  return (
    <BaseBehaviorMethodPage 
      disasterType="FOOD_POISONING"
      pageTitle="식중독"
      category="생활안전"
      categoryPath="/behaviorMethod/firstAid"
    />
  );
};

export default FoodPoisoningBehaviorMethod;