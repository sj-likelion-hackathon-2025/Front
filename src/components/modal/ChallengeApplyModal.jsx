import ModalWrapper from "../common/ModalWrapper";
import ButtonWrapper from "../common/ButtonWrapper";
import { useState } from "react";
import instance from "../../utils/axios";

function ChallengeApplyModal({
  challengeId,
  currentParticipantCount,
  maxParticipantCount,
  onClose,
  onSuccess,
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (message.length < 20) {
      alert("신청 메시지를 20자 이상 입력해주세요.");
      return;
    }

    if (currentParticipantCount >= maxParticipantCount * 2) {
      alert("신청 인원이 초과되었습니다.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await instance.post(`/challenges/${challengeId}/applications`, { message });

      alert("챌린지 신청 완료!");
      onClose();
      onSuccess?.(); // ✅ 성공 시에만 최신 데이터 가져오기
    } catch (error) {
      if (error.response?.status === 409) {
        alert("이미 신청한 챌린지입니다.");
        onClose();
      } else if (error.response?.status === 401) {
        alert("로그인이 필요하거나 토큰이 만료되었습니다.");
      } else {
        alert("신청 중 오류가 발생했습니다.");
      }
      console.error(error);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <strong className="modalTitle">러닝 크루 참가 신청</strong>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="각오 한마디 (20자 이상)"
        style={{
          width: "90%",
          height: "100px",
          marginTop: "1rem",
          border: "1px solid #BBDEFA",
          borderRadius: "8px",
          padding: "12px",
          fontSize: "1rem",
          backgroundColor: "#E4F2FD",
          resize: "none",
          outline: "none",
        }}
      />
      <ButtonWrapper onClick={handleSubmit} className="mt-2">
        제출
      </ButtonWrapper>
    </ModalWrapper>
  );
}

export default ChallengeApplyModal;
