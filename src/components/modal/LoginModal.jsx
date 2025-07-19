import ModalWrapper from "../common/ModalWrapper";
import kakaoLogin from "../../assets/images/kakaoLogin.png";

function LoginModal({ onClose }) {
  const handleKakaoLogin = () => {
    window.location.href =
      "http://54.208.108.57:8080/oauth2/authorization/kakao";
  };

  return (
    <ModalWrapper onClose={onClose}>
      <strong className="modalTitle">Login</strong>
      <img src={kakaoLogin} onClick={handleKakaoLogin} />
    </ModalWrapper>
  );
}

export default LoginModal;
