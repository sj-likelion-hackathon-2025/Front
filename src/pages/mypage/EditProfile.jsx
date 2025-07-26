import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Mypage.css";
import instance from "../../utils/axios";

function EditProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedImage, setEditedImage] = useState("");

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/members");
      setProfileData(response.data);
      setEditedName(response.data.name || "");
      setEditedImage(response.data.profileImageUrl || "");
    } catch (err) {
      console.error("프로필 정보 불러오기 실패", err);
      setError("프로필 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      await instance.post("/members", {
        request: { name: editedName },
        image: editedImage,
      });
      alert("프로필이 성공적으로 수정되었습니다.");
      setIsEditing(false);
      fetchProfileData();
    } catch (err) {
      console.error("프로필 수정 실패", err);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="mypage-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="profile-section">
        <div className="profile-image-container">
          <img
            src={editedImage || profileData?.profileImageUrl || "/default-profile.png" || undefined}
            alt="프로필 이미지"
            className="profile-image"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: "10px" }}
            />
          )}
        </div>

        <div className="profile-info">
          <div className="name-section">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="name-input"
              />
            ) : (
              <>
                <span className="name">{profileData?.name}</span>
                <span className="grade-text">님 등급은</span>
              </>
            )}
          </div>

          <div className="grade-section">
            <span className="grade">{profileData?.grade}</span>
            <span className="info-icon">ℹ️</span>
          </div>

          <div className="point-section">
            <span className="point-badge">P {profileData?.point}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {isEditing ? (
          <>
            <button className="primary-btn" onClick={handleSave}>
              저장
            </button>
            <button className="secondary-btn" onClick={() => setIsEditing(false)}>
              취소
            </button>
          </>
        ) : (
          <>
            <button
              className="primary-btn"
              onClick={() => setIsEditing(true)}
            >
              프로필 수정
            </button>
            <button className="secondary-btn" onClick={() => navigate("/mypage")}>
              뒤로가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
