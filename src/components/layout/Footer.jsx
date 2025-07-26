import { Link } from "react-router-dom";
import "../../css/Footer.css";
import footerMainLogo from "../../assets/images/footerMainLogo.png";

function Footer({ isLoggedIn, setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div className="footer">
      <div>
        {isLoggedIn ? (
          <span onClick={handleLogout} className="footer-link">
            로그아웃
          </span>
        ) : (
          <span className="footer-link">로그인</span>
        )}{" "}
        |{" "}
        <Link to="/about" className="footer-link">
          서비스소개
        </Link>{" "}
        |{" "}
        <Link to="/level" className="footer-link">
          등급 소개
        </Link>{" "}
        |{" "}
        <Link to="/developers" className="footer-link">
          개발자 정보
        </Link>
      </div>
      <img src={footerMainLogo} alt="footer logo" />
    </div>
  );
}

export default Footer;
