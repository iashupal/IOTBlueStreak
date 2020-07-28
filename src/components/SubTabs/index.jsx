import React from "react";
import "./styles.css";

function SubTabs({ text, selected, onClick, styleName }) {
  return (
    <div
      onClick={onClick}
      className={`subtabContainer ${styleName} ${
        selected ? "activeSubTab" : ""
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
SubTabs.defaultProps = {
  selected: false,
};
export default SubTabs;
