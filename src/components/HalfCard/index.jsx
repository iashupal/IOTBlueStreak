import React from "react";
import ContentCard from "../ContentCard";
import Heading from "../Heading";
import dropGreen from "../../assets/images/drop-green.png";
import dropYellow from "../../assets/images/drop-yellow.png";
import dropRed from "../../assets/images/drop-slashred.png";
import broadcastTowerRed from "../../assets/images/broadcast-tower-red.png";
import wifiRed from "../../assets/images/wifi-red.png";
import wifiGreen from "../../assets/images/wifi-green.png";
import broadcastGreen from "../../assets/images/broadcast-green.png";
// import OwlCarousel from 'react-owl-carousel';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Loader from "../Loader";
import "./halfcard.css";
const userId = localStorage.getItem("userId");

let totalGatewayGraphs = gql`
  query graphsgraphsgraphsData($id: Int) {
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
        filter: [{ levelPercent: { op: "<", v: 0.30 } }]
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
        filter: [{ levelPercent: { op: "<", v: 0.30 } }]
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

function HalfCard({ selectedTank, selectedTypeGateway }) {
  const tankId = selectedTank;
  let finalGraph;
  const selectedGateway = selectedTypeGateway;
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
  if (errorGraphs) return console.log("Failed to fetch");
  return (
    <div
      className="card2_container"
      // margin={15}
      // nav
      // items={3}
      // loop
    >
      <ContentCard
        styleName="card_tank"
        contents={[
          <div className="card_content tank_content">
            <Heading
              fontSize="0.9rem"
              heading="Tanks"
              count={
                graphsData.locationEntry
                  ? graphsData.locationEntry.totalTanks.totalCount
                  : "0"
              }
            />
            <div className="card_small--tab">
              <div className="card_small--content">
                <img src={dropGreen} alt="tank_drop" />
                <p className="card__half--tankCount">
                  {graphsData
                    ? graphsData.locationEntry
                      ? graphsData.locationEntry.tanksAbove30.totalCount
                      : "0"
                    : "0"}
                </p>
              </div>
              <div className="card_small--content">
                <img src={dropYellow} alt="tank_drop" />
                <p className="card__half--tankCount">
                  {graphsData
                    ? graphsData.locationEntry
                      ? graphsData.locationEntry.tanksBelow30.totalCount
                      : ""
                    : "0"}
                </p>
              </div>
              <div className="card_small--content">
                <img src={dropRed} alt="tank_drop" />
                <p className="card__half--tankCount">
                  {graphsData
                    ? graphsData.locationEntry
                      ? graphsData.locationEntry.tanksBelow10.totalCount
                      : ""
                    : "0"}
                </p>
              </div>
            </div>
          </div>,
        ]}
      />
      <ContentCard
        styleName="card_gateway"
        contents={[
          <div className="card_content tank_content">
            <Heading fontSize="0.9rem" heading="Gateways & Sensors" />
            <div className="card_small--tab2">
              <div className="card_small--content2">
                <span>
                  <img src={broadcastGreen} alt="tank_drop" />
                  <p className="card_small--count">
                    {graphsData.locationEntry
                      ? graphsData.locationEntry.totalGateways
                        ? graphsData.locationEntry.totalGateways.totalCount -
                          graphsData.locationEntry.offlineGateways.totalCount
                        : 0
                      : 0}
                  </p>
                </span>
                <span>
                  <img src={broadcastTowerRed} alt="tank_drop" />
                  <p className="card_small--count">
                    {graphsData
                      ? graphsData.locationEntry
                        ? graphsData.locationEntry.offlineGateways
                          ? graphsData.locationEntry.offlineGateways.totalCount
                          : 0
                        : 0
                      : 0}
                  </p>
                </span>
              </div>
              <div className="card_small--content2">
                <span>
                  <img src={wifiGreen} alt="tank_drop" />
                  <p className="card_small--count">
                    {graphsData
                      ? graphsData.locationEntry.totalTanks
                        ? graphsData.locationEntry.totalTanks.totalCount -
                          graphsData.locationEntry.offlineTanks.totalCount
                        : "0"
                      : "0"}
                  </p>
                </span>
                <span>
                  <img src={wifiRed} alt="tank_drop" />
                  <p className="card_small--count">
                    {graphsData
                      ? graphsData.locationEntry
                        ? graphsData.locationEntry.offlineTanks
                          ? graphsData.locationEntry.offlineTanks.totalCount
                          : 0
                        : "0"
                      : "0"}
                  </p>
                </span>
              </div>
            </div>
          </div>,
        ]}
      />
      <ContentCard
        styleName="card_inventory"
        contents={[
          <div className="card_content tank_content">
            <Heading fontSize="0.9rem" heading="Total Inventory" />
            <div className="card_small--tab3">
              <div className="card_small--content">
                <span>Available</span>
                <p className="card_small--count">
                  {graphsData.locationEntry
                    ? graphsData.locationEntry.bulk.aggregate
                        .sum_capacityGallons
                    : ""}
                  G
                </p>
              </div>
              <div className="card_small--content">
                <span>Potential</span>
                <p className="card_small--count">
                  {graphsData.locationEntry
                    ? graphsData.locationEntry.client.aggregate
                        .sum_capacityGallons
                    : "0"}
                  G
                </p>
              </div>
            </div>
          </div>,
        ]}
      />
      {/* </OwlCarousel> */}
    </div>
  );
}
export default HalfCard;
