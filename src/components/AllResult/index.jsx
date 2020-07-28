import React, { Fragment } from "react";
import { RightOutlined } from "@ant-design/icons";
import "./styles.css";
function AllResult(props) {
  return (
    <Fragment>
      <div className="vertrax_result">
        {props.resultHeading && (
          <RightOutlined style={{ color: "#215CAA", fontSize: "16px" }} />
        )}
        <p>{props.resultHeading}</p>
      </div>
    </Fragment>
  );
}
export default AllResult;
