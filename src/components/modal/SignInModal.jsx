import React from "react";
import ModalWrapper from "../common/ModalWrapper";
import "../../css/SignInModal.css";
import InputWrapper from "../common/InputWrapper";
import ButtonWrapper from "../common/ButtonWrapper";

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
        <InputWrapper
          value={name}
          onChange={handleNameChange}
          placeholder="닉네임 입력"
        />
        <ButtonWrapper variant="primary" onClick={checkDuplicate}>
          중복확인
        </ButtonWrapper>
      </div>
      <ButtonWrapper variant="primary" onClick={goHome}>
        홈으로
      </ButtonWrapper>
    </ModalWrapper>
  );
}

export default SignInModal;
