import { Routes, Route } from "react-router-dom";
import UserLayout from "@/layouts/user/UserLayout";
import { jyUserRoutes, disasterModal } from "@/routes/route-jy";
import { shUserRoutes } from "@/routes/route-sh";
import { ehUserRoutes } from "@/routes/route-eh";
import { mjUserRoutes } from "@/routes/route-mj";
import { jhUserRoutes } from "@/routes/route-jh";
import DisasterModalLayout from "@/layouts/user/disasterModal/DisasterModalLayout";

// import UserNoticeDetail from 
// ----- 라우트 진입점 파일 ----- //
// 프로젝트의 모든 라우트 경로를 이 파일에서 처리함. 
const AllRoutes = (props) => {
  // <Suspense fallback={<div>로딩중...</div>}>
  
  return (
    <Routes>
      <Route>
        {
          jyUserRoutes.map((route, idx) => <Route key={idx} path={route.path} element={<UserLayout {...props}>
            {route.element}
          </UserLayout>} />)
        }
      </Route>
      <Route>
        {
          disasterModal.map((route, idx) => <Route key={idx} path={route.path} element={
              <DisasterModalLayout {...props}>
                {route.element}
              </DisasterModalLayout> } />)
        }
      </Route>
      <Route>
        {
          ehUserRoutes.map((route, idx) => <Route key={idx} path={route.path} element={
              <UserLayout {...props}>
                {route.element}
              </UserLayout> } />)
        }
      </Route>
      
      <Route>
        {
          shUserRoutes.map((route, idx) => <Route key={idx} path={route.path} element={<UserLayout {...props}>
            {route.element}
          </UserLayout>} />)
        }
      </Route>

      <Route>
        {
          mjUserRoutes.map((route, idx) => <Route key={idx} path={route.path} element={<UserLayout {...props}>
            {route.element}
          </UserLayout>} />)
        }
      </Route>

      <Route>
        {
          jhUserRoutes.map((route, idx) => <Route key={idx} path={route.path} element={<UserLayout {...props}>
            {route.element}
          </UserLayout>} />)
        }
      </Route>

      
    </Routes>
  );
}

export default AllRoutes;
