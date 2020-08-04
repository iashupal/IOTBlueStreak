import React, { Component } from "react";
import { Table, Progress, Popover, Input, Button, Card, Select } from "antd";
import { DatePicker } from "antd";
import moment from "moment";

import Pagination from "react-js-pagination";
import fileExport from "../../assets/images/file-export-white.png";
import filter from "../../assets/images/filter-blue.png";
import { gql } from "apollo-boost";
import { Query, graphql } from "react-apollo";
import { CSVLink } from "react-csv";
import Loader from "../Loader";
import "../TankTable/index.css";
import "./clientHistory.css";
import "../../../node_modules/antd/dist/antd.compact.css";
import { FastForwardFilled } from "@ant-design/icons";
const { Option } = Select;

const { RangePicker } = DatePicker;
const tankDetailExport = gql`
  query tankTableData($id: Int, $first: Int, $filter: QueryFilterEntry) {
    tank(id: $id) {
      id
      parent {
        id
        description
      }
      specifications {
        capacity
        capacityUnits
        capacityGallons
      }
      readings(
        first: $first

        sortDirection: desc
        sortBy: timestamp
        filter: [$filter]
      ) {
        totalCount

        edges {
          node {
            timestamp
            levelPercent
            temperatureCelsius
            batteryVoltage
            levelGallons
            refillPotentialGallons
            rawQuality
          }
        }
      }
    }
  }
`;
const tankDetail = gql`
  query tankTableData(
    $id: Int
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filter: QueryFilterEntry
  ) {
    tank(id: $id) {
      id
      parent {
        id
        description
      }
      specifications {
        capacity
        capacityUnits
        capacityGallons
      }
      readings(
        first: $first
        last: $last
        after: $after
        before: $before
        sortDirection: desc
        sortBy: timestamp
        filter: [$filter]
      ) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          node {
            timestamp
            levelPercent
            temperatureCelsius
            batteryVoltage
            levelGallons
            refillPotentialGallons
            rawQuality
          }
        }
      }
    }
  }
`;
var csvData = "";

class ClientHistoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtercondition: {},
      loading: false,
      searched: false,
      searchText: null,
      filtered: false,
      filters: {},
      formVisible: false,
      csvData: [],
      tankHistory: [],
      adlevelvalue: "",
      adlevelOp: "",
      showFilterBtn: false,
      startDate: "",
      endDate: "",
      levelGallonValue: "",
      levelGallonOp: "",
      pageCount: 1,
      pageCursor: 1,
      pagesize: 50,
      activePage: 1,
      docsCount: 10,
      totalDocsCount: 0,
      selectedTankId: "",
      dateDiff: "",
      dateFilterDiff: "",
      newEndDate: "",
      newStartDate: "",
      tankHistoryData: {},
    };

    this.submitFilters = this.submitFilters.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.exportDrawer = this.exportDrawer.bind(this);
    this.setCSV = this.setCSV.bind(this);
    // this.handlePrevPage = this.handlePrevPage.bind(this);
    // this.handleNextPage = this.handleNextPage.bind(this);

    this.columns = [
      {
        title: "Date",
        ellipsis: true,
        sorter: (a, b) => {
          if (a.node.timestamp < b.node.timestamp) {
            return -1;
          } else {
            return 1;
          }
        },
        defaultSortOrder: "descend",
        sortDirections: ["ascend", "descend"],
        key: "tankDetail.node.timestamp",
        dataIndex: "timestamp",
        render: (text, record) => (
          <span>
            {record ? moment(record.node.timestamp).format("YYYY-MM-DD") : ""}
          </span>
        ),
      },
      {
        title: "Tank Status",
        sortDirections: ["ascend", "descend"],
        sorter: (a, b) => {
          if (
            (a.node ? a.node.levelPercent * 100 : "") <
            (b.node ? b.node.levelPercent * 100 : "")
          ) {
            return -1;
          } else {
            return 1;
          }
        },
        render: (record, progress) => (
          <span>
            <Progress
              percent={Math.round(record ? record.node.levelPercent * 100 : "")}
              strokeLinecap="square"
              strokeColor={
                record != null
                  ? record.node.levelPercent * 100 >= 30
                    ? "var(--color-parrot)"
                    : record.node.levelPercent * 100 < 30 &&
                      record.node.levelPercent * 100 > 10
                    ? "var(--color-yellowish)"
                    : record.node.levelPercent * 100 < 10
                    ? "var(--color-ruby)"
                    : "var(--color-ruby)"
                  : "var(--color-ruby)"
              }
            />
          </span>
        ),
      },
      {
        title: "Current Level",
        sortDirections: ["ascend", "descend"],
        sorter: (a, b) =>
          a
            ? a.node.levelGallons === null
              ? "0 "
              : a.node.levelGallons
            : "" < b.level,
        dataIndex: "level",
        render: (text, record) => (
          <span>
            {record
              ? record.node.levelGallons === null
                ? "0 "
                : Math.round(record.node.levelGallons)
              : ""}{" "}
            G
          </span>
        ),
      },
      {
        title: "Refill Potential Gallons.",
        sortDirections: ["ascend", "descend"],
        sorter: (a, b) => {
          if (
            (a.node ? a.node.refillPotentialGallons * 100 : "") <
            (b.node ? b.node.refillPotentialGallons * 100 : "")
          ) {
            return -1;
          } else {
            return 1;
          }
        },
        dataIndex: "refillPotentialGallons",
        render: (text, record) => (
          <span>
            {record
              ? record.node.refillPotentialGallons === null
                ? "0"
                : Math.round(record.node.refillPotentialGallons)
              : ""}{" "}
            G
          </span>
        ),
      },
      {
        title: "Temp",
        sortDirections: ["ascend", "descend"],
        sorter: (a, b) => {
          if (
            (a.node ? a.node.temperatureCelsius * 100 : "") <
            (b.node ? b.node.temperatureCelsius * 100 : "")
          ) {
            return -1;
          } else {
            return 1;
          }
        },
        dataIndex: "temperatureCelsius",
        key: "tankDetail.node.temperatureCelsius",
        render: (text, record) => (
          <span>
            {record
              ? record.node.temperatureCelsius === null
                ? "0"
                : (record.node.temperatureCelsius * 1.8 + 32).toFixed(1) +
                  " " +
                  "F"
              : ""}
          </span>
        ),
      },
      {
        title: "Battery",
        sortDirections: ["ascend", "descend"],
        sorter: (a, b) => {
          if (
            (a.node ? a.node.batteryVoltage : "") <
            (b.node ? b.node.batteryVoltage : "")
          ) {
            return -1;
          } else {
            return 1;
          }
        },
        dataIndex: "batteryVoltage",
        render: (text, record) => (
          <span>
            {record
              ? record.node.batteryVoltage === null
                ? "0"
                : record.node.batteryVoltage + " " + "V"
              : "0 V"}
          </span>
        ),
      },
    ];
  }
  showForm() {
    this.setState({
      formVisible: true,
      mode: "advanced",
    });
  }

  showCustomizedForm() {
    this.setState({
      formVisible: true,
      mode: "customized",
      clicked: false,
      //   entry
    });
  }

  exportDrawer() {
    this.setState({
      exportVisibleDrawer: true,
    });
  }

  hideForm() {
    this.setState({
      formVisible: false,
      exportVisibleDrawer: false,
    });
  }

  submitFilters() {
    this.updateFiltersFromState();
    this.setState({
      filtered: true,
    });
  }
  clearFilters() {
    this.setState(
      {
        filtered: false,
        filters: {},
        filtercondition: "",
        levelGallonValue: "",
        adlevelvalue: "",
        adlevelOp: "",
        startDate: "",
        endDate: "",
        levelGallonOp: "",
        dateDiff: "",
      },
      () => {
        this.props.clearGraph();
      }
    );
  }
  updateFiltersFromState = () => {
    let filtercondition = this.state.filtercondition;
    console.log("adlevelValue", this.state.adlevelvalue);
    if (!this.state.filtered) {
      // console.log("enter inot filter condn", filters);
      if (this.state.adlevelvalue != "") {
        console.log("adlevelValue----", this.state.adlevelvalue);

        // filtercondition = {
        //   levelPercent: {
        //     op: this.state.adlevelOp,
        //     v: this.state.adlevelvalue,
        //   },
        // };
        if (
          this.state.adlevelvalue === "0.80" &&
          this.state.adlevelOp === "<="
        ) {
          filtercondition = [
            {
              levelPercent: {
                op: this.state.adlevelOp,
                v: this.state.adlevelvalue,
              },
            },

            { levelPercent: { op: ">=", v: ".30" } },
          ];
        } else if (
          this.state.adlevelvalue === "0.30" &&
          this.state.adlevelOp === "<"
        ) {
          filtercondition = [
            {
              levelPercent: {
                op: this.state.adlevelOp,
                v: this.state.adlevelvalue,
              },
            },
            { levelPercent: { op: ">=", v: "0.10" } },
          ];
        } else if (
          this.state.adlevelvalue === "0.10" &&
          this.state.adlevelOp === "<"
        ) {
          filtercondition = {
            _or: [
              {
                levelPercent: {
                  op: this.state.adlevelOp,
                  v: this.state.adlevelvalue,
                },
              },
              { levelPercent: { op: "isNull" } },
            ],
          };
        } else {
          filtercondition = {
            levelPercent: {
              op: this.state.adlevelOp,
              v: this.state.adlevelvalue,
            },
          };
        }
      } else if (this.state.startDate != "" && this.state.endDate != "") {
        let dateFilterDiff = this.state.dateFilterDiff;
        if (!moment.isMoment(this.state.startDate))
          this.state.startDate = moment(this.state.startDate);
        if (!moment.isMoment(this.state.endDate))
          this.state.endDate = moment(this.state.endDate);
        dateFilterDiff = this.state.endDate.diff(
          this.state.startDate,
          "months"
        );
        console.log(
          "date diff b/w start and end date",
          this.state.startDate,
          this.state.endDate
        );
        console.log("dateFilterDiff", dateFilterDiff);
        if (dateFilterDiff <= 13) {
          filtercondition = [
            {
              timestamp: {
                op: ">=",
                v: this.state.startDate,
              },
            },
            {
              timestamp: {
                op: "<=",
                v: this.state.endDate,
              },
            },
          ];
        } else if (
          dateFilterDiff > 13 &&
          this.state.endDate != "" &&
          this.state.startDate != ""
        ) {
          console.log("date filter diff---------", dateFilterDiff);
          let newEndDate = this.state.endDate.format("YYYY-MM-DD");
          this.state.endDate = newEndDate;
          console.log("new end date ********", this.state.endDate);
          console.log(
            "new start date ********-----------",
            this.state.startDate
          );
          if (this.state.endDate) {
            this.state.endDate = moment(this.state.endDate);
            //this.state.endDate = this.state.endDate.subtract(
            //  dateFilterDiff - 13,
            //  "months"
            //);
            this.state.startDate = this.state.endDate.subtract(13, "months");
            this.state.startDate = this.state.startDate.format("YYYY-MM-DD");
          }
          this.state.endDate = newEndDate;
          console.log("newEndDate//////", this.state.endDate);

          filtercondition = [
            {
              timestamp: {
                op: ">=",
                v: this.state.startDate,
              },
            },
            {
              timestamp: {
                op: "<=",
                v: this.state.endDate,
              },
            },
          ];
        }

        console.log("filtered date-----", filtercondition);
      } else if (
        this.state.levelGallonValue != "" &&
        this.state.levelGallonOp != ""
      ) {
        filtercondition = {
          levelGallons: {
            op: this.state.levelGallonOp,
            v: this.state.levelGallonValue,
          },
        };
      }
    }
    this.setState({ filtercondition });

    console.log("filter condtn", filtercondition);
    if (
      this.state.startDate != "" &&
      this.state.endDate != "" &&
      this.checkThreeMonthData(
        this.state.startDate,
        this.state.endDate
        // this.state.newEndDate
      )
    ) {
      this.props.updateParent(
        filtercondition,
        this.state.startDate,
        this.state.endDate
        // this.state.newEndDate
      );
    }
  };
  checkThreeMonthData(startDate, endDate) {
    // check if gap of start and end date is more than 3 months then retun true otherwise false
    let dateDiff = this.state.dateDiff;
    if (!moment.isMoment(startDate)) startDate = moment(startDate);
    if (!moment.isMoment(endDate)) {
      endDate = moment(endDate);
    }
    dateDiff = endDate.diff(startDate, "months");
    console.log("new filter start date", startDate);
    console.log("new filter end data", endDate);
    console.log("date difference", dateDiff);
    if (dateDiff > 3) {
      return true;
    } else {
      return false;
    }
  }
  updateFilter(type, value) {
    switch (type) {
      case "levelPercent":
        var op = "",
          levelValue = "";
        console.log("enter function");
        console.log("option selected", value);
        if (value === "below10") {
          op = "<";
          levelValue = "0.10";
          console.log("below 10");
        } else if (value === "below30") {
          op = "<";
          levelValue = "0.30";
        } else if (value === "30to80") {
          op = "<=";
          levelValue = "0.80";
        } else if (value === "above80") {
          op = ">=";
          levelValue = "0.80";
        }

        this.setState({
          adlevelvalue: levelValue,
          adlevelOp: op,
          showFilterBtn: true,
        });
        break;
      case "timestamp":
        console.log("select date", value);

        this.setState({
          startDate: moment(value[0]).format("YYYY-MM-DD"),
          endDate: moment(value[1]).format("YYYY-MM-DD"),
          showFilterBtn: true,
        });
        break;
      case "levelGallons":
        console.log("level gallons", value);
        let levelGallonOperator = value;
        this.setState({
          levelGallonOp: levelGallonOperator,

          showFilterBtn: true,
        });
        console.log("level gallons", levelGallonOperator);
        console.log("input value", this.state.levelGallonValue);
        break;
      default:
        console.log("Error");
    }

    console.log("tag state", value);
    console.log("level value-----", levelValue);
    console.log("level op----", op);
    console.log("level value state", this.state.adlevelvalue);
    console.log("level op state", this.state.adlevelOp);
  }

  setCSV(data) {
    console.log(1);
    let entryHistory = [];
    data.map((item) => {
      entryHistory.push({
        Date: moment(item.node.timestamp).format("YYYY-MM-DD"),
        TankStatus:
          item.node.levelPercent != null ? item.node.levelPercent * 100 : 0,
        CurrentLevel: item.node.levelGallons
          ? Math.round(item.node.levelGallons) + " " + "G"
          : "0",
        RefillPotentialGallons: item.node.refillPotentialGallons
          ? Math.round(item.node.refillPotentialGallons) + " " + "G"
          : "0",
        Temperature: item.node.temperatureCelsius
          ? (item.node.temperatureCelsius * 1.8 + 32).toFixed(1) + " " + "F"
          : "0",
        Battery: item.node.batteryVoltage
          ? item.node.batteryVoltage + " " + "V"
          : "0",
      });
      return 0;
    });
    csvData = entryHistory;
    console.log("entryHistory", csvData);
  }

  // // Function to update the query with the new results
  updateQuery = (previousResult, { fetchMoreResult }) => {
    return fetchMoreResult.posts.edges.length
      ? fetchMoreResult
      : previousResult;
  };
  render() {
    const {
      searchText,
      searched,
      filtered,
      filters,
      showFilterBtn,
      startDate,
      endDate,
      levelGallonValue,
      levelGallonOp,
      pageCount,
      pageCursor,
      pagesize,
      activePage,
      docsCount,
      totalDocsCount,
      filtercondition,
      dateDiff,
      selectedTankId,
      dateFilterDiff,
      newGraphOneDay,
      newGraphCurrentDate,
      tankHistoryData,
    } = this.state;
    console.log("Csv===", csvData);
    return (
      <div className="clientHistoryTank_table">
        <Query
          query={tankDetail}
          variables={{
            id: this.props.selectedTankId,
            last: null,
            before: null,
            after: null,
            filter: this.state.filtercondition,
            first: pagesize,
          }}
        >
          {({ data, error, loading, fetchMore }) => {
            if (loading) {
              return (
                <div>
                  <Loader />
                </div>
              );
            }
            if (error) {
              return console.log(JSON.stringify(error));
            } else if (data) {
              csvData = data.tank.readings.edges;
              console.log("tank history", data);
              console.log("tank history", data.tank.readings.totalCount);
              console.log("csvData", csvData);
              this.setCSV(data.tank.readings.edges);
              if (
                String(this.state.selectedTankId) !==
                String(this.props.selectedTankId)
              )
                this.setState({
                  tankHistoryData: { ...data.tank },
                  selectedTankId: this.props.selectedTankId,
                });
              console.log("tankHistoryData", tankHistoryData);
              return (
                data &&
                data.tank && (
                  <>
                    {/* <p>{data.tank.readings.totalCount}</p> */}
                    <Card
                      headStyle={{ fontSize: "1.5rem" }}
                      size="small"
                      title={
                        searched
                          ? `Results for "${searchText}"`
                          : "Client History"
                      }
                      extra={[
                        <Popover
                          // trigger="click"
                          content={
                            <div className="history__filter--popover">
                              <p>Tank Status : </p>
                              <Select
                                style={{ width: "100%" }}
                                placeholder="Status"
                                onChange={(value) =>
                                  this.updateFilter("levelPercent", value)
                                }
                              >
                                <Option value={"below10"}>Below 10%</Option>
                                <Option value={"below30"}>Below 30%</Option>
                                <Option value={"30to80"}>30% to 80%</Option>
                                <Option value={"above80"}>Above 80%</Option>
                              </Select>
                              <br />
                              <br />
                              <p>Select Date Range : </p>
                              <RangePicker
                                onChange={(value) =>
                                  this.updateFilter("timestamp", value)
                                }
                              />
                              <br />
                              <br />
                              <p>Level Gallons</p>
                              <div className="select_gallonWrapper">
                                <Select
                                  style={{ width: "100%" }}
                                  placeholder="level gallons"
                                  onChange={(value) =>
                                    this.updateFilter("levelGallons", value)
                                  }
                                >
                                  <Option value={">="}>
                                    Greater than equal to
                                  </Option>
                                  <Option value={"<="}>
                                    Less than equal to
                                  </Option>
                                  <Option selected value={"=="}>
                                    Equal to
                                  </Option>
                                </Select>
                                <input
                                  className="level_input"
                                  type="number"
                                  value={levelGallonValue}
                                  placeholder="Enter the value in level gallon (G)"
                                  onChange={(e) =>
                                    this.setState({
                                      levelGallonValue: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <br />
                              <br />
                              <Button
                                className="history_filterBtn"
                                style={{ width: "100%" }}
                                type={filtered ? "danger" : "primary"}
                                onClick={
                                  filtered
                                    ? this.clearFilters
                                    : this.submitFilters
                                }
                                disabled={showFilterBtn === false}
                                // disabled={Object.keys(filters).length === 0}
                              >
                                {filtered ? "Clear filters" : "Filter"}
                              </Button>
                            </div>
                          }
                          placement="bottom"
                        >
                          <Button
                            className="client_btn"
                            type="primary"
                            icon={
                              <img
                                className="icons"
                                src={filter}
                                alt="filter"
                              />
                            }
                            size="large"
                            ghost
                          >
                            Filter
                          </Button>
                        </Popover>,
                        // <Query
                        //   query={tankDetailExport}
                        //   variables={{
                        //     id: this.props.selectedTankId,
                        //     filter: this.state.filtercondition,
                        //     first: 5000,
                        //   }}
                        // >
                        //   {({ data, error, loading }) => {
                        //     if (loading) {
                        //       return (
                        //         <div>
                        //           <Loader />
                        //         </div>
                        //       );
                        //     }
                        //     if (error) {
                        //       return console.log(JSON.stringify(error));
                        //     } else if (data) {
                        //       csvData = data.tank.readings.edges;
                        //       console.log("tank history", data);
                        //       console.log(
                        //         "tank history",
                        //         data.tank.readings.totalCount
                        //       );
                        //       console.log("csvData", csvData);
                        //       this.setCSV(data.tank.readings.edges);
                        //       if (
                        //         String(this.state.selectedTankId) !==
                        //         String(this.props.selectedTankId)
                        //       )
                        //         this.setState({
                        //           tankHistoryData: {
                        //             ...data.tank.readings.edges,
                        //           },
                        //           selectedTankId: this.props.selectedTankId,
                        //         });
                        //       console.log("tankHistoryData", tankHistoryData);
                        //       return (
                        //         data &&
                        //         data.tank && (
                        <CSVLink
                          data={csvData}
                          filename={`tank_History-${data.tank.id}-${moment(
                            new Date()
                          ).format("YYYY-MM-DD")}.csv`}
                        >
                          <Button
                            size="large"
                            className="client_export--btn"
                            icon={
                              <img
                                className="icons"
                                src={fileExport}
                                alt="print"
                              />
                            }
                            type="primary"
                          >
                            Export
                          </Button>
                        </CSVLink>,
                        //         )
                        //       );
                        //     }
                        //   }}
                        // </Query>,
                      ]}
                    >
                      <Table
                        dataSource={data.tank.readings.edges}
                        columns={this.columns}
                        size="small"
                        pagination={true}
                      />

                      <div style={{ textAlign: "center" }}>
                        {data.tank.readings.totalCount >
                          data.tank.readings.edges.length && (
                          <Button
                            type="primary"
                            size="medium"
                            className="tank__loadmore"
                            onClick={() => {
                              const { endCursor } = data.tank.readings.pageInfo;
                              console.log(endCursor);
                              fetchMore({
                                variables: {
                                  after: endCursor,
                                },
                                updateQuery: (
                                  prevResult,
                                  { fetchMoreResult }
                                ) => {
                                  console.log("prevResult", prevResult);
                                  console.log(
                                    "fetchMoreResult",
                                    fetchMoreResult
                                  );
                                  fetchMoreResult.tank.readings.edges = [
                                    ...prevResult.tank.readings.edges,
                                    ...fetchMoreResult.tank.readings.edges,
                                  ];
                                  this.setState({
                                    tankHistoryData: {
                                      ...tankHistoryData,
                                      edges: [
                                        ...fetchMoreResult.tank.readings.edges,
                                      ],
                                    },
                                  });
                                  return fetchMoreResult;
                                },
                              });
                            }}
                          >
                            Load more..
                          </Button>
                        )}
                      </div>
                      {/* <div className="tab_alerts tank_alerts">
                        <span>
                          <i className="fas fa-exclamation-triangle"></i>
                          <p>({data.tank.readings.totalCount}) Tanks Found</p>
                        </span>
                      </div> */}
                    </Card>
                  </>
                )
              );
            }
          }}
        </Query>
      </div>
    );
  }
}
export default ClientHistoryTable;
