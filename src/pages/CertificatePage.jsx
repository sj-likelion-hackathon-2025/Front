import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/CertificatePage.css";
import instance from "../utils/axios";

function CertificatePage() {
  const { challengeId } = useParams();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificateData();
  }, [challengeId]);

  const fetchCertificateData = async () => {
    try {
      const res = await instance.get(`/challenges/${challengeId}/certificate`);
      setCertificateData(res.data);
    } catch (err) {
      console.error("인증서 정보 불러오기 실패", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="certificate-wrapper">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="certificate-wrapper">
        <div className="error">인증서를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="certificate-wrapper">
      <header className="certificate-header">
        <h2>챌린지 성공 인증서</h2>
        <span className="bell">🔔</span>
      </header>

      <div className="certificate-box">
        <h3 className="challenge-title">{certificateData.challengeTitle}</h3>

        <div className="info-row">
          <span>시작일</span>
          <span>{certificateData.startDate}</span>
        </div>
        <div className="info-row">
          <span>종료일</span>
          <span>{certificateData.endDate}</span>
        </div>
        <div className="info-row">
          <span>챌린저</span>
          <span className="highlight">{certificateData.memberName}</span>
        </div>

        <div className="info-row">
          <span>달성률</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${certificateData.achievementRate}%` }}
            ></div>
          </div>
          <span className="percent">{certificateData.achievementRate}%</span>
        </div>

        <p className="description">
          위 챌린저는 <strong>{certificateData.challengeTitle}에 성실하게 임하여</strong>
          <br />
          <strong>{certificateData.achievementRate}% 수준으로 달성</strong>했기에 본 인증서를 수여함.
        </p>

        <div className="brand">
          Flow<span>Mate</span>
        </div>
      </div>

      <div className="action-buttons">
        <button title="이미지 저장">🖼</button>
        <button title="SNS 공유">📤</button>
      </div>

      <footer className="certificate-footer">
        로그아웃 | 서비스소개 | 등급소개 | 개발자 정보
        <br />
        <strong>FlowMate</strong>
      </footer>
    </div>
  );
}

export default CertificatePage;
