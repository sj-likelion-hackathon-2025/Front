"use client";

import { useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import ButtonWrapper from "../common/ButtonWrapper";
import "../../css/MakeChallengeModal.css";
import instance from "../../utils/axios";

function MakeChallengeModal({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    category: "",
    startDate: "",
    endDate: "",
    maxParticipantCount: "",
    rules: "",
  });

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
    const input = document.getElementById(`hidden-${type}-input`);
    if (input) {
      input.click();
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.introduction.trim()) {
      alert("한줄소개를 입력해주세요.");
      return;
    }
    if (!formData.category) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }
    if (!formData.maxParticipantCount) {
      alert("참여자 수를 입력해주세요.");
      return;
    }
    if (!formData.rules.trim()) {
      alert("규칙을 입력해주세요.");
      return;
    }

    try {
      await instance.post("/challenges", formData);
      alert("챌린지가 생성되었습니다!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("챌린지 생성 실패:", error);
      alert("챌린지 생성에 실패했습니다.");
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="challenge-modal">
        <strong className="modal-title">챌린지 만들기</strong>

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
                className={`category-btn ${
                  formData.category === cat.id ? "selected" : ""
                }`}
                onClick={() => handleCategorySelect(cat.id)}
                type="button"
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
                <span className="calendar-icon">📅</span>
                <input
                  type="date"
                  id="hidden-start-input"
                  className="hidden-date-input"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
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
                <span className="calendar-icon">📅</span>
                <input
                  type="date"
                  id="hidden-end-input"
                  className="hidden-date-input"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="5인"
            className="form-input"
            value={formData.maxParticipantCount}
            onChange={(e) =>
              handleInputChange("maxParticipantCount", e.target.value)
            }
            min="1"
            max="100"
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="매일 2회로 규정합니다. 시작 시간과 종료 시간, 거리를 포함하여 인증 사진 부탁"
            className="form-textarea rules-textarea"
            value={formData.rules}
            onChange={(e) => handleInputChange("rules", e.target.value)}
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
