//신청인원 조회
import React, { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import instance from "../../utils/axios";
import "../../css/ApplicantsPage.css";

function ApplicantListModal({ challengeId, onClose }) {
  const [applicants, setApplicants] = useState([]);

  const [error, setError] = useState(""); // 'unauthorized' | 'notLeader' | 'serverError'

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.warn("⛔️ 토큰 없음 - 신청자 목록 요청 차단");
        setError("unauthorized");
        return;
      }

      try {
        const response = await instance.get(
          `/challenges/${challengeId}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { responses, challengeInfo } = response.data;

        // 리더 여부 확인
        if (!challengeInfo?.isLeader) {
          setError("notLeader");
          return;
        }

        setApplicants(responses || []);
      } catch (err) {
        console.error(
          "❌ 신청자 목록 불러오기 실패",
          err.response?.data || err
        );
        if (err.response?.status === 401) {
          setError("unauthorized");
        } else {
          setError("serverError");
        }
      }
    };

    fetchApplicants();
  }, [challengeId]);

  const renderErrorMessage = () => {
    switch (error) {
      case "unauthorized":
        return "로그인이 필요하거나 인증되지 않은 사용자입니다.";
      case "notLeader":
        return "챌린지 생성자만 신청자 목록을 볼 수 있습니다.";
      case "serverError":
        return "신청자 목록을 불러오는 데 실패했습니다.";
      default:
        return null;
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div style={{ padding: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          신청자 목록
        </h2>

        {/* 에러 메시지 */}
        {error ? (
          <p style={{ color: "red", fontWeight: "bold", fontSize: "1rem" }}>
            {renderErrorMessage()}
          </p>
        ) : applicants.length === 0 ? (
          <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
            신청자가 없습니다.
          </p>
        ) : (
          <ul className="applicant-list">
            {applicants.map((user, index) => (
              <li key={index} className="applicant-item">
                <img
                  src={user.profileImageUrl}
                  alt="profile"
                  className="applicant-img"
                />
                <div className="applicant-info">
                  <strong>{user.name}</strong>
                  <p>{user.message}</p>
                </div>
                <span className={`badge ${user.grade}`}>{user.grade}</span>
                <div className="action-buttons">
                  <button className="approve-btn">승인</button>
                  <button className="reject-btn">거절</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ModalWrapper>
  );
}

export default ApplicantListModal;
