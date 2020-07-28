import React from "react";
import { MinusOutlined } from "@ant-design/icons";
import plusBlue from "../../assets/images/plus-blue.png";
import "./styles.css";

function FilterChips({ text, selected, onClick, id }) {
  return (
    <div
      onClick={onClick}
      className={`filter__selected ${selected ? "activeSelectedTag" : ""}`}
      id={id}
      size="large"
    >
      {text}
      {selected ? (
        <MinusOutlined className="minusIcon" />
      ) : (
        <img src={plusBlue} alt="selectedTag" />
      )}
    </div>
  );
}
FilterChips.defaultProps = {
  selected: false,
};
export default FilterChips;
