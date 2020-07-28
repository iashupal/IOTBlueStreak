// import React, { Fragment, useEffect, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { gql } from "apollo-boost";
// import { useQuery } from "@apollo/react-hooks";
// import Loader from "../Loader";
// import moment from "moment";

// const lineGraph = gql`
//   query lineGraphData(
//     $id: Int
//     $first: Int
//     $fromdate: String
//     $todate: String
//   ) {
//     tank(id: $id) {
//       id
//       specifications {
//         capacity
//         capacityUnits
//         capacityGallons
//       }
//       readings(
//         first: $first
//         filter: [
//           { timestamp: { op: ">=", v: $fromdate } }
//           { timestamp: { op: "<=", v: $todate } }
//         ]
//       ) {
//         totalCount
//         edges {
//           node {
//             timestamp
//             levelPercent
//           }
//         }
//       }
//     }
//   }
// `;
// var xAxisData = [];
// var yAxisData = [];

// var today = new Date();
// var todaysDate = new Date();
// var last30days = new Date(today.setDate(today.getDate() - 30));
// console.log("todays date-----", today, last30days);
// const option1 = {
//   chart: {
//     type: "area",
//   },
//   title: {
//     text: "Client Tank Capacity (%)",
//   },
//   global: {
//     useUTC: false, // true by default
//   },
//   xAxis: [
//     {
//       categories: xAxisData,
//       // categories: ["Apples", "Oranges", "Pears", "Grapes", "Bananas"],
//       tickInterval: 7 * 24 * 3600 * 1000,
//       // type: "datetime",
//       // startOnTick: true,
//       // endOnTick: true,
//       // dateTimeLabelFormats: {
//       //   week: "%e of %b",
//       // },
//       tickmarkPlacement: "on",
//       title: {
//         enabled: false,
//       },
//       tickPositioner: function (min, max) {
//         var interval = this.options.tickInterval,
//           ticks = [],
//           count = 0;

//         while (min < max) {
//           ticks.push(min);
//           min += interval;
//           count++;
//         }

//         ticks.info = {
//           unitName: "day",
//           count: 7,
//           higherRanks: {},
//           totalRange: interval * count,
//         };

//         return ticks;
//       },
//     },
//   ],
//   yAxis: {
//     labels: {
//       format: "{value}%",
//     },
//     title: {
//       enabled: false,
//     },
//   },

//   plotOptions: {
//     area: {
//       fillColor: {
//         linearGradient: {
//           x1: 0,
//           y1: 0,
//           x2: 0,
//           y2: 1,
//         },
//         stops: [
//           [0, Highcharts.getOptions().colors[0]],
//           [
//             1,
//             Highcharts.color(Highcharts.getOptions().colors[0])
//               .setOpacity(0)
//               .get("rgba"),
//           ],
//         ],
//       },
//       marker: {
//         radius: 2,
//       },
//       lineWidth: 1,
//       states: {
//         hover: {
//           lineWidth: 1,
//         },
//       },
//     },
//   },

//   series: [
//     {
//       // pointStart: Date.now() - 29 * 24 * 60 * 60 * 1000 * 7,
//       // pointInterval: 24 * 3600 * 1000 * 7,
//       name: "Level",
//       data: yAxisData,
//       // pointStart: moment(xAxisData).format("YYYY-MM-DD"),
//       // pointStart: Date.UTC(),
//       pointInterval: 24 * 3600 * 1000 * 7, // one week
//     },
//   ],
// };

// function LineChart(props) {
//   let [newFromDate, setnewFromDate] = useState("");
//   var [oneDay, setOneDay] = useState("");
//   let [newToDate, setnewToDate] = useState("");
//   let [newCurrentDate, setnewCurrentDate] = useState("");

//   newFromDate = props.endDate;
//   newToDate = props.endDate;
//   if (newFromDate) {
//     newFromDate = moment(newFromDate);
//     newFromDate = newFromDate.subtract(4, "months");
//     var newFromFilterDate = newFromDate.format("YYYY-MM-DD");
//   }

//   console.log("new from date", newFromFilterDate);
//   console.log("newToDate", newToDate);
//   // console.log("today", today.toUTCString());
//   console.log("Today: ", todaysDate.toUTCString());
//   console.log("Last 30th day: " + last30days.toUTCString());
//   // oneDay = newToDate || last30days;
//   if (newFromDate != null || newFromDate != "") {
//     console.log("**************************************** ", newFromDate);
//     oneDay = newFromDate;
//   } else {
//     oneDay = last30days;
//   }
//   if (newToDate != null || newToDate != "") {
//     console.log("newTOdate---------------", newToDate);
//     newCurrentDate = newToDate;
//   } else {
//     newCurrentDate = todaysDate;
//   }

