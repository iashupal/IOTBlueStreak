import React, { Component } from "react";
import { Drawer, Button, Row, Col, Checkbox } from "antd";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import lodash from "lodash";

import SaveCard from "../SaveCard";
import { DatePicker } from "antd";
import moment from "moment";
import { CSVLink } from "react-csv";
import arrowLeft from "../../assets/images/arrow-left-blue.png";
import fileExport from "../../assets/images/file-export-white.png";
import Loader from "../../components/Loader";
import "./styles.css";
const userId = localStorage.getItem("userId");
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

const tankTable = gql`
  query tankTableData($id: Int, $first: Int, $filter: QueryFilterEntry) {
    locationEntry(id: $id) {
      tanks(first: $first, recursive: true, filter: [$filter]) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        aggregate {
          sum_allAlarmCnt
          sum_hasHighAlarm
          sum_hasMediumOrHigherAlarm
          sum_highAlarmCnt
          sum_mediumOrHigherAlarmCnt
        }
        edges {
          cursor
          node {
            id
            description
            alarms {
              alarmType
              priority
              alarming
            }
            sensor {
              serialNumber
              id
              lastReportTimestamp
            }
            specifications {
              capacityGallons
              capacity
              capacityUnits
            }
            latestReading {
              gateway {
                serialNumber
                mostRecentTimestamp
              }
              refillPotentialGallons
              levelPercent
              rawQuality
              levelGallons
              temperatureCelsius
              batteryVoltage
              timestamp
            }
            externalId
            typeTags
          }
        }
      }
    }
  }
`;
class ExportDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      filtered: false,
      checked: true,
      csvHeader: [],
      csvData: [],
      tankHistory: [],
      tanksDataId: this.props.tanksDataId,
      pageSize: 600,
      currentPage: 1,
      showFilterBtn: true,
      tankExportData: {},
      isFilterPropsChanged: false,
      checkBoxes: {
        "Tank Number": true,
        "Tank Name": true,
        "Tank Status": true,
        "Sensor Status": true,
        Alerts: true,
        Commodity: true,
        "Current Volume": true,
        "Refill Potential": true,
        "Tank Capacity": true,
        TemperatureCelcius: true,
        TemperatureFehrenheit: true,
        Battery: true,
      },
    };
    this.setCSV = this.setCSV.bind(this);
  }
  onChange = ({ target: { value } }) => {
    const { checkBoxes } = this.state;

    this.setState(
      {
        checkBoxes: { ...checkBoxes, [value]: !checkBoxes[value] },
        showFilterBtn: true,
      },
      () => this.setCSV()
    );
  };
  componentDidMount() {
    const { checkBoxes } = this.state;
    const updates = {};
    Object.keys(checkBoxes).forEach((checkBox) => (updates[checkBox] = true));
    this.setState({ checkBoxes: { ...updates }, showFilterBtn: true }, () =>
      this.setCSV()
    );
    console.log("checkboxes value", checkBoxes);
  }

  changeAll = ({ target: { checked } }) => {
    const { checkBoxes } = this.state;
    const updates = {};
    if (checked === true) {
      Object.keys(checkBoxes).forEach(
        (checkBox) => (updates[checkBox] = checked)
      );
      this.setState({ checkBoxes: { ...updates }, showFilterBtn: true }, () =>
        this.setCSV()
      );
    } else {
      Object.keys(checkBoxes).forEach(
        (checkBox) => (updates[checkBox] = false)
      );
      this.setState({ showFilterBtn: false, checkBoxes: { ...updates } });
    }
  };

  // clearCheckBoxes = () => {
  //   console.log("clearall");
  //   const { checkBoxes } = this.state;
  //   const updates = {};
  //   Object.keys(checkBoxes).forEach((checkBox) => (updates[checkBox] = false));
  //   this.setState({ showFilterBtn: true, checkBoxes: { ...updates } });
  // };
  setCSV() {
    console.log("-------------- setCSV");
    const { checkBoxes, tankExportData } = this.state;
    const { selectedCheckboxKeys, tankData, tankFilteredData } = this.props;
    let entryHistory = [];
    const filteredData = selectedCheckboxKeys.length
      ? tankExportData.edges.filter(({ node: { id } }) =>
          selectedCheckboxKeys.includes(id)
        )
      : tankExportData.edges || [];
    for (const item of filteredData) {
      const alarmValues = { high: 0, medium: 0 };
      item.node.alarms
        .filter(({ alarming }) => alarming)
        .forEach(({ priority }) => {
          priority >= 500 && priority <= 999
            ? alarmValues.medium++
            : alarmValues.high++;
        });

      const fullData = {
        "Tank Number": item.node.externalId ? item.node.externalId : 0,
        "Tank Name": item.node.description ? item.node.description : "",
        "Tank Status": item.node.latestReading
          ? item.node.latestReading.levelPercent != null
            ? item.node.latestReading.levelPercent * 100
            : 0
          : 0,
        "Sensor Status":
          item.node.alarms.alarmType === "sensorMissedReportsAlarm" &&
          item.node.alarms.alarming === true
            ? "True"
            : "False",
        Alerts: `High - ${alarmValues.high} & Medium - ${alarmValues.medium}`,
        Commodity: "Propane",
        "Current Volume": item.node.latestReading
          ? item.node.latestReading.levelPercent != null
            ? Math.round(
                item.node.latestReading.levelPercent *
                  100 *
                  (item.node.specifications
                    ? item.node.specifications.capacityGallons / 100
                    : 0)
              ) +
              " " +
              item.node.specifications.capacityUnits
            : 0
          : "0",
        "Refill Potential": item.node.latestReading
          ? item.node.latestReading.refillPotentialGallons
            ? Math.round(item.node.latestReading.refillPotentialGallons) +
              " " +
              item.node.specifications.capacityUnits
            : "0"
          : "0",
        "Tank Capacity": item.node.specifications
          ? Math.round(item.node.specifications.capacityGallons) +
            " " +
            item.node.specifications.capacityUnits
          : "",
        TemperatureCelcius: item.node.latestReading
          ? item.node.latestReading.temperatureCelsius
            ? item.node.latestReading.temperatureCelsius.toFixed(1) + " " + "C"
            : "0"
          : 0,
        TemperatureFehrenheit: item.node.latestReading
          ? item.node.latestReading.temperatureCelsius
            ? (item.node.latestReading.temperatureCelsius * 1.8 + 32).toFixed(
                1
              ) +
              " " +
              "F"
            : "0"
          : 0,
        Battery: item.node.latestReading
          ? item.node.latestReading.batteryVoltage
            ? item.node.latestReading.batteryVoltage
            : "0"
          : 0,
      };

      const selectedCheckboxData = {};
      Object.keys(checkBoxes).forEach((checkbox) => {
        checkBoxes[checkbox] &&
          Object.assign(selectedCheckboxData, {
            [checkbox]: fullData[checkbox],
          });
      });
      entryHistory.push({ ...selectedCheckboxData });
    }
    this.setState({ csvData: [...entryHistory] });
    console.log("setCSVData - ", this.state.csvData);
    console.log("tankExportData", tankExportData);
  }

  componentDidUpdate(prevProps) {
    const prevPropsTankFilteredData = prevProps.tankFilteredData;
    const nextPropsTankFilteredData = this.props.tankFilteredData;

    const prevPropsSelectedCheckboxKeys = prevProps.selectedCheckboxKeys;
    const nextPropsSelectedCheckboxKeys = this.props.selectedCheckboxKeys;

    if (!lodash.isEqual(prevPropsTankFilteredData, nextPropsTankFilteredData)) {
      this.setState({ isFilterPropsChanged: true });
    }

    if (
      !lodash.isEqual(
        prevPropsSelectedCheckboxKeys,
        nextPropsSelectedCheckboxKeys
      ) &&
      Object.keys(this.state.tankExportData).length
    ) {
      this.setCSV();
    }
  }

  render() {
    const { visible, hideForm } = this.props;
    const {
      pageSize,
      checkBoxes,
      filtered,
      showFilterBtn,
      tankExportData,
      tanksDataId,
      isFilterPropsChanged,
    } = this.state;
    console.log("tanksDataid -- ", this.props.tanksDataId);
    console.log("selectedCheckboxKeys -- ", this.props.selectedCheckboxKeys);
    console.log("selectedRowKeys", this.props.selectedCheckboxKeys);
    console.log("tankFilteredData - ", this.props.tankFilteredData);

    return (
      <div className="advanced_form">
        <Drawer title="Export" width={620} closable={false} visible={visible}>
          <Query
            query={tankTable}
            variables={{
              id: this.props.tanksDataId,
              first: pageSize,
              filter: this.props.tankFilteredData,
            }}
          >
            {({ data, error, loading }) => {
              if (loading) {
                return (
                  <div>
                    <Loader />
                  </div>
                );
              }
              if (error) {
                return <div>Error</div>;
              } else if (data) {
                console.log("tankTable export", data);
                if (
                  !Object.keys(tankExportData).length ||
                  String(this.state.tanksDataId) !==
                    String(this.props.tanksDataId) ||
                  isFilterPropsChanged
                )
                  this.setState(
                    {
                      tankExportData: { ...data.locationEntry.tanks },
                      tanksDataId: this.props.tanksDataId,
                      isFilterPropsChanged: false,
                    },
                    () => this.setCSV()
                  );
                console.log("tankExportData", tankExportData);
                return (
                  data &&
                  data.locationEntry && (
                    <>
                      <img
                        className="hideSearch_form"
                        src={arrowLeft}
                        alt="close"
                        onClick={() => hideForm()}
                      />
                      <div className="advanced_btns">
                        <Button
                          onClick={this.handleSubmit}
                          className="saved_btn"
                          size="large"
                          type="primary"
                        >
                          Current Tanks in View(
                          {/* {tankData.edges?.length || ""} */}
                          {data.locationEntry.tanks.totalCount || ""})
                        </Button>
                        <Button size="large" className="filter_btn">
                          Selected Tanks(
                          {this.props.selectedCheckboxKeys
                            ? this.props.selectedCheckboxKeys.length
                            : ""}
                          )
                        </Button>
                      </div>
                      {/* <SaveCard
              heading="Tank Date Range to Export"
              contents={[
                <div className="saved_searches">
                  <RangePicker
                  
                    onChange={(moment, [from, to], showFilterBtn) =>
                      this.props.applyDateFilter(from, to, showFilterBtn)
                    }
                  />
                </div>,
              ]}
            /> */}
                      <SaveCard
                        heading="Tank Data to Export"
                        contents={[
                          <div className="saved_searches">
                            <div className="export__data--content">
                              <Checkbox
                                onChange={this.changeAll}
                                checked={Object.values(checkBoxes).every(
                                  (value) => value
                                )}
                              >
                                {" "}
                                Export All Data Points
                              </Checkbox>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="externalId"
                                    value="Tank Number"
                                    checked={checkBoxes["Tank Number"]}
                                  >
                                    {" "}
                                    Tank Number
                                  </Checkbox>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="description"
                                    value="Tank Name"
                                    checked={checkBoxes["Tank Name"]}
                                  >
                                    {" "}
                                    Tank Name
                                  </Checkbox>
                                </div>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="levelPercent"
                                    value="Tank Status"
                                    checked={checkBoxes["Tank Status"]}
                                  >
                                    {" "}
                                    Tank Status
                                  </Checkbox>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="sensorStatus"
                                    value="Sensor Status"
                                    checked={checkBoxes["Sensor Status"]}
                                  >
                                    {" "}
                                    Sensor Status
                                  </Checkbox>
                                </div>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="alerts"
                                    value="Alerts"
                                    checked={checkBoxes["Alerts"]}
                                  >
                                    {" "}
                                    Alerts
                                  </Checkbox>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="commodity"
                                    value="Commodity"
                                    checked={checkBoxes["Commodity"]}
                                  >
                                    {" "}
                                    Commodity
                                  </Checkbox>
                                </div>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    value="Current Volume"
                                    checked={checkBoxes["Current Volume"]}
                                  >
                                    {" "}
                                    Current Volume
                                  </Checkbox>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    value="Refill Potential"
                                    checked={checkBoxes["Refill Potential"]}
                                  >
                                    {" "}
                                    Refill Potential
                                  </Checkbox>
                                </div>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    value="Tank Capacity"
                                    checked={checkBoxes["Tank Capacity"]}
                                  >
                                    {" "}
                                    Tank Capacity
                                  </Checkbox>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="temperatureCelsius"
                                    value="TemperatureCelcius"
                                    checked={checkBoxes["TemperatureCelcius"]}
                                  >
                                    {" "}
                                    Temperature Celcius
                                  </Checkbox>
                                </div>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="temperatureFehrenheit"
                                    value="TemperatureFehrenheit"
                                    checked={
                                      checkBoxes["TemperatureFehrenheit"]
                                    }
                                  >
                                    {" "}
                                    Temperature Fehrenheit
                                  </Checkbox>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="export__data--content">
                                  <Checkbox
                                    onChange={this.onChange}
                                    name="batteryVoltage"
                                    value="Battery"
                                    checked={checkBoxes["Battery"]}
                                  >
                                    {" "}
                                    Battery
                                  </Checkbox>
                                </div>
                              </Col>
                            </Row>
                          </div>,
                        ]}
                      />
                      <div
                        style={{
                          padding: "10px 16px",
                          textAlign: "right",
                        }}
                      >
                        <CSVLink
                          disabled={!showFilterBtn}
                          data={this.state.csvData}
                          filename={`Tanks_List-${moment(new Date()).format(
                            "YYYY-MM-DD"
                          )}.csv`}
                        >
                          <Button
                            size="large"
                            disabled={!showFilterBtn}
                            className="client_export--btn"
                            icon={
                              <img
                                className="icons"
                                src={fileExport}
                                alt="export"
                              />
                            }
                            // disabled={Object.keys(filters).length === 0}
                            type={filtered ? "danger" : "primary"}
                          >
                            {filtered ? "Clear Export" : "Export"}
                          </Button>
                        </CSVLink>
                      </div>
                    </>
                  )
                );
              }
            }}
          </Query>
        </Drawer>
      </div>
    );
  }
}
export default ExportDrawer;
