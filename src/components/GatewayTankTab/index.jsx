import React from "react";
import "./styles.css";

function GatewayTankTab({ text, selected, onClick, styleName }) {
  return (
    <div
      onClick={onClick}
      className={`gatewayTankContainer ${styleName} ${
        selected ? "activeGatewayTankTab" : ""
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
GatewayTankTab.defaultProps = {
  selected: false,
};
export default GatewayTankTab;
