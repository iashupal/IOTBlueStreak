import React from "react";
import "./styles.css";

function DeepSubTab({ text, selected, onClick, styleName }) {
  return (
    <div
      onClick={onClick}
      className={`gatewayContainer ${styleName} ${
        selected ? "activeGatewayTab" : ""
      }`}
    >
      {selected ? (
        <i className="far fa-folder-open" />
      ) : (
        <i className="fas fa-plus" />
      )}
      <p>{text}</p>
    </div>
  );
}
DeepSubTab.defaultProps = {
  selected: false,
};
export default DeepSubTab;
