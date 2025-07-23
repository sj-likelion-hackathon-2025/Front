import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Navbar.css";
import LoginModal from "../modal/LoginModal";
import navHamburgerLogo from "../../assets/images/navHamburgerLogo.png";
import navBellIconOn from "../../assets/images/navBellIconOn.png";

function Navbar({ isLoggedIn, onLoginClick, onMakeChallengeClick }) {
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className="navbar">
        <img
          src={navHamburgerLogo}
          alt="menu"
          onClick={handleHamburgerClick}
          className="navbar-icon"
        />

        {!isLoggedIn ? (
          <div onClick={onLoginClick}>로그인</div>
        ) : (
          <img src={navBellIconOn} className="navbar-icon" alt="알림" />
        )}
      </div>

      {isLoginModal && <LoginModal onClose={() => setIsLoginModal(false)} />}

      {isMenuOpen && (
        <div className="nav-drawer">
          <button className="close-drawer" onClick={() => setIsMenuOpen(false)}>
            X
          </button>
          <ul>
            <li
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              챌린지 홈
            </li>
            <li
              onClick={() => {
                navigate("/mypage");
                setIsMenuOpen(false);
              }}
            >
              마이페이지
            </li>
            <li
              onClick={() => {
                onMakeChallengeClick();
                setIsMenuOpen(false);
              }}
            >
              챌린지 만들기
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
