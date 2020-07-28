import React from "react";
import { Animate } from "react-move";
import Graph from "./Graph";
import "./styles.css";

class AnimatedTank extends React.Component {
  state = {
    isAnimated: false,
  };

  componentDidMount() {
    this.setState({
      isAnimated: true,
    });
  }

  render() {
    const {
      image,
      percntgStatus,
      percentageSign,
      lostpercentage,
      graphStyle,
      graphDesignStyle,
      strokeColor,
      onClick,
    } = this.props;
    const { isAnimated } = this.state;
    return (
      <Animate
        start={() => ({
          percentage: 0,
        })}
        update={() => ({
          percentage: [isAnimated ? this.props.percentage : 0],
          timing: {
            duration: this.props.duration * 1000,
            ease: this.props.easingFunction,
          },
        })}
      >
        {({ percentage }) => {
          const roundedPercentage = Math.round(percentage);
          const lostPer = 100 - roundedPercentage;
          return (
            <div>
              {graphStyle ? (
                <Graph
                  percentage={roundedPercentage}
                  mainStrokeStyle={strokeColor}
                  onClick={onClick}
                >
                  <div className="graph_content">
                    <div className="graph_value">
                      <img src={image} alt="logo" />
                      <h3>
                        {roundedPercentage}
                        {percentageSign}
                      </h3>
                    </div>
                    {lostpercentage ? (
                      <p className="graph__client--tank">
                        Clients <strong> {percntgStatus}</strong>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </Graph>
              ) : !graphDesignStyle ? (
                <Graph
                  percentage={roundedPercentage}
                  graphStyle="graphStyle"
                  onClick={onClick}
                >
                  <div className="graph_content">
                    <div className="graph_value">
                      <img src={image} alt="logo" />
                      <h3>
                        {roundedPercentage} {percentageSign}
                      </h3>
                    </div>
                    {lostpercentage ? (
                      <p>
                        Clients{" "}
                        <strong>
                          {percntgStatus} {lostPer}%
                        </strong>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </Graph>
              ) : (
                <Graph
                  percentage={roundedPercentage}
                  graphStyle="graphDesignStyle"
                  onClick={onClick}
                >
                  <div className="graph_content">
                    <h3>
                      {roundedPercentage}
                      {percentageSign}
                    </h3>
                    {lostpercentage ? <p>{percntgStatus}</p> : ""}
                  </div>
                </Graph>
              )}
            </div>
          );
        }}
      </Animate>
    );
  }
  abstract;
}

export default AnimatedTank;
