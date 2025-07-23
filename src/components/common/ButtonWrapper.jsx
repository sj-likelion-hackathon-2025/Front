import "./Common.css";

function ButtonWrapper({
  children,
  onClick,
  type = "default",
  className = "",
}) {
  const style = {
    default: {
      backgroundColor: "#1976D3",
      color: "white",
      border: "none",
      padding: "0.8rem 1.2rem",
      borderRadius: "8px",
      fontWeight: "bold",
      fontSize: "1rem",
      width: "15rem",
      cursor: "pointer",
    },
    primary: {
      backgroundColor: "#E4F2FD",
      color: "#1976D3",
      border: "1px solid #1976D3",
      padding: "0.7rem 1rem",
      borderRadius: "8px",
      fontWeight: "bold",
      fontSize: "0.95rem",
      cursor: "pointer",
    },
  };

  return (
    <button onClick={onClick} style={style[type]} className={className}>
      {children}
    </button>
  );
}

export default ButtonWrapper;
