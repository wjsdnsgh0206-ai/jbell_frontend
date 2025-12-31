import './App.css';
import UserLayout from './layouts/user/UserLayout';
import UserPageMain from './pages/user/UserPageMain';
import UserMap from './pages/user/UserMap';
import UserFacilityDetail from './pages/user/UserFacilityDetail';
import UserOpenSpaceLi from './pages/user/UserOpenSpaceLi';
import UserDisasterModal from './pages/user/UserDisasterModal';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserPageMain />} />
        <Route path="/map" element={<UserMap />} />
        <Route path="/UserFacilityDetail" element={<UserFacilityDetail/>}/>
        <Route path="/UserOpenSpaceLi" element={<UserOpenSpaceLi/>}/>
        <Route path="/UserDisasterModal" element={<UserDisasterModal/>}/>
      </Route>
    </Routes>
    
  )
}

export default App;
