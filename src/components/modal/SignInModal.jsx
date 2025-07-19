import React from "react";
import ModalWrapper from "../common/ModalWrapper";
import "../../css/SignInModal.css";

function SignInModal({
  onClose,
  profileImage,
  name,
  handleImageChange,
  handleNameChange,
  checkDuplicate,
  goHome,
}) {
  return (
    <ModalWrapper onClose={onClose}>
      <strong className="modalTitle">Sign In</strong>
      <div className="profile">
        <img src={profileImage} />
        <label htmlFor="profileInput">✎</label>
        <input
          type="file"
          id="profileInput"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
      <div className="inputWrapper">
        <input type="text" value={name} onChange={handleNameChange} />
        <button onClick={checkDuplicate}>중복확인</button>
      </div>
      <button className="homeButton" onClick={goHome}>
        홈으로
      </button>
    </ModalWrapper>
  );
}

export default SignInModal;
