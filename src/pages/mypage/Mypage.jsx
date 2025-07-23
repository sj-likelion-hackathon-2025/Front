"use client";

import { useEffect, useState } from "react";
import "../../css/Mypage.css";
import instance from "../../utils/axios";

function Mypage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/members");
      setProfileData(response.data);
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
            src={profileData?.profileImageUrl || "/default-profile.png"}
            alt="프로필 이미지"
            className="profile-image"
          />
        </div>

        <div className="profile-info">
          <div className="name-section">
            <span className="name">{profileData?.name}</span>
            <span className="grade-text">님 등급은</span>
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
        <button className="primary-btn">계정 정보 변경</button>
        <button className="secondary-btn">참여 내역</button>
        <button className="secondary-btn">결제 정보</button>
        <button className="secondary-btn">구매 내역</button>
      </div>

    </div>
  );
}

export default Mypage;
