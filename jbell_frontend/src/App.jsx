import './App.css';
import UserLayout from './layouts/user/UserLayout';
import UserPageMain from './pages/user/UserPageMain';
import UserMap from './pages/user/UserMap';
import UserFacilityDetail from './pages/user/UserFacilityDetail';
import UserOpenSpaceLi from './pages/user/UserOpenSpaceLi';
// import UserDisasterModal from './pages/user/UserDisasterModal';
import DisasterModalLayout from './layouts/user/disasterModal/DisasterModalLayout';
import AccidentNews from './components/user/disasterModal/AccidentNews';
import Earthquake from './components/user/disasterModal/Earthquake';
import { Routes, Route } from 'react-router-dom';
/** 전은호 import */

import FindIdCheck from './pages/user/login/FindIdCheck';
import FindIdShow from './pages/user/login/FindIdShow';
import FindPwChange from './pages/user/login/FindPwChange';
import FindPwCheck from './pages/user/login/FindPwCheck';
import IdPwLogin from './pages/user/login/IdPwLogin';
import LoginMain from './pages/user/login/LoginMain';
import EditProfile from './pages/user/mypage/EditProfile';
import EditProfileCheck from './pages/user/mypage/EditProfileCheck';
import MyInquiryList from './pages/user/mypage/MyInquiryList';
import MyProfile from './pages/user/mypage/MyProfile';
import WithdrawalModal from './pages/user/mypage/WithdrawalModal';
import SignupAgreement from './pages/user/signup/SignupAgreement';
import SignupForm from './pages/user/signup/SignupForm';
import SignupSuccess from './pages/user/signup/SignupSuccess';



function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserPageMain />} />
        <Route path="/map" element={<UserMap />} />
        <Route path="/UserFacilityDetail" element={<UserFacilityDetail/>}/>
        <Route path="/UserOpenSpaceLi" element={<UserOpenSpaceLi/>}/>
        {/* <Route path="/UserDisasterModal" element={<UserDisasterModal/>}/> */}

        {/* 모달 전용 경로 */}
          <Route path="disaster" element={<DisasterModalLayout />}>
      <Route path="accident" element={<AccidentNews />} />
      <Route path="earthquake" element={<Earthquake />} />
    </Route>
      </Route>
    </Routes>
    
  )
}

export default App;
