import "./Common.css";
function InputWrapper({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        border: "none",
        borderRadius: "6px",
        padding: "0.5rem",
        width: "120px",
      }}
    />
  );
}
export default InputWrapper;
