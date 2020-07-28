import React from "react";
import { gql } from "apollo-boost";
// left panel query
const leftPanel = gql`
  query leftPanelData($id: Int) {
    locationEntry(id: $id) {
      ... on Location {
        sublocations(first: 100) {
          totalCount
          edges {
            node {
              id
              description
            }
          }
        }
      }
    }
  }
`;

// graphs query
const totalGraphs = gql`
  query graphsData($id: Int) {
    locationEntry(id: $id) {
      tanksBelow10: tanks(
        recursive: true
        filter: [{ levelPercent: { op: "<", v: 0.10 } }]
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

// table query
const tankTable = gql`
  {
    locationEntry(id: 14) {
      ... on GatewayLocation {
        tanks(first: 100) {
          edges {
            node {
              id
              description
              specifications {
                capacityGallons
                capacityUnits
                capacity
              }
              latestReading {
                levelPercent
                refillPotentialGallons
                temperatureCelsius
                rawQuality
                batteryVoltage
              }
              isBulk
              sensor {
                serialNumber
                lastReportTimestamp
                id
              }
              typeTags
              description
            }
          }
        }
      }
    }
  }
`;

export default queries;
