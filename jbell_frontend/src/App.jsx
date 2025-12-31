import './App.css';
import UserLayout from './layouts/user/UserLayout';
import UserPageMain from './pages/user/UserPageMain';
import UserMap from './pages/user/UserMap';
import FAQPage from './pages/user/FAQPage';
import FAQDetailPage from './pages/user/FAQDetailPage';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserPageMain />} />
        <Route path="/map" element={<UserMap />} />
        <Route path="/faq" element={<FAQPage/>} />
        <Route path="/faqdetail" element={<FAQDetailPage/>} />
      </Route>
    </Routes>
    
  )
}

export default App;
