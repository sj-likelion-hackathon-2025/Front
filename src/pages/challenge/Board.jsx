import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../utils/axios";
import "../../css/Board.css";

function Board() {
  const { challengeId } = useParams(); 
  const [participants, setParticipants] = useState([]);
  const [challengeInfo, setChallengeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallengeInfo();
    fetchParticipants();
  }, [challengeId]);

  const fetchChallengeInfo = async () => {
    try {
      const res = await instance.get(`/challenges/${challengeId}`);
      setChallengeInfo(res.data);
    } catch (err) {
      console.error("챌린지 정보 불러오기 실패", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await instance.get(
        `/challenges/${challengeId}/certifications/members`
      );
      setParticipants(res.data);
    } catch (err) {
      console.error("인증 현황 불러오기 실패", err);
    }
  };

  const handleApproval = async (certificationId, approved) => {
    try {
      await instance.patch(`/challenges/${certificationId}/approval`, {
        approved,
      });
      fetchParticipants(); 
    } catch (err) {
      console.error("인증 승인/거절 실패", err);
    }
  };

  if (loading) {
    return (
      <div className="board-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="board-container">
      <header className="board-header">
        <span className="back" onClick={() => window.history.back()}>&lt;</span>
        <h2>{challengeInfo?.title || "챌린지"} 게시판</h2>
        <span className="alarm">🔔</span>
      </header>

      {challengeInfo && (
        <div className="challenge-info">
          <div className="challenge-dates">
            {challengeInfo.startDate} ~ {challengeInfo.endDate}
          </div>
          <div className="challenge-participants">
            참여자: {challengeInfo.currentParticipantCount}/{challengeInfo.maxParticipantCount}명
          </div>
          <div className="challenge-description">
            {challengeInfo.introduction}
          </div>
          <div className="challenge-rule">
            <strong>인증 규칙:</strong> {challengeInfo.rule}
          </div>
        </div>
      )}

      <section className="status-list">
        <h4>오늘의 인증 현황 ({participants.length}명)</h4>
        <ul>
          {participants.map((p) => (
            <li key={p.memberId} className="status-item">
              <div className="profile-circle">
                <img src={p.profileImageUrl} alt="profile" />
              </div>
              <div className="user-info">
                <div>
                  <strong>{p.name}</strong>
                  <span className={`badge ${p.level.toLowerCase()}`}>
                    {p.level}
                  </span>
                </div>
                <small>{`참여율 ${p.attendanceRate}%`}</small>
              </div>

              {p.certificationStatus === "검토" ? (
                <div className="btn-group">
                  <button
                    className="approve-btn"
                    onClick={() => handleApproval(p.certificationId, true)}
                  >
                    승인
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleApproval(p.certificationId, false)}
                  >
                    거절
                  </button>
                </div>
              ) : (
                <button className={`status-button ${p.certificationStatus}`}>
                  {p.certificationStatus}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Board;
