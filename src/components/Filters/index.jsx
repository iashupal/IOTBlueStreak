import React from "react";
import { Button } from "antd";
import "./styles.css";

function Filters({ text, selected, onClick }) {
  return (
    <Button
      onClick={onClick}
      className={`filter_inrbtn ${selected ? "activeFiltersTab" : ""}`}
      size="large"
    >
      {text}
    </Button>
  );
}
Filters.defaultProps = {
  selected: false,
};
export default Filters;
