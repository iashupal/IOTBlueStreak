import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

function Graph(props) {
  const {
    children,
    graphStyle,
    onClick,
    trailColor,
    pathColor,
    strokeDashoffset,
    ...otherProps
  } = props;
  return (
    <div className={`progressBar_graph ${props.graphStyle}`}>
      <div>
        <CircularProgressbar
          value={props.percentage}
          styles={buildStyles({
            trailColor: props.trailColor,
            pathColor: props.pathColor,
            strokeDashoffset: props.strokeDashoffset,
          })}
          // trailColor={props.trailColor}
          // pathColor={props.pathColor}
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
