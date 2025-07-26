//챌린지 만들기 모달
import { useState, useRef, useEffect } from "react";
import ModalWrapper from "../common/ModalWrapper";
import ButtonWrapper from "../common/ButtonWrapper";
import "../../css/MakeChallengeModal.css";
import instance from "../../utils/axios";
import calendarLogo from "../../assets/images/callendarLogo.png";

function MakeChallengeModal({ onClose, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    category: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
    rule: "",
  });

  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        introduction: initialData.introduction || "",
        category: initialData.category || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        maxParticipants: initialData.maxParticipantCount || "",
        rule: initialData.rule || "",
      });
    }
  }, [initialData]);

  const categories = [
    { id: "EXERCISE", name: "운동" },
    { id: "STUDY", name: "공부" },
    { id: "FINANCE", name: "금융" },
    { id: "DIET", name: "식단" },
    { id: "HABIT", name: "습관" },
    { id: "PROJECT", name: "단기 프로젝트" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  const handleDateInputClick = (type) => {
    const ref = type === "start" ? startInputRef : endInputRef;
    ref.current?.showPicker?.();
    ref.current?.click();
  };

  const validateForm = () => {
    const {
      title,
      introduction,
      category,
      startDate,
      endDate,
      maxParticipants,
      rule,
    } = formData;
    if (!title.trim()) return "제목을 입력해주세요.";
    if (!introduction.trim()) return "한줄소개를 입력해주세요.";
    if (!category) return "카테고리를 선택해주세요.";
    if (!startDate || !endDate) return "시작일과 종료일을 모두 선택해주세요.";
    if (startDate > endDate) return "종료일은 시작일보다 같거나 늦어야 합니다.";
    if (!maxParticipants) return "참여자 수를 입력해주세요.";
    if (!rule.trim()) return "규칙을 입력해주세요.";
    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // 로그인 확인
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const payload = {
        ...formData,
        maxParticipants: Number(formData.maxParticipants), // 숫자 변환 보장
      };

      if (initialData) {
        // 수정 모드
        await instance.put(`/challenges/${initialData.challengeId}`, payload);
        alert("챌린지가 수정되었습니다!");
      } else {
        // 생성 모드
        await instance.post("/challenges", payload);
        alert("챌린지가 생성되었습니다!");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("챌린지 생성/수정 실패:", error);

      if (error.response?.status === 401) {
        alert("로그인이 필요하거나 토큰이 만료되었습니다.");
      } else if (error.response && error.response.data?.message) {
        alert(`실패: ${error.response.data.message}`);
      } else {
        alert("챌린지 생성/수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="challenge-modal">
        <strong className="modal-title">
          {initialData ? "챌린지 수정" : "챌린지 만들기"}
        </strong>

        <div className="form-group">
          <input
            type="text"
            placeholder="제목"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="한줄소개"
            className="form-textarea"
            value={formData.introduction}
            onChange={(e) => handleInputChange("introduction", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">카테고리</label>
          <div className="category-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${
                  formData.category === cat.id ? "selected" : ""
                }`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <div className="date-range-container">
            <div className="date-input-row">
              <div className="date-input-container">
                <input
                  type="text"
                  placeholder="시작일"
                  className="date-input-with-icon"
                  value={formData.startDate}
                  onClick={() => handleDateInputClick("start")}
                  readOnly
                />
                <span className="calendar-icon">
                  <img src={calendarLogo} alt="calendar" />
                </span>
                <input
                  type="date"
                  className="hidden-date-input"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  ref={startInputRef}
                />
              </div>

              <span className="date-separator">~</span>

              <div className="date-input-container">
                <input
                  type="text"
                  placeholder="마감일"
                  className="date-input-with-icon"
                  value={formData.endDate}
                  onClick={() => handleDateInputClick("end")}
                  readOnly
                />
                <span className="calendar-icon">
                  <img src={calendarLogo} alt="calendar" />
                </span>
                <input
                  type="date"
                  className="hidden-date-input"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  ref={endInputRef}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="참여 인원(2-5인)"
            className="form-input"
            value={formData.maxParticipants}
            onChange={(e) =>
              handleInputChange("maxParticipants", e.target.value)
            }
            min="2"
            max="5"
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="챌린지 참여 인증 규칙"
            className="form-textarea rule-textarea"
            value={formData.rule}
            onChange={(e) => handleInputChange("rule", e.target.value)}
          />
        </div>

        <div className="submit-button-container">
          <ButtonWrapper variant="primary" onClick={handleSubmit}>
            챌린지 등록
          </ButtonWrapper>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default MakeChallengeModal;
