import React from "react";
import "./styles.css";

function Tab({ text, selected, onClick, alertCount, fireCount, styleName }) {
  return (
    <div
      onClick={onClick}
      className={`tabContainer ${styleName} ${selected ? "activeTab" : ""}`}
    >
      {selected ? (
        <i className="far fa-folder-open" />
      ) : (
        <i className="fas fa-plus" />
      )}
      <p>{text}</p>
      {/* {selected && (
        <div className="tab_alerts">
          <span>
            <i className="fas fa-exclamation-triangle"></i>
            <p>{alertCount}</p>
          </span>
          <span>
            <i className="fas fa-fire-alt"></i>
            <p>{fireCount}</p>
          </span>
        </div>
      )} */}
    </div>
  );
}
Tab.defaultProps = {
  selected: false,
};
export default Tab;
