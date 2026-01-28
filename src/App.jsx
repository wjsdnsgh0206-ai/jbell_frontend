import "./App.css";
import AllRoutes from "@/routes/Routes";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
// 1. AuthProvider 임포트 (파일 경로가 contexts/AuthContext.js 인 경우)
import { AuthProvider } from "@/contexts/AuthContext"; 

function App() {
  return (
    // 2. AuthProvider로 전체 앱을 감싸줍니다.
    <AuthProvider>
      <AllRoutes />
      {/* 화면 우측 하단에 고정될 Top 버튼 */}
      <ScrollToTopButton />
    </AuthProvider>
  );
}

export default App;