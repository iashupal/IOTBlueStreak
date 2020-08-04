import React, { Fragment, useState } from "react";
import Heading from "../Heading";
import ContentCard from "../ContentCard";
import dropGreen from "../../assets/images/drop-green.png";
import dropYellow from "../../assets/images/drop-yellow.png";
import dropRed from "../../assets/images/drop-slashred.png";
import broadcastTowerRed from "../../assets/images/broadcast-tower-red.png";
import wifiRed from "../../assets/images/wifi-red.png";
import wifiGreen from "../../assets/images/wifi-green.png";
import broadcastGreen from "../../assets/images/broadcast-green.png";
// import OwlCarousel from 'react-owl-carousel';
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./fullcard.css";
import AnimatedTank from "../Chart/AnimatedTank";
import AnimatedGateway from "../Chart/AnimatedGateway";
import AnimatedInventory from "../Chart/AnimatedInventory";
import { easeQuadInOut } from "d3-ease";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import Loader from "../Loader";
import { set } from "lodash";
import { useEffect } from "react";
const userId = localStorage.getItem("userId");
let totalGatewayGraphs = gql`
  query graphsgraphsData($id: Int) {
    locationEntry(id: $id) {
      tanksBelow10: tanks(
        recursive: true
        filter: {
          _or: [
            { levelPercent: { op: "<", v: 0.10 } }
            { levelPercent: { op: "isNull" } }
          ]
        }
      ) {
        totalCount
      }
      tanksBelow30: tanks(
        recursive: true
        filter: [
          { levelPercent: { op: "<", v: 0.30 } }
          { levelPercent: { op: ">=", v: 0.10 } }
        ]
      ) {
        totalCount
      }
      tanksAbove30: tanks(
        recursive: true
        filter: [{ levelPercent: { op: ">=", v: 0.30 } }]
      ) {
        totalCount
      }
      totalTanks: tanks(recursive: true) {
        totalCount
      }
      offlineTanks: tanks(
        recursive: true
        filter: [{ alarmingTypes: { op: "in", v: "sensorMissedReportsAlarm" } }]
      ) {
        totalCount
      }

      bulk: tanks(recursive: true, filter: [{ isBulk: { op: "=", v: true } }]) {
        totalCount
        aggregate {
          sum_capacityGallons
          sum_levelGallons
          avg_levelPercent
        }
      }
      client: tanks(
        recursive: true
        filter: [{ isBulk: { op: "=", v: false } }]
      ) {
        totalCount
        aggregate {
          sum_capacityGallons
          sum_levelGallons
          avg_levelPercent
        }
      }
    }
  }
`;

