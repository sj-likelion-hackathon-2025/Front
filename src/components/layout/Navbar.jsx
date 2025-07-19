import { useState } from "react";
import "../../css/Navbar.css";
import LoginModal from "../modal/LoginModal";
import navHamburgerLogo from "../../assets/images/navHamburgerLogo.png";
import navBellIconOn from "../../assets/images/navBellIconOn.png"; 
import navBellIconOff from "../../assets/images/navBellIconOff.png";

function Navbar({ isLoggedIn }) {
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isBellOn, setIsBellOn] = useState(false);
  const handleBellClick = () => {
    setIsBellOn((prev) => !prev);
  };
  return (
    <div className="navbar">
      <img src={navHamburgerLogo} />
      {!isLoggedIn ? (
        <div onClick={() => setIsLoginModal(true)}>로그인</div>
      ) : (
        <img
          src={isBellOn ? navBellIconOn : navBellIconOff}
          onClick={handleBellClick}
        />
      )}
      {isLoginModal && <LoginModal onClose={() => setIsLoginModal(false)} />}
    </div>
  );
}

export default Navbar;
