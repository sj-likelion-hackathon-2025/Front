import "./Common.css";

function InputWrapper({
  value,
  onChange,
  placeholder,
  size = "md",
  className = "",
  ...props
}) {
  const sizeStyle = {
    sm: { fontSize: "0.85rem", height: "36px", padding: "0 12px" },
    md: { fontSize: "1rem", height: "44px", padding: "0 16px" },
    lg: { fontSize: "1.1rem", height: "52px", padding: "0 20px" },
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`commonInput ${className}`}
      style={{
        border: "1px solid #BBDEFA",
        borderRadius: "8px",
        flex: 1,
        ...sizeStyle[size],
      }}
      {...props}
    />
  );
}

export default InputWrapper;
