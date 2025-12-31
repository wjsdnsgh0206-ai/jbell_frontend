import './App.css';
import UserLayout from './layouts/user/UserLayout';
import UserPageMain from './pages/user/UserPageMain';
import UserMap from './pages/user/UserMap';
import { Routes, Route } from 'react-router-dom';
import FAQPage from './pages/user/FAQPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserPageMain />} />
        <Route path="/map" element={<UserMap />} />
        <Route path="/faq" element={<FAQPage/>} />
      </Route>
    </Routes>
    
  )
}

export default App;
