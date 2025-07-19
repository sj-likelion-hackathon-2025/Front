import "../../css/Footer.css";
import footerMainLogo from "../../assets/images/footerMainLogo.png";
function Footer({ isLoggedIn, setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); 
    setIsLoggedIn(false);
  };

  return (
    <div className="footer">
      <div>
        {isLoggedIn ? (
          <span onClick={handleLogout}>로그아웃</span>
        ) : (
          <span>로그인</span>
        )}{" "}
        | 서비스소개 | 등급 소개 | 개발자 정보
      </div>
      <img src={footerMainLogo} />
    </div>
  );
}

export default Footer;
