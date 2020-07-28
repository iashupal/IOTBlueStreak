import React from "react";
import { Animate } from "react-move";
import Graph from "./Graph";
import { Divider } from "antd";
import "./styles.css";

class AnimatedInventory extends React.Component {
  state = {
    isAnimated: false,
  };

  componentDidMount() {
    this.setState({
      isAnimated: true,
    });
  }

  render() {
    const { count, percntgStatus1, percntgStatus, strokeColor } = this.props;
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
            <Graph percentage={roundedPercentage} mainStrokeStyle={strokeColor}>
              <div className="graph_content">
                <h3 style={{ lineHeight: 0.75 }}>{roundedPercentage}%</h3>
                <p className="inventory_status">
                  <strong>{percntgStatus}</strong>
                </p>
                <Divider type="horizontal" />
                <h4 style={{ lineHeight: 0.75 }}>{count}</h4>
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

export default AnimatedInventory;
