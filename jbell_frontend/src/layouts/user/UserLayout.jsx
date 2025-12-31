import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  // <div className="min-h-screen bg-[#f8f9fb] font-sans text-gray-900">
  // <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col"></div>
  return (
    <div
      className="min-h-screen inline-flex flex-col items-center relative bg-white"
      data-model-id="11141:18786" 
    >
      <UserHeader />
      
        <Outlet />
      <UserFooter />
    </div>
  );
};

export default UserLayout;