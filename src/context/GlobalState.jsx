import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";
import { gql } from "apollo-boost";

const initiateState = {
  leftPanel: gql`
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
  `,
  totalGraphs: gql`
    {
      locationEntry(id: 2) {
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
          filter: [
            { alarmingTypes: { op: "in", v: "sensorMissedReportsAlarm" } }
          ]
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
        bulk: tanks(
          recursive: true
          filter: [{ isBulk: { op: "=", v: true } }]
        ) {
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
  `,
};

export const GlobalContext = createContext(initiateState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initiateState);
  return (
    <GlobalContext.Provider
      value={{ leftPanel: state.leftPanel, totalGraphs: state.totalGraphs }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
