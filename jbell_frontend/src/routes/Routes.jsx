import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import UserLayout from "@/layouts/user/UserLayout";
import { jyUserRoutes } from "@/routes/route-jy";
import { ehUserRoutes } from "@/routes/route-eh";
import DisasterModalLayout from "@/layouts/user/disasterModal/DisasterModalLayout";
import { AccidentNews, Earthquake, Flood, HeavyRain,LandSlide, Typhoon, Wildfire } from "@/components/user/disaster";

// ----- 라우트 진입점 파일 ----- //
// 프로젝트의 모든 라우트 경로를 이 파일에서 처리함. 
const AllRoutes = () => (
  // <Suspense fallback={<div>로딩중...</div>}>
  <Suspense>
    <Routes>
      {/* JEH 라우트 (EH - Login, Mypage, Signup) */}
      <Route  element={<UserLayout />}>
      {ehUserRoutes.map((route, idx) => (
        <Route key={idx} {...route} /> 
      ))}
      </Route>



      <Route path="/" element={<UserLayout />}>
        {jyUserRoutes.map((route, idx) => (
          <Route key={idx} {...route} />
        ))}

        


        {/* 모달 전용 경로 */}
        <Route path="disaster" element={<DisasterModalLayout />}>
          <Route path="accident" element={<AccidentNews />} />
          <Route path="earthquake" element={<Earthquake />} />
          <Route path="flood" element={<Flood />} />
          <Route path="heavyRain" element={<HeavyRain />} />
          <Route path="landSlide" element={<LandSlide />} />
          <Route path="typhoon" element={<Typhoon />} />
          <Route path="wildfire" element={<Wildfire />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default AllRoutes;
