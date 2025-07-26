import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginModal from "../modal/LoginModal";
import SignInModal from "../modal/SignInModal";
import MakeChallengeModal from "../modal/MakeChallengeModal";
import { Outlet } from "react-router-dom";
import instance from "../../utils/axios";

function AppLayout({ isLoggedIn, setIsLoggedIn, userInfo }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showMakeChallengeModal, setShowMakeChallengeModal] = useState(false);

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
      const res = await instance.get("/members");

      const { name, profileImageUrl } = res.data;

      setNickname(name ?? "");
      setProfileImage(profileImageUrl ?? "");
      localStorage.setItem("nickname", name ?? "");
      localStorage.setItem("profileImage", profileImageUrl ?? "");
      setIsLoggedIn(true);

      if (!name || name === "null" || name.trim() === "") {
        setShowSignInModal(true);
      } else {
        setShowSignInModal(false);
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
    const trimmedName = nickname.trim();
    if (!trimmedName) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      const res = await instance.get(
        `/members/check-name?name=${encodeURIComponent(trimmedName)}`,
        {
          validateStatus: () => true,
        }
      );

      if (res.status === 200) {
        alert("사용 가능한 닉네임입니다.");
      } else if (res.status === 409) {
        alert("이미 사용 중인 닉네임입니다.");
      } else if (res.status === 400) {
        alert("닉네임 형식이 올바르지 않습니다.");
      } else if (res.status === 401) {
        alert("인증되지 않은 사용자입니다.");
      } else {
        console.log("예상치 못한 응답:", res);
        alert("닉네임 중복 확인 실패: 서버 응답 상태 " + res.status);
      }
    } catch (err) {
      console.error("중복확인 실패", err);
      alert("서버 오류로 확인에 실패했습니다.");
    }
  };
  const submitSignUp = async () => {
    try {
      await instance.post("/members", {
        request: {
          name: nickname,
        },
        image: profileImage,
      });

      alert("회원가입이 완료되었습니다.");
      setShowSignInModal(false);
      window.location.href = "/";
    } catch (err) {
      console.error("회원가입 실패", err);
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
        onMakeChallengeClick={() => setShowMakeChallengeModal(true)} // 추가!
      />

      {showMakeChallengeModal && (
        <MakeChallengeModal onClose={() => setShowMakeChallengeModal(false)} />
      )}

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
