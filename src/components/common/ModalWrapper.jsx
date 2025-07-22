import "../../css/ModalWrapper.css";

function ModalWrapper({ children, onClose }) {
  return (
    <div className="modalWrapper">
      <div className="modalTitle">
        <button className="closeButton" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;
