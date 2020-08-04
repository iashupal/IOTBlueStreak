import React, { Fragment, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import Loader from "../Loader";
import moment from "moment";

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

const today = new Date();
const todaysDate = new Date();
const last30days = new Date(today.setDate(today.getDate() - 30));
var daysInMonth = [];

var monthDate = moment().startOf(todaysDate);

_.times(monthDate.daysInMonth(), function (n) {
  daysInMonth.push(monthDate.format("YYYY-MM-DD"));
  monthDate.subtract(1, "day");
});

function LineChart(props) {
  const [xAxisData, setXAxisData] = useState(daysInMonth.slice(0, -1));
  const [yAxisData, setYAxisData] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      type: "area",
    },
    title: {
      text: "Client Tank Capacity (%)",
    },
    xAxis: [
      {
        categories: xAxisData,
        // tickInterval: 7 * 24 * 3600 * 1000,
        type: "datetime",
        title: {
          enabled: false,
        },
        dateTimeLabelFormats: {
          week: "%e of %b",
        },
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
      },
    },
    series: [
      {
        name: "Level",
        data: yAxisData,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [edges, setEdges] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    props.endDate ? props.endDate : todaysDate
  );
  const [previousDate, setPreviousDate] = useState(
    props.endDate
      ? moment(props.endDate).subtract(3, "months").format("YYYY-MM-DD")
      : last30days
  );

  useEffect(() => {
    setCurrentDate(props.endDate ? props.endDate : todaysDate);
    setPreviousDate(
      props.endDate
        ? moment(props.endDate).subtract(3, "months").format("YYYY-MM-DD")
        : last30days
    );
  }, [JSON.stringify(props.endDate)]);
  console.log(props.endDate);
  const [getData, { error, data }] = useLazyQuery(lineGraph);

  useEffect(() => {
    console.log("I am here too ----->", previousDate);
    getData({
      variables: {
        id: props.selectedTankId,
        first: 1000,
        fromdate: previousDate,
        todate: currentDate,
      },
    });
  }, [currentDate, previousDate]);

  useEffect(() => {
    console.log("I am here ----->", data);
    if (!data && !loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (data && data.tank.readings.edges.length > 0) {
      setLoading(false);
      const xData = [];
      const yData = [];
      const xFilterData = [];
      var Xresult = 0;
      console.log("Previous Value", data.tank.readings.edges);
      data.tank.readings.edges.map((item) => {
        if (
          !xFilterData.includes(
            moment(item.node.timestamp).format("YYYY-MM-DD")
          )
        ) {
          console.log("After removing the duplicate element", xFilterData);
          if (Xresult % 7 == 0) {
            xData.push(moment(item.node.timestamp).format("YYYY-MM-DD"));
            yData.push(item.node.levelPercent);
          }
          xFilterData.push(moment(item.node.timestamp).format("YYYY-MM-DD"));
          Xresult = Xresult + 1;
        }
        // xData.push(moment(item.node.timestamp).format("YYYY-MM-DD"));
      });
      console.log(xData);
      setXAxisData([...xData]);
      setYAxisData([...yData]);
      const updatedOptions = { ...options };
      updatedOptions.xAxis[0].categories = xData;
      updatedOptions.series[0].data = yData;
      console.log("updatedOption", updatedOptions);
      setOptions({ ...updatedOptions });
    }
  }, [data]);

  if (error) return console.log("Failed to fetch");
  if (loading) {
    return <Loader />;
  } else {
    return (
      <Fragment>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Fragment>
    );
  }
}

export default LineChart;
