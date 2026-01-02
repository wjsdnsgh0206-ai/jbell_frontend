import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div
      className="min-h-screen flex flex-col w-full relative bg-white"
      data-model-id="11141:18786" 
    >
      <UserHeader />
        <Outlet />
      <UserFooter />
    </div>
  );
};

export default UserLayout;
