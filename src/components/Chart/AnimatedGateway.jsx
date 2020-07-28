import React from "react";
import { Animate } from "react-move";
import Graph from "./Graph";
import { Divider } from "antd";
import "./styles.css";

class AnimatedGateway extends React.Component {
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
      image1,
      percntgStatus1,
      percntgStatus,
      onlineGateway,
    } = this.props;
    return (
      <Animate
        start={() => ({
          percentage: 0,
        })}
        update={() => ({
          percentage: [this.state.isAnimated ? this.props.percentage : 0],
          timing: {
            duration: this.props.duration * 1000,
            ease: this.props.easingFunction,
          },
        })}
      >
        {({ percentage }) => {
          const roundedPercentage = Math.round(percentage);
          // const lostPer = 100 - roundedPercentage;
          return (
            <Graph percentage={roundedPercentage}>
              <div className="graph_content">
                <div className="graph_value" style={{ height: "3em" }}>
                  <img src={image} alt="logo" />
                  <h3>{roundedPercentage}</h3>
                </div>
                <p className="graph_status">
                  <strong>{percntgStatus}</strong>
                </p>
                <Divider type="horizontal" />
                <div className="graph_value" style={{ height: "2em" }}>
                  <img src={image1} alt="logo" />
                  <h3 style={{ lineHeight: 0.75, fontSize: 18 }}>
                    {onlineGateway}
                  </h3>
                </div>
                <p className="graph_status">
                  <strong>{percntgStatus1}</strong>
                </p>
              </div>
            </Graph>
          );
        }}
      </Animate>
    );
  }
  abstract;
}

export default AnimatedGateway;
