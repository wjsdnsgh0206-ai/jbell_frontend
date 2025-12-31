import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans text-gray-900">
      <UserHeader />
        <Outlet />
      <UserFooter />
    </div>
  );
};

export default UserLayout;