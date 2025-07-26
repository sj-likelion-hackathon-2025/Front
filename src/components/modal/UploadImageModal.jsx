//인증을 위한 업로드 모달
import { useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import "../../css/ImageUploadModal.css";

function ImageUploadModal({
  userName = "오다현",
  userLevel = "Rookie",
  onClose,
  onSubmit,
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      onSubmit(selectedImage);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="image-upload-modal">
        <div className="user-info">
          <strong>{userName}</strong>
          <span className="level">{userLevel}</span>
        </div>

        <div className="upload-box" onClick={handleImageClick}>
          {selectedImage ? (
            <img src={selectedImage} alt="Preview" className="preview-image" />
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p>클릭해서 업로드</p>
            </>
          )}
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="button-group">
          <button className="cancel" onClick={onClose}>
            취소
          </button>
          <button className="submit" onClick={handleSubmit}>
            제출
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default ImageUploadModal;
