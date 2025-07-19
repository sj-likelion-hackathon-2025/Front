import { useState } from "react";
import "../../css/Navbar.css";
import LoginModal from "../modal/LoginModal";
import navHamburgerLogo from "../../assets/images/navHamburgerLogo.png";
import navBellIcon from "../../assets/images/navBellIcon.png";

function Navbar({ isLoggedIn }) {
  const [isLoginModal, setIsLoginModal] = useState(false);

  return (
    <div className="navbar">
      <img src={navHamburgerLogo} />
      {!isLoggedIn ? (
        <div onClick={() => setIsLoginModal(true)}>로그인</div>
      ) : (
        <img src={navBellIcon} />
      )}
      {isLoginModal && <LoginModal onClose={() => setIsLoginModal(false)} />}
    </div>
  );
}

export default Navbar;
