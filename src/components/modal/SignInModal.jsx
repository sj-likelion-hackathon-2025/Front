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

      <div className="profileContainer">
        <div className="profileImageWrapper">
          <img
            src={profileImage || "https://via.placeholder.com/150"}
            className="profileImage"
            alt="프로필"
          />

          <label htmlFor="profileInput" className="editIcon">
            ✎
          </label>
          <input
            type="file"
            id="profileInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="inputGroupWithButton">
        <div className="inputWithButtonWrapper">
          <InputWrapper
            value={name}
            onChange={handleNameChange}
            placeholder="닉네임 입력"
            size="md"
          />
          <button className="insideCheckBtn" onClick={checkDuplicate}>
            중복확인
          </button>
        </div>
      </div>

      <ButtonWrapper type="default" className="fullWidthBtn" onClick={goHome}>
        홈으로
      </ButtonWrapper>
    </ModalWrapper>
  );
}

export default SignInModal;
