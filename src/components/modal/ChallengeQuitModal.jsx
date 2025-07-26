import ModalWrapper from "../common/ModalWrapper";
import instance from "../../utils/axios";

function ChallengeQuitModal({ challengeId, onClose, onSuccess }) {
  const handleQuit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await instance.delete(`/challenges/${challengeId}/participants`);

      alert("챌린지를 성공적으로 포기했습니다.");
      onSuccess?.(); // 예: 목록 새로고침
      onClose();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요하거나 토큰이 만료되었습니다.");
      } else {
        alert("챌린지 포기 중 오류가 발생했습니다.");
      }
      console.error(err);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginBottom: "0.5rem",
          }}
        >
          챌린지 포기하기
        </h3>
        <p
          style={{
            color: "#E53935",
            fontSize: "0.95rem",
            marginBottom: "1.5rem",
          }}
        >
          정말 포기하고 나가시겠습니까? 한 번 포기하면, 이 챌린지에 계속 참여할
          수 없습니다.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #1976D2",
              backgroundColor: "white",
              color: "#1976D2",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            onClick={handleQuit}
            style={{
              backgroundColor: "#E53935",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            포기
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default ChallengeQuitModal;
