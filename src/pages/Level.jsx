import "../css/Level.css";

function Level() {
  const levels = [
    {
      name: "Rookie",
      korean: "루키",
      points: "1-99포인트 챌린저",
      color: "#0daeaf",
      className: "rookie",
    },
    {
      name: "Pro",
      korean: "프로",
      points: "100-999포인트 챌린저",
      color: "#034dac",
      className: "pro",
    },
    {
      name: "Master",
      korean: "마스터",
      points: "1,000-9,999포인트 챌린저",
      color: "#d93cb2",
      className: "master",
    },
    {
      name: "Grand",
      korean: "그랜드 마스터",
      points: "10,000-99,999포인트 챌린저",
      color: "#9000ff",
      className: "grand",
    },
    {
      name: "Legend",
      korean: "레전드",
      points: "100,000포인트 이상 챌린저",
      color: "#ff1744",
      className: "legend",
    },
  ];

  return (
    <div className="level-container">
      <div className="level-title">
        <h1>챌린저 등급 제도</h1>
      </div>

      <div className="level-system">
        {levels.map((level, index) => (
          <div key={index} className="level-item">
            <div className="level-info">
              <div className={`level-name ${level.className}`}>
                {level.name}
              </div>
              <div className="level-details">
                <div className="level-korean">{level.korean}</div>
                <div className="level-points">{level.points}</div>
              </div>
            </div>

            {index < levels.length - 1 && (
              <div className="level-arrow">
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
                  <path
                    d="M20 10 L20 40 M10 30 L20 40 L30 30"
                    stroke="#b3d9ff"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Level;
