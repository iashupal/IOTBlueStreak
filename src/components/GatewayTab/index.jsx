import React from "react";
import "./styles.css";

function GatewayTab({ text, selected, onClick, styleName }) {
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
GatewayTab.defaultProps = {
  selected: false,
};
export default GatewayTab;
