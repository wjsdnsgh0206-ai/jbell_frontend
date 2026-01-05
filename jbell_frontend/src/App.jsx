import "./App.css";
import AllRoutes from "@/routes/Routes";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";

function App() {
  return (
    <>
      <AllRoutes />
      {/* 화면 우측 하단에 고정될 Top 버튼 */}
      <ScrollToTopButton />
    </>
  );
}

export default App;