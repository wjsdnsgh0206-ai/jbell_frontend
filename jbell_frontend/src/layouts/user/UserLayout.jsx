import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import { Suspense } from "react";

const UserLayout = ({ children }) => {
  return (
    <Suspense>
      <div
        className="min-h-screen flex flex-col w-full relative bg-white"
        data-model-id="11141:18786" 
      >
        <UserHeader />
          {children}
        <UserFooter />
      </div>
    </Suspense>
  );
};

export default UserLayout;
