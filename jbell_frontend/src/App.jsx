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
import FAQPage from './pages/user/CustomerService/FAQPage';
import FAQDetailPage from './pages/user/CustomerService/FAQDetailPage';
import QnAListPage from './pages/user/CustomerService/QnAListPage';
import QnADetailPage from './pages/user/CustomerService/QnADetailPage';
import { Routes, Route } from 'react-router-dom';


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
        
        
        <Route path="/faq" element={<FAQPage/>} />
        <Route path="/faq/:id" element={<FAQDetailPage/>} />
        <Route path="/qna" element={<QnAListPage/>} />
         <Route path="/qna/:id" element={<QnADetailPage/>} />
      </Route>
    </Routes>
    
  )
}

export default App;
