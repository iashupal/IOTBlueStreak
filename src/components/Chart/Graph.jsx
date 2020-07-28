import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

function Graph(props) {
  const { children, graphStyle, onClick, ...otherProps } = props;
  return (
    <div className={`progressBar_graph ${props.graphStyle}`}>
      <div>
        <CircularProgressbar
          value={props.percentage}
          {...otherProps}
          className={`graphStroke ${props.mainStrokeStyle}`}
        />
      </div>
      <div className="progressbar_inr--info" onClick={props.onClick}>
        {props.children}
      </div>
    </div>
  );
}
export default Graph;