let totalGraphs = gql`
  query graphsgraphsData($id: Int) {
    locationEntry(id: $id) {
      tanksBelow10: tanks(
        recursive: true
        filter: {
          _or: [
            { levelPercent: { op: "<", v: 0.10 } }
            { levelPercent: { op: "isNull" } }
          ]
        }
      ) {
        totalCount
      }
      tanksBelow30: tanks(
        recursive: true
        filter: [
          { levelPercent: { op: "<", v: 0.30 } }
          { levelPercent: { op: ">=", v: 0.10 } }
        ]
      ) {
        totalCount
      }
      tanksAbove30: tanks(
        recursive: true
        filter: [{ levelPercent: { op: ">=", v: 0.30 } }]
      ) {
        totalCount
      }
      totalTanks: tanks(recursive: true) {
        totalCount
      }
      offlineTanks: tanks(
        recursive: true
        filter: [{ alarmingTypes: { op: "in", v: "sensorMissedReportsAlarm" } }]
      ) {
        totalCount
      }
      ... on Location {
        totalGateways: sublocations(
          recursive: true
          filter: [{ isGateway: { op: "=", v: true } }]
        ) {
          totalCount
        }
        offlineGateways: sublocations(
          recursive: true
          filter: [
            { alarmingTypes: { op: "in", v: "gatewayMissedCheckinsAlarm" } }
            { isGateway: { op: "=", v: true } }
          ]
        ) {
          totalCount
        }
      }
      bulk: tanks(recursive: true, filter: [{ isBulk: { op: "=", v: true } }]) {
        totalCount
        aggregate {
          sum_capacityGallons
          sum_levelGallons
          avg_levelPercent
        }
      }
      client: tanks(
        recursive: true
        filter: [{ isBulk: { op: "=", v: false } }]
      ) {
        totalCount
        aggregate {
          sum_capacityGallons
          sum_levelGallons
          avg_levelPercent
        }
      }
    }
  }
`;
function FullCard({
  selectedTank,
  selectedTypeGateway,
  handleGraphTankClick,
  parentCallBack,
}) {
  const tankId = selectedTank;
  let finalGraph;
  const selectedGateway = selectedTypeGateway;
  const { gatewayPath, setGatewayPath } = useState(0);
  console.log("selectedGateway", selectedGateway);
  if (selectedGateway == "GatewayLocation") {
    finalGraph = totalGatewayGraphs;
  } else {
    finalGraph = totalGraphs;
  }

  const {
    loading: loadingGraphs,
    error: errorGraphs,
    data: graphsData,
  } = useQuery(finalGraph, {
    variables: { id: tankId },
  });

  if (loadingGraphs || !graphsData)
    return (
      <p>
        <Loader />
      </p>
    );

  console.log("tank", graphsData.locationEntry);
  console.log("offlineGateway", graphsData.locationEntry.offlineGateways);
  if (errorGraphs) return console.log("Failed to fetch");
  console.log(
    "path full chart color",
    Math.round(
      ((graphsData.locationEntry.totalGateways.totalCount -
        graphsData.locationEntry.offlineGateways.totalCount) /
        graphsData.locationEntry.totalGateways.totalCount) *
        100
    )
  );
  console.log(
    "offline %",
    Math.round(
      (graphsData.locationEntry.offlineGateways.totalCount * 100) /
        graphsData.locationEntry.totalGateways.totalCount
    )
  );
  console.log(
    Math.round(
      (graphsData.locationEntry.offlineGateways.totalCount * 100) /
        graphsData.locationEntry.totalGateways.totalCount
    )
  );
  // useEffect(() => {
  //   const progressGatewayPath =
  //     ((graphsData.locationEntry.totalGateways.totalCount -
  //       graphsData.locationEntry.offlineGateways.totalCount) /
  //       graphsData.locationEntry.totalGateways.totalCount) *
  //     100;
  //   setGatewayPath(progressGatewayPath);
  // }, [setGatewayPath]);
  return (
    <div>
      <Fragment>
        <div
          className="card_container"
          //  margin={20}
          //  nav
          //  items={3}
          // autoplay ={true}
        >
          <ContentCard
            styleName="card_tank"
            contents={[
              <div className="full--card_content">
                <Heading
                  fontSize="20"
                  clientName="Client"
                  heading="Tanks"
                  count={
                    graphsData.locationEntry
                      ? graphsData.locationEntry.totalTanks.totalCount
                      : "0"
                  }
                />
                <div className="Progress_wrapper">
                  <AnimatedTank
                    graphStyle
                    lostpercentage
                    percentage={
                      graphsData
                        ? graphsData.locationEntry
                          ? graphsData.locationEntry.tanksAbove30.totalCount
                          : "0"
                        : "0"
                    }
                    duration={1.4}
                    easingFunction={easeQuadInOut}
                    image={dropGreen}
                    percntgStatus="above 30%"
                    onClick={() => {
                      parentCallBack("Above 30%");
                    }}
                  />
                  <AnimatedTank
                    graphStyle
                    lostpercentage
                    strokeColor="tankBelow30"
                    percentage={
                      graphsData
                        ? graphsData.locationEntry
                          ? graphsData.locationEntry.tanksBelow30.totalCount
                          : ""
                        : "0"
                    }
                    duration={1.4}
                    easingFunction={easeQuadInOut}
                    image={dropYellow}
                    percntgStatus="below 30%"
                    onClick={() => {
                      parentCallBack("Below 30%");
                    }}
                  />
                  <AnimatedTank
                    graphStyle
                    lostpercentage
                    strokeColor="tankBelow10"
                    percentage={
                      graphsData
                        ? graphsData.locationEntry
                          ? graphsData.locationEntry.tanksBelow10.totalCount
                          : ""
                        : "0"
                    }
                    duration={1.4}
                    easingFunction={easeQuadInOut}
                    image={dropRed}
                    percntgStatus="below 10%"
                    onClick={() => {
                      parentCallBack("Below 10%");
                    }}
                  />
                </div>
              </div>,
            ]}
          />
          <ContentCard
            styleName="card_gateway"
            contents={[
              <div className="full--card_content">
                <Heading clientName="Client" heading="Gateways & Sensors" />
                <div className="card_division">
                  <div className="card_inr--divisn">
                    <div>
                      <img
                        src={require("../../assets/images/broadcast-blue.png")}
                        alt="broadcast_message"
                      />
                      <p>Gateways</p>
                    </div>
                    <AnimatedGateway
                      percentage={
                        graphsData
                          ? graphsData.locationEntry
                            ? graphsData.locationEntry.totalGateways
                              ? Math.round(
                                  (graphsData.locationEntry.offlineGateways
                                    .totalCount *
                                    100) /
                                    graphsData.locationEntry.totalGateways
                                      .totalCount
                                )
                              : 0
                            : 0
                          : 0
                      }
                      count={
                        graphsData
                          ? graphsData.locationEntry
                            ? graphsData.locationEntry.offlineGateways
                              ? graphsData.locationEntry.offlineGateways
                                  .totalCount
                              : 0
                            : 0
                          : 0
                      }
                      pathColor={
                        graphsData.locationEntry.offlineGateways.totalCount !=
                        null
                          ? Math.round(
                              (graphsData.locationEntry.offlineGateways
                                .totalCount *
                                100) /
                                graphsData.locationEntry.totalGateways
                                  .totalCount
                            )
                            ? "var(--color-red)"
                            : "var(--color-parrot)"
                          : "transparent"
                      }
                      strokeColor="gatewayStroke"
                      duration={1.4}
                      easingFunction={easeQuadInOut}
                      image={broadcastTowerRed}
                      image1={broadcastGreen}
                      percntgStatus="OFFLINE"
                      percntgStatus1="ONLINE"
                      onlineGateway={
                        graphsData.locationEntry
                          ? graphsData.locationEntry.totalGateways
                            ? graphsData.locationEntry.totalGateways
                                .totalCount -
                              graphsData.locationEntry.offlineGateways
                                .totalCount
                            : 0
                          : 0
                      }
                    />
                  </div>
                  <div className="card_inr--divisn">
                    <div>
                      <i className="fa fa-wifi" />
                      <p>Sensors</p>
                    </div>

                    <AnimatedGateway
                      percentage={
                        graphsData
                          ? graphsData.locationEntry
                            ? graphsData.locationEntry.totalGateways
                              ? Math.round(
                                  (graphsData.locationEntry.offlineTanks
                                    .totalCount *
                                    100) /
                                    graphsData.locationEntry.totalTanks
                                      .totalCount
                                )
                              : 0
                            : 0
                          : 0
                      }
                      count={
                        graphsData
                          ? graphsData.locationEntry
                            ? graphsData.locationEntry.offlineTanks
                              ? graphsData.locationEntry.offlineTanks.totalCount
                              : 0
                            : "0"
                          : "0"
                      }
                      trailColor={
                        graphsData.locationEntry.offlineTanks.totalCount != null
                          ? graphsData.locationEntry.totalTanks.totalCount
                            ? "var(--color-parrot)"
                            : "transparent"
                          : 0
                      }
                      pathColor={
                        graphsData.locationEntry.offlineTanks.totalCount != null
                          ? Math.round(
                              (graphsData.locationEntry.offlineTanks
                                .totalCount *
                                100) /
                                graphsData.locationEntry.totalTanks.totalCount
                            )
                            ? "var(--color-red)"
                            : "transparent"
                          : 0
                      }
                      // pathColor={
                      //   graphsData.locationEntry.offlineTanks.totalCount != null
                      //     ? Math.round(
                      //         graphsData.locationEntry.totalTanks.totalCount -
                      //           graphsData.locationEntry.offlineTanks.totalCount
                      //       )
                      //       ? "var(--color-parrot)"
                      //       : "var(--color-transparent)"
                      //     : 0
                      // }
                      strokeColor="gatewayStroke"
                      duration={1.4}
                      easingFunction={easeQuadInOut}
                      image={wifiRed}
                      image1={wifiGreen}
                      percntgStatus="OFFLINE"
                      percntgStatus1="ONLINE"
                      onlineGateway={
                        graphsData
                          ? graphsData.locationEntry.totalTanks
                            ? graphsData.locationEntry.totalTanks.totalCount -
                              graphsData.locationEntry.offlineTanks.totalCount
                            : "0"
                          : "0"
                      }
                    />
                  </div>
                </div>
              </div>,
            ]}
          />
          <ContentCard
            styleName="card_inventory"
            contents={[
              <div className="full--card_content">
                <Heading clientName="Client" heading="Total Inventory" />
                <div className="card_division">
                  <div className="card_inr--divisn">
                    <p>
                      Bulk Inventory <strong>Available</strong>
                    </p>
                    <AnimatedInventory
                      percentage={
                        graphsData.locationEntry
                          ? (graphsData.locationEntry.bulk.aggregate
                              .sum_levelGallons /
                              graphsData.locationEntry.bulk.aggregate
                                .sum_capacityGallons) *
                            100
                          : "0"
                      }
                      duration={1.4}
                      strokeColor="bulkStroke"
                      count={
                        graphsData.locationEntry
                          ? graphsData.locationEntry.bulk.aggregate
                              .sum_capacityGallons
                          : "0"
                      }
                      easingFunction={easeQuadInOut}
                      percntgStatus="AVAILABLE"
                      percntgStatus1="GALLONS"
                    />
                  </div>
                  <div className="card_inr--divisn">
                    <p>
                      Customer Tanks <strong>Potential</strong>
                    </p>
                    <AnimatedInventory
                      percentage={
                        graphsData.locationEntry != null
                          ? graphsData.locationEntry.client.aggregate
                              .sum_levelGallons === 0
                            ? 0
                            : (graphsData.locationEntry.client.aggregate
                                .sum_levelGallons /
                                graphsData.locationEntry.client.aggregate
                                  .sum_capacityGallons) *
                              100
                          : 0
                      }
                      strokeColor="clientStroke"
                      count={
                        graphsData.locationEntry
                          ? graphsData.locationEntry.client.aggregate
                              .sum_capacityGallons
                          : "0"
                      }
                      duration={1.4}
                      easingFunction={easeQuadInOut}
                      percntgStatus="POTENTIAL"
                      percntgStatus1="GALLONS"
                    />
                  </div>
                </div>
              </div>,
            ]}
          />
        </div>
      </Fragment>
    </div>
  );
}

export default FullCard;
