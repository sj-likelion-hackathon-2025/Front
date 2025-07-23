import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Main from "./pages/Main";
import Mypage from "./pages/mypage/Mypage";
import AppLayout from "./components/layout/AppLayout";
import axios from "./utils/axios";
import Developers from "./pages/Developers";
import Level from "./pages/Level";
import About from "./pages/About";
import "./App.css";
function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const checkLogin = async () => {
      const params = new URLSearchParams(location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        try {
          const res = await axios.get("/members", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const { name, profileImageUrl } = res.data;
          const isNewUser = !name || name === "null" || name === "";
          localStorage.setItem("nickname", name ?? "");
          localStorage.setItem("profileImageUrl", profileImageUrl ?? "");
          setIsLoggedIn(true);
          setUserInfo({ name, profileImageUrl, isNewUser });
        } catch (err) {
          console.error("유저 정보 불러오기 실패", err);
        }
      } else if (localStorage.getItem("accessToken")) {
        setIsLoggedIn(true);
      }
    };

    checkLogin();
  }, [location]);

  return (
    <div className="appWrapper">
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              userInfo={userInfo}
            />
          }
        >
          <Route index element={<Main />} />
          <Route path="about" element={<About />} />
          <Route path="level" element={<Level />} />
          <Route path="developers" element={<Developers />} />
          <Route path="mypage" element={<Mypage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