//   const { loading, error, data } = useQuery(lineGraph, {
//     variables: {
//       id: props.selectedTankId,
//       first: 1000,
//       fromdate: oneDay,
//       todate: newCurrentDate,
//     },
//   });
//   if (loading || !data)
//     return (
//       <p>
//         <Loader />
//       </p>
//     );

//   if (data.tank.readings.edges.length > 0) {
//     data.tank.readings.edges.map((item) => {
//       xAxisData.push(moment(item.node.timestamp).format("YYYY-MM-DD"));
//       yAxisData.push(item.node.levelPercent);
//     });
//   }

//   // useEffect(() => {
//   //   setnewToDate(newFromDate);
//   // }, [newFromDate]);

//   console.log("filtered date basis data", props.passFilteredData);
//   console.log("startDate", props.startDate);
//   console.log("endDate ", props.endDate);
//   console.log("xAxisData", xAxisData);
//   console.log("yAxisData", yAxisData);
//   console.log("selectedtankid", props.selectedTankId);
//   console.log("linegraph", data);
//   if (error) return console.log("Failed to fetch");

//   return (
//     <Fragment>
//       <HighchartsReact highcharts={Highcharts} options={option1} />
//     </Fragment>
//   );
// }
// export default LineChart;

import React, { Fragment, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
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
var xAxisData = [];
var yAxisData = [];

var today = new Date("2020-05-18T03:50:30.000Z");
var todaysDate = new Date("2020-05-18T03:50:30.000Z");
var last30days = new Date(today.setDate(today.getDate() - 60));
console.log("todays date-----", today, last30days);

// const option1 = {
//   chart: {
//     type: "area",
//   },
//   title: {
//     text: "Client Tank Capacity (%)",
//   },
//   xAxis: {
//     // categories: xAxisData,
//     type: "datetime",
//     tickInterval: 24 * 3600 * 1000 * 5,
//     tickPositioner: function (min, max) {
//       var interval = this.options.tickInterval,
//         ticks = [],
//         count = 0;

//       while (min < max) {
//         ticks.push(min);
//         min += interval;
//         count++;
//       }

//       ticks.info = {
//         unitName: "day",
//         count: 5,
//         higherRanks: {},
//         totalRange: interval * count,
//       };

//       return ticks;
//     },
//   },
//   yAxis: {
//     title: {
//       text: "Exchange rate",
//     },
//   },
//   legend: {
//     enabled: false,
//   },
//   plotOptions: {
//     area: {
//       fillColor: {
//         linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//         stops: [
//           [0, Highcharts.getOptions().colors[0]],
//           [
//             1,
//             Highcharts.Color(Highcharts.getOptions().colors[0])
//               .setOpacity(0)
//               .get("rgba"),
//           ],
//         ],
//       },
//       marker: {
//         radius: 2,
//       },
//       lineWidth: 1,
//       states: {
//         hover: {
//           lineWidth: 1,
//         },
//       },
//       threshold: null,
//     },
//   },

//   series: [
//     {
//       type: "area",
//       name: "USD to EUR",
//       pointInterval: 24 * 3600 * 1000,
//       pointStart: Date.UTC(2020, 2, 1),
//       data: [
//         [140],
//         [127],
//         [35],
//         [132],
//         [192],
//         [179],
//         [131],
//         [206],
//         [92],
//         [57],
//         [352],
//         [370],
//         [281],
//         [282],
//         [128],
//         [100],
//         [33],
//         [215],
//         [154],
//         [226],
//         [225],
//         [334],
//         [105],
//         [60],
//         [264],
//         [227],
//         [151],
//         [115],
//         [184],
//         [74],
//       ],
//     },
//   ],
// };

const option1 = {
  chart: {
    type: "area",
  },
  title: {
    text: "Client Tank Capacity (%)",
  },
  xAxis: [
    {
      categories: xAxisData,
      // categories: ["Apples", "Oranges", "Pears", "Grapes", "Bananas"],
      //   tickInterval: 7 * 24 * 3600 * 1000,
      //   tickPositioner: function (min, max) {
      //     var interval = this.options.tickInterval,
      //       ticks = [],
      //       count = 0;

      //     while (min < max) {
      //       ticks.push(min);
      //       min += interval;
      //       count++;
      //     }

      //     ticks.info = {
      //       unitName: "day",
      //       count: 7,
      //       higherRanks: {},
      //       totalRange: interval * count,
      //     };

      //     return ticks;
      //   },
      // tickmarkPlacement: "on",
      //   type: "datetime",
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

  //   plotOptions: {
  //     area: {
  //       fillColor: {
  //         linearGradient: {
  //           x1: 0,
  //           y1: 0,
  //           x2: 0,
  //           y2: 1,
  //         },
  //         stops: [
  //           [0, Highcharts.getOptions().colors[0]],
  //           [
  //             1,
  //             Highcharts.color(Highcharts.getOptions().colors[0])
  //               .setOpacity(0)
  //               .get("rgba"),
  //           ],
  //         ],
  //       },
  //       marker: {
  //         radius: 2,
  //       },
  //       lineWidth: 1,
  //       states: {
  //         hover: {
  //           lineWidth: 1,
  //         },
  //       },

  //       // threshold: null,
  //     },
  //   },
  plotOptions: {
    series: {
      cursor: "pointer",
      pointRange: 7 * 24 * 3600 * 1000,
      point: {
        events: {
          click: function (e) {
            hs.htmlExpand(null, {
              pageOrigin: {
                x: e.pageX || e.clientX,
                y: e.pageY || e.clientY,
              },
              headingText: this.series.name,
              maincontentText:
                Highcharts.dateFormat("%A, %b %e, %Y", this.x) +
                ":<br/> " +
                this.y +
                " sessions",
              width: 200,
            });
          },
        },
      },
      marker: {
        lineWidth: 1,
      },
    },
  },

  series: [
    {
      name: "Level",
      data: yAxisData,
      //   pointStart: Date.UTC(2020, 2, 1),
      //   pointInterval: 24 * 3600 * 1000,
    },
  ],
};

function LineChart(props) {
  let [newFromDate, setnewFromDate] = useState("");
  var [oneDay, setOneDay] = useState("");
  let [newToDate, setnewToDate] = useState("");
  let [newCurrentDate, setnewCurrentDate] = useState("");

  newFromDate = props.endDate;
  newToDate = props.endDate;
  if (newFromDate) {
    newFromDate = moment(newFromDate);
    newFromDate = newFromDate.subtract(4, "months");
    newFromDate = newFromDate.format("YYYY-MM-DD");
  }

  console.log("new from date", newFromDate);
  console.log("newToDate", newToDate);
  // console.log("today", today.toUTCString());
  console.log("Today: ", todaysDate.toUTCString());
  console.log("Last 30th day: " + last30days.toUTCString());
  // oneDay = newToDate || last30days;
  if (newFromDate != null || newFromDate != "") {
    console.log("**************************************** ", newFromDate);
    oneDay = newFromDate;
  } else {
    oneDay = last30days;
  }

  if (newToDate != null || newToDate != "") {
    console.log("newTOdate---------------", newToDate);
    newCurrentDate = newToDate;
  } else {
    newCurrentDate = todaysDate;
  }
  console.log("oneDay", oneDay);
  console.log("newCurrentDate", newCurrentDate);
  const { loading, error, data } = useQuery(lineGraph, {
    variables: {
      id: props.selectedTankId,
      first: 1000,
      fromdate: last30days,
      todate: todaysDate,
    },
  });
  if (loading || !data)
    return (
      <p>
        <Loader />
      </p>
    );

  if (data.tank.readings.edges.length > 0) {
    data.tank.readings.edges.map((item) => {
      xAxisData.push(moment(item.node.timestamp).format("YYYY-MM-DD"));
      yAxisData.push(item.node.levelPercent);
    });
  }

  console.log("filtered date basis data", props.passFilteredData);
  console.log("startDate", props.startDate);
  console.log("endDate ", props.endDate);
  console.log("xAxisData", xAxisData);
  console.log("yAxisData", yAxisData);
  console.log("selectedtankid", props.selectedTankId);
  console.log("linegraph", data);
  if (error) return console.log("Failed to fetch");

  return (
    <Fragment>
      <HighchartsReact highcharts={Highcharts} options={option1} />
    </Fragment>
  );
}
export default LineChart;
