import ModalWrapper from "../common/ModalWrapper";
import kakaoLogin from "../../assets/images/kakaoLogin.png";

function LoginModal({ onClose }) {
  const handleKakaoLogin = () => {
    window.location.href =
      "https://api.kwaktaepung.shop/oauth2/authorization/kakao";
  };

  return (
    <ModalWrapper onClose={onClose}>
      <strong className="modalTitle">Login</strong>
      <img src={kakaoLogin} onClick={handleKakaoLogin} />
    </ModalWrapper>
  );
}

export default LoginModal;
