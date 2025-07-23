import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginModal from "../modal/LoginModal";
import SignInModal from "../modal/SignInModal";
import { Outlet } from "react-router-dom";
import axios from "../../utils/axios";

function AppLayout({ isLoggedIn, setIsLoggedIn, userInfo }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    if (userInfo) {
      console.log("유저 정보:", userInfo);
      setNickname(userInfo.name ?? "");
      setProfileImage(userInfo.profileImageUrl ?? "");
      setShowSignInModal(true); 
    }
  }, [userInfo]);

  const handleLoginSuccess = async () => {
    try {
      const res = await axios.get("/members", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const { name, profileImageUrl } = res.data;
      setNickname(name ?? "");
      setProfileImage(profileImageUrl ?? "");

      localStorage.setItem("nickname", name ?? "");
      localStorage.setItem("profileImage", profileImageUrl ?? "");

      setIsLoggedIn(true);

      if (!name || name === "null" || name === "") {
        setShowSignInModal(true);
      }
    } catch (err) {
      console.error("로그인 후 사용자 정보 조회 실패", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfileImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const checkDuplicate = async () => {
    try {
      const res = await axios.get(`/members/check-name?name=${nickname}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        validateStatus: (status) => status === 204 || status === 409, 
      });

      if (res.status === 204) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch {
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const submitSignUp = async () => {
    try {
      await axios.post(
        "/members",
        {
          request: { name: nickname },
          image: profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("회원가입이 완료되었습니다.");
      setShowSignInModal(false);
      window.location.href = "/";
    } catch {
      alert("회원가입 실패");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
      />

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {showSignInModal && (
        <SignInModal
          onClose={() => setShowSignInModal(false)}
          profileImage={profileImage}
          name={nickname}
          handleImageChange={handleImageChange}
          handleNameChange={(e) => setNickname(e.target.value)}
          checkDuplicate={checkDuplicate}
          goHome={submitSignUp}
        />
      )}

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

export default AppLayout;
