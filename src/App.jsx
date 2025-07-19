import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Main from "./pages/Main";
import Mypage from "./pages/mypage/Mypage";
import AppLayout from "./components/layout/AppLayout";
import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setIsLoggedIn(true);
      navigate("/");
    } else if (localStorage.getItem("accessToken")) {
      setIsLoggedIn(true);
    }
  }, [location, navigate]);

  return (
    <div className="appWrapper">
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        >
          <Route index element={<Main />} />
          <Route path="mypage" element={<Mypage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
