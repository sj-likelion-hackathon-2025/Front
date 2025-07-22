import "./Common.css";
function ButtonWrapper({ children, onClick, type = "default" }) {
  const style = {
    default: {
      backgroundColor: "#1976D3",
      border: "none",
      padding: "0.5rem 0.8rem",
      borderRadius: "6px",
      cursor: "pointer",
    },
    primary: {
      backgroundColor: "#E4F2FD",
      color: "white",
      padding: "0.7rem 1.2rem",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <button onClick={onClick} style={style[type]}>
      {children}
    </button>
  );
}

export default ButtonWrapper;
