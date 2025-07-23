import React, { useEffect, useState } from "react";
import "../css/Main.css";
import groupLogo from "../assets/images/groupLogo.png";
import instance from "../utils/axios";
import MakeChallengeModal from "../components/modal/MakeChallengeModal";

function Main() {
  const [challenges, setChallenges] = useState([]);
  const [tab, setTab] = useState("RECRUITING");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [lastChallengeId, setLastChallengeId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchChallenges = async (reset = false) => {
    try {
      const response = await instance.get(`/challenges`, {
        params: {
          q: query || undefined,
          sortBy,
          challengeStatus: tab,
          lastChallengeId: reset ? null : lastChallengeId,
        },
      });
      const newChallenges = response.data.challengePreviewResponses ?? [];
      setChallenges((prev) =>
        reset ? newChallenges : [...prev, ...newChallenges]
      );
      setLastChallengeId(response.data.nextCursorId);
    } catch (err) {
      console.error("챌린지 목록 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchChallenges(true);
  }, [tab, query, sortBy]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

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
          className={tab === "MY" ? "tab active" : "tab"}
          onClick={() => setTab("MY")}
        >
          내 챌린지
        </button>
      </div>
      <button className="plus-button" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && <MakeChallengeModal onClose={() => setShowModal(false)} />}
      {tab === "RECRUITING" && (
        <div className="challenge-list">
          {challenges.map((item) => (
            <div className="challenge-card" key={item.challengeId}>
              <h3 className="challenge-title">{item.title}</h3>
              <p className="challenge-intro">{item.introduction}</p>
              <p className="challenge-info">
                <img src={groupLogo} alt="group" className="group-logo" />[
                {item.currentParticipantCount}/{item.maxParticipantCount}]
              </p>
              <p className="challenge-due">
                [모집 종료까지 D-
                {Math.max(
                  0,
                  Math.floor(
                    (new Date(item.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                )}
                ]
              </p>
              <button className="apply-btn">신청</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Main;
