import React, { Fragment, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Loader from "../Loader";
import moment from "moment";
import { Query } from "react-apollo";
const lineGraph = gql`
  query lineGraphData(
    $id: Int
    $first: Int
    $fromdate: String
    $todate: String
  ) {
    tank(id: $id) {
      id
      specifications {
        capacity
        capacityUnits
        capacityGallons
      }
      readings(
        first: $first
        filter: [
          { timestamp: { op: ">=", v: $fromdate } }
          { timestamp: { op: "<=", v: $todate } }
        ]
      ) {
        totalCount
        edges {
          node {
            timestamp
            levelPercent
          }
        }
      }
    }
  }
`;
const option1 = {
  chart: {
    type: "area",
  },
  title: {
    text: "Client Tank Capacity (%)",
  },
  xAxis: [
    {
      // categories: xAxisData,
      // tickInterval: 7 * 24 * 3600 * 1000,
      // tickmarkPlacement: "on",
      type: "datetime",
      title: {
        enabled: false,
      },
      dateTimeLabelFormats: {
        week: "%e of %b",
      },
      // tickPositioner: function () {
      //   var positions = [],
      //     interval = 24 * 3600 * 1000 * 7;
      //   for (var i = this.min; i < this.max; i += interval) {
      //     positions.push(i);
      //   }
      //   return positions;
      // },
    },
  ],
  yAxis: {
    labels: {
      format: "{value}%",
    },
    title: {
      enabled: false,
    },
  },

  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [
            1,
            Highcharts.color(Highcharts.getOptions().colors[0])
              .setOpacity(0)
              .get("rgba"),
          ],
        ],
      },
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },

      // threshold: null,
    },
  },

  series: [
    {
      // pointStart: Date.now() - 29 * 24 * 60 * 60 * 1000 * 7,
      // pointStart: Date.UTC(
      //   oneDay.getUTCFullYear(),
      //   oneDay.getUTCMonth(),
      //   oneDay.getYTCDate()
      // ),
      // pointStart: Date.UTC(2020, 4, 1),
      // pointStart: moment(oneDay).format("YYYY-MM-DD"),
      // pointInterval: 24 * 3600 * 1000 * 7,
      name: "Level",
      // data: yAxisData,
      data: [1, 2, 3, 4, 5],
    },
  ],
};
class lineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineGraphData: {},
      selectedTankId: "",
      isFilterPropsChanged: false,
      last30days: "",
      todaysDate: "",
    };
  }
  componentDidMount() {
    this.updateGraph();
  }
  updateGraph() {
    let xAxisData = [];
    let yAxisData = [];
    let todaysDate = this.state.todaysDate;
    let last30Days = this.state.last30days;
    const { lineGraphData } = this.state;

    var today = new Date();
    todaysDate = new Date();
    last30days = new Date(today.setDate(today.getDate() - 30));
    // let last30days = this.state.last30days;
    console.log("todays date-----", this.state.today, this.state.last30days);
    // if (lineGraphData.length > 0) {
    //   lineGraphData.map((item) => {
    //     xAxisData.push(moment(item.node.timestamp).format("YYYY-MM-DD"));
    //     yAxisData.push(item.node.levelPercent);
    //   });
    // }
  }
  render() {
    const {
      lineGraphData,
      selectedTankId,
      isFilterPropsChanged,
      last30days,
      todaysDate,
    } = this.state;
    return (
      <Fragment>
        <Query
          query={lineGraph}
          variables={{
            id: this.props.selectedTankId,
            first: 500,
            fromdate: last30days,
            todate: todaysDate,
          }}
        >
          {({ data, error, loading }) => {
            if (loading || !data) {
              return (
                <div>
                  <Loader />
                </div>
              );
            }
            if (error) {
              return console.log(JSON.stringify(error));
            } else if (data) {
              if (
                !Object.keys(lineGraphData).length ||
                String(selectedTankId) !== String(this.props.selectedTankId) ||
                isFilterPropsChanged
              )
                this.setState({
                  lineGraphData: { ...data.tank.readings.edges },
                  selectedTankId: this.props.selectedTankId,
                  isFilterPropsChanged: false,
                });
              console.log("linegraph", lineGraphData);
              return (
                data &&
                data.tank && (
                  <Fragment>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={option1}
                    />
                  </Fragment>
                )
              );
            }
          }}
        </Query>
      </Fragment>
    );
  }
}
export default lineChart;
