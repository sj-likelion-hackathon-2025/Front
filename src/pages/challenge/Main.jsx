import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Main.css";
import groupLogo from "../../assets/images/groupLogo.png";
import instance from "../../utils/axios";
import publicInstance from "../../utils/publicAxios";
import MakeChallengeModal from "../../components/modal/MakeChallengeModal";
import ChallengeApplyModal from "../../components/modal/ChallengeApplyModal";
import ApplicantsPage from "../../components/modal/ApplicantsPage";
import ButtonWrapper from "../../components/common/ButtonWrapper";

function Main() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const [tab, setTab] = useState("RECRUITING");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [lastChallengeId, setLastChallengeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [applyModalOpenId, setApplyModalOpenId] = useState(null);
  const [applicantModalOpenId, setApplicantModalOpenId] = useState(null);
  const [activeDotsId, setActiveDotsId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const observer = useRef();

  const fetchChallenges = async (reset = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const axiosInstance = token ? instance : publicInstance;

      const res = await axiosInstance.get("/challenges", {
        params: {
          q: query || null,
          sortBy,
          challengeStatus: tab,
          lastChallengeId: reset ? null : lastChallengeId,
        },
      });
      console.log(res);
      const newData = res.data.responses ?? [];
      console.log(newData);
      if (tab === "MY") {
        setMyChallenges((prev) => (reset ? newData : [...prev, ...newData]));
      } else {
        setChallenges((prev) => (reset ? newData : [...prev, ...newData]));
      }

      setLastChallengeId(res.data.nextCursorId);
    } catch (err) {
      console.error("챌린지 목록 불러오기 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "MY" && !isLoggedIn) {
      setTab("RECRUITING");
      return;
    }
    fetchChallenges(true);
  }, []);

  const handleSearch = (e) => setQuery(e.target.value);

  const handleApplicationSuccess = (challengeId) => {
    const update = (arr) =>
      arr.map((item) =>
        item.challengeId === challengeId
          ? {
              ...item,
              currentParticipantCount: item.currentParticipantCount + 1,
              applied: true,
            }
          : item
      );

    if (tab === "MY") setMyChallenges(update);
    else setChallenges(update);
  };

  const handleDotsAction = (challenge) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (challenge.startDate === todayStr && challenge.acceptedCount >= 1) {
      navigate(`/board/${challenge.challengeId}`);
    } else {
      setApplicantModalOpenId(challenge.challengeId);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await instance.delete(`/challenges/${id}`);
      setMyChallenges((prev) => prev.filter((item) => item.challengeId !== id));
    } catch {
      alert("삭제 실패");
    }
  };

  const displayedChallenges = tab === "MY" ? myChallenges : challenges;

  const lastChallengeElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && lastChallengeId) {
          fetchChallenges(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, lastChallengeId]
  );

  return (
    <div className="main-container">
      <div className="search-sort-bar">
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="NEWEST">최신순</option>
          <option value="POPULAR">인기순</option>
          <option value="OLDEST">오래된순</option>
        </select>
        <input
          type="text"
          placeholder=" 챌린지 검색"
          className="search-input"
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="tab-bar">
        <button
          className={tab === "RECRUITING" ? "tab active" : "tab"}
          onClick={() => setTab("RECRUITING")}
        >
          모집 중
        </button>
        <button
          className={`tab ${tab === "MY" ? "active" : ""} ${
            !isLoggedIn ? "disabled" : ""
          }`}
          onClick={() => isLoggedIn && setTab("MY")}
          disabled={!isLoggedIn}
        >
          내 챌린지
        </button>
      </div>

      {isLoggedIn && (
        <button
          className="plus-button"
          onClick={() => {
            setShowModal(true);
            setEditData(null);
          }}
        >
          +
        </button>
      )}

      {showModal && (
        <MakeChallengeModal
          onClose={() => {
            setShowModal(false);
            setTab("MY");
          }}
          initialData={editData}
        />
      )}

      {applyModalOpenId && (
        <ChallengeApplyModal
          challengeId={applyModalOpenId}
          onClose={() => setApplyModalOpenId(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {applicantModalOpenId && (
        <ApplicantsPage
          challengeId={applicantModalOpenId}
          onClose={() => setApplicantModalOpenId(null)}
        />
      )}

      <div className="challenge-list">
        {displayedChallenges.map((item, index) => {
          const isLast = index === displayedChallenges.length - 1;
          const todayStr = new Date().toISOString().slice(0, 10);
          return (
            <div
              className="challenge-card"
              key={item.challengeId}
              ref={isLast ? lastChallengeElementRef : null}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 className="challenge-title">{item.title}</h3>
                {tab === "MY" && (
                  <button
                    className="dot-menu-btn"
                    onClick={() =>
                      setActiveDotsId(
                        activeDotsId === item.challengeId
                          ? null
                          : item.challengeId
                      )
                    }
                  >
                    ⋯
                  </button>
                )}
              </div>

              <p className="challenge-intro">{item.introduction}</p>
              <p className="challenge-info">
                <img src={groupLogo} alt="group" className="group-logo" />[
                {item.currentParticipantCount}/{item.maxParticipantCount}]
              </p>
              <p className="challenge-due">
                [시작까지 D-
                {Math.max(
                  0,
                  Math.floor(
                    (new Date(item.startDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                )}
                ]
              </p>

              {activeDotsId === item.challengeId && (
                <div className="dot-dropdown">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setEditData(item);
                      setShowModal(true);
                    }}
                  >
                    챌린지 수정
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDelete(item.challengeId)}
                  >
                    개설 취소
                  </button>
                </div>
              )}

              <ButtonWrapper
                type="primary"
                onClick={() => handleDotsAction(item)}
              >
                {item.startDate === todayStr && item.acceptedCount >= 1
                  ? "인증"
                  : "신청 인원 보기"}
              </ButtonWrapper>
            </div>
          );
        })}
      </div>

      {loading && <p style={{ textAlign: "center" }}>불러오는 중...</p>}
    </div>
  );
}

export default Main;
