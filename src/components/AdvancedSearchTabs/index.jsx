import React from "react";
import { Button } from "antd";
import "./styles.css";

function AdvancedSearchTabs({ text, selected, onClick }) {
  return (
    <Button
      onClick={onClick}
      className={`filter_btn ${selected ? "activeAdvancedTab" : ""}`}
      size="large"
    >
      {text}
    </Button>
  );
}
AdvancedSearchTabs.defaultProps = {
  selected: false,
};
export default AdvancedSearchTabs;
