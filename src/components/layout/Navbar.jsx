import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Navbar.css";
import LoginModal from "../modal/LoginModal";
import navHamburgerLogo from "../../assets/images/navHamburgerLogo.png";
import navBellIconOn from "../../assets/images/navBellIconOn.png";
import instance from "../../utils/axios";

function Navbar({ isLoggedIn, onLoginClick, onMakeChallengeClick }) {
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // 알림 목록 가져오기
  const fetchNotifications = async () => {
    try {
      const res = await instance.get("/notifications");
      setNotifications(res.data);
      const unreadExists = res.data.some((n) => !n.read);
      setHasUnread(unreadExists);
    } catch (err) {
      console.error("알림 가져오기 실패", err);
    }
  };

  // 알림 클릭 시: 읽음 처리만 (페이지 이동 없음)
  const handleNotificationClick = async (n) => {
    try {
      await instance.patch(`/notifications/${n.id}`);
      fetchNotifications(); // 다시 fetch해서 상태 업데이트
      // 페이지 이동 제거 - 알림창만 닫힘
    } catch (err) {
      console.error("알림 읽음 처리 실패", err);
    }
  };

  // 벨 아이콘 클릭 시 알림창 열고 목록 불러오기
  const handleBellClick = () => {
    if (!isLoggedIn) return;
    setIsNotificationOpen((prev) => !prev);
    fetchNotifications();
  };

  // 외부 클릭 시 알림창 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SSE 연결 (로그인된 경우만)
  useEffect(() => {
    if (!isLoggedIn) return;

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      console.warn("API_BASE_URL이 설정되지 않았습니다.");
      return;
    }

    const eventSource = new EventSource(
      `${apiBaseUrl}/subscribe`,
      {
        withCredentials: true,
      }
    );

    eventSource.onmessage = (event) => {
      console.log("🔔 새 알림 도착:", event.data);
      fetchNotifications();
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isLoggedIn]);

  return (
    <>
      <div className="navbar">
        <img
          src={navHamburgerLogo}
          alt="menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="navbar-icon"
        />

        {!isLoggedIn ? (
          <div onClick={onLoginClick}>로그인</div>
        ) : (
          <div
            className="notification-wrapper"
            style={{ position: "relative" }}
          >
            <img
              src={navBellIconOn}
              alt="알림"
              className="navbar-icon"
              onClick={handleBellClick}
            />
            <span
              className="notification-dot"
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: hasUnread ? "red" : "green",
              }}
            />
            {isNotificationOpen && (
              <div className="notification-dropdown" ref={dropdownRef}>
                {notifications.length === 0 ? (
                  <p className="notification-empty">알림이 없습니다.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${
                        n.read ? "read" : "unread"
                      }`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      {n.content}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isLoginModal && <LoginModal onClose={() => setIsLoginModal(false)} />}

      {isMenuOpen && (
        <div className="nav-drawer">
          <button className="close-drawer" onClick={() => setIsMenuOpen(false)}>
            X
          </button>
          <ul>
            <li
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              챌린지 홈
            </li>
            <li
              onClick={() => {
                navigate("/mypage");
                setIsMenuOpen(false);
              }}
            >
              마이페이지
            </li>
            <li
              onClick={() => {
                onMakeChallengeClick();
                setIsMenuOpen(false);
              }}
            >
              챌린지 만들기
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
