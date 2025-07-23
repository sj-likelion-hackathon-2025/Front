import "../css/Developers.css";
import devProfile from "../assets/images/devProfile.png";
import githubLogo from "../assets/images/githubLogo.png";
import mailIcon from "../assets/images/mailIcon.png";
function Developers() {
  const developers = [
    {
      role: "Design",
      name: "곽예주",
      email: "yeonah0707@gmail.com",
      github: "https://github.com/Alkaid725",
      profileImage: devProfile,
    },
    {
      role: "Frontend",
      name: "오다현",
      email: "imcute0703123@naver.com",
      github: "https://github.com/dahyuniiiiii",
      profileImage: devProfile,
    },
    {
      role: "Backend",
      name: "곽태풍",
      email: "iii148389@gmail.com",
      github: "https://github.com/kwakseobang",
      profileImage: devProfile,
    },
  ];

  return (
    <div className="developers-container">
      <div className="developers-title">
        <h1>개발자 정보</h1>
      </div>

      <div className="developers-list">
        {developers.map((developer, index) => (
          <div key={index} className="developer-card">
            <div className="developer-role">
              <h2>{developer.role}</h2>
            </div>

            <div className="developer-info">
              <div className="developer-image">
                <img
                  src={developer.profileImage || "/placeholder.svg"}
                  alt={`${developer.name} 프로필`}
                  className="profile-img"
                />
              </div>

              <div className="developer-details">
                <h3 className="developer-name">{developer.name}</h3>

                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">
                      <img src={mailIcon} />
                    </span>
                    <span className="contact-text">{developer.email}</span>
                  </div>

                  <div className="contact-item">
                    <span className="contact-icon">
                      <img src={githubLogo} />
                    </span>
                    <span className="contact-text">{developer.github}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Developers;
