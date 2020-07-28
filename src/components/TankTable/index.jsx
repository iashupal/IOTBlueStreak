import React, { Component } from "react";
import { Table, Progress, Popover, Checkbox, Button } from "antd";
import { Link, withRouter } from "react-router-dom";
import ContentCard from "../ContentCard";
import Badge from "../Badge";
import ReactDragListView from "react-drag-listview";
import Loader from "../../components/Loader";
import ExportDrawer from "../ExportDrawer";
import AdvancedSearchForm from "../AdvancedSearchForm";
import arrowDownGrey from "../../assets/images/arrow-down-grey.png";
import wifiBlue from "../../assets/images/wifi-blue.png";
import yellowSquare from "../../assets/images/yellow-square.png";
import triangleRed from "../../assets/images/triangle-red.png";
import ellipsisBlue from "../../assets/images/ellipsis-vblue.png";
import checkBlue from "../../assets/images/check-blue.png";
import broadcastGrey from "../../assets/images/broadcast-grey.png";
import timesShadow from "../../assets/images/times-shadowed.png";
import "./index.css";
import "./styles.css";
import "../../../node_modules/antd/dist/antd.compact.css";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { data } from "jquery";
import lodash from "lodash";

const userId = localStorage.getItem("userId");

const tankAlerts = gql`
  query tankAlertsData($id: Int) {
    locationEntry(id: $id) {
      tanks(recursive: true) {
        totalCount
        aggregate {
          sum_hasHighAlarm
          sum_hasMediumOrHigherAlarm
          sum_highAlarmCnt
          sum_mediumOrHigherAlarmCnt
        }
      }
    }
  }
`;
const tankTable = gql`
  query tankTableData(
    $id: Int
    $first: Int
    $last: Int
    $after: String
    $filter: QueryFilterEntry
    $before: String
  ) {
    locationEntry(id: $id) {
      tanks(
        first: $first
        last: $last
        recursive: true
        after: $after
        before: $before
        filter: [$filter]
        sortDirection: asc
        sortBy: levelPercent
      ) {
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

const popoverAlert = (
  <div>
    <ContentCard
      styleName="card_alertyellow card_popover"
      contents={[
        <div className="alerts">
          <img src={arrowDownGrey} alt="download" />
          <p>30% Capacity</p>
          <img src={yellowSquare} alt="square" />
        </div>,
      ]}
    />
    <ContentCard
      styleName="card_alertred card_popover"
      contents={[
        <div className="alerts">
          <img style={{ width: 18 }} src={broadcastGrey} alt="download" />
          <p>20%</p>
          <img src={arrowDownGrey} alt="square" />
          <p>Time</p>
          <img src={triangleRed} alt="triangle" />
        </div>,
      ]}
    />
  </div>
);

class TankTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false,
      exportVisibleDrawer: false,
      docsCount: 10,
      selectedId: userId,
      selectedRowKeys: [],
      selectionEnabled: false,
      selectedTankId: "",
      counter: 0,
      pageSize: 10,
      currentPage: 1,
      checked: false,
      pageData: {},
      filtercondition: {},
      filteredByDate: false,
      columns: [
        {
          title: "Tank Number",
          ellipsis: true,
          width: "10%",
          key: "tanksDetail.node.id",
          dataIndex: "id",
          sorter: (a, b) => {
            if (
              (a.node ? a.node.externalId : "") <
              (b.node ? a.node.externalId : "")
            ) {
              return -1;
            } else {
              return 1;
            }
          },
          sortDirections: ["ascend", "descend"],
          render: (text, record) => (
            <Link to={`/tank-details/${record.node.id}`}>
              <span>{record.node ? record.node.externalId : ""}</span>
            </Link>
          ),
        },
        {
          title: "Tank Name",
          ellipsis: true,
          width: "10%",
          key: "tanksDetail.node.description",
          dataIndex: "Name",
          sorter: (a, b) => {
            if (
              (a.node ? a.node.description : "") <
              (b.node ? b.node.description : "")
            ) {
              return -1;
            } else {
              return 1;
            }
          },
          sortDirections: ["ascend", "descend"],
          render: (text, record) => (
            <span>{record.node ? record.node.description : ""}</span>
          ),
        },
        {
          title: "Tank Status",
          defaultSortOrder: "ascend",
          sortDirections: ["ascend", "descend"],
          sorter: (a, b) => {
            if (
              (a.node.latestReading
                ? a.node.latestReading.levelPercent * 100
                : "") <
              (b.node.latestReading
                ? b.node.latestReading.levelPercent * 100
                : "")
            ) {
              return -1;
            } else {
              return 1;
            }
          },
          width: "10%",

          render: (progress, record) => (
            <span>
              <Progress
                percent={Math.round(
                  record.node.latestReading
                    ? record.node.latestReading.levelPercent * 100
                    : ""
                )}
                strokeLinecap="square"
                strokeColor={
                  record.node.latestReading != null
                    ? record.node.latestReading.levelPercent * 100 >= 30
                      ? "var(--color-parrot)"
                      : record.node.latestReading.levelPercent * 100 < 30 &&
                        record.node.latestReading.levelPercent * 100 > 10
                      ? "var(--color-yellowish)"
                      : record.node.latestReading.levelPercent * 100 < 10
                      ? "var(--color-ruby)"
                      : "var(--color-ruby)"
                    : "var(--color-ruby)"
                }
              />
            </span>
          ),
        },

        {
          title: <img className="tank_img" src={wifiBlue} alt="wifi" />,
          width: "4%",
          render: (text, record) => (
            <span>
              {record.node.alarms.alarmType === "sensorMissedReportsAlarm" &&
              record.node.alarms.alarming === true ? (
                <img className="tank_img" src={checkBlue} alt="check" />
              ) : (
                <img className="tank_img" src={timesShadow} alt="cross" />
              )}
            </span>
          ),
        },
        {
          title: (text) => (
            <Query
              query={tankTable}
              variables={{
                id: this.props.selectedTankId,
                after: null,
                before: null,
                filter: this.state.filtercondition,
              }}
            >
              {({ data, error, loading }) => {
                //  <>
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
                  console.log("alert id", this.props.selectedTankId);
                  console.log("alerts ", data);
                  console.log(
                    "medium alarm",
                    data.locationEntry.tanks.aggregate.sum_highAlarmCnt
                  );
                  return (
                    data &&
                    data.locationEntry && (
                      <div className="tab_alerts">
                        <span>Alerts</span>
                        <img
                          className="tank_img"
                          src={yellowSquare}
                          alt="square"
                        />
                        <span>
                          {data.locationEntry
                            ? data.locationEntry.tanks
                              ? data.locationEntry.tanks.aggregate
                                  .sum_mediumOrHigherAlarmCnt -
                                data.locationEntry.tanks.aggregate
                                  .sum_highAlarmCnt
                              : 0
                            : ""}
                        </span>
                        <img
                          className="tank_img"
                          src={triangleRed}
                          alt="square"
                        />
                        <span>
                          {" "}
                          {data.locationEntry
                            ? data.locationEntry.tanks
                              ? data.locationEntry.tanks.aggregate
                                  .sum_highAlarmCnt
                              : 0
                            : ""}
                        </span>
                      </div>
                    )
                  );
                }
              }}
            </Query>
          ),

          sorter: (a, b) => a.tankNum - b.tankNum,
          sortDirections: ["descend", "ascend"],
          width: "25%",
          render: (record) => {
            const alarmValues = { high: 0, medium: 0 };
            record.node.alarms
              .filter(({ alarming }) => alarming)
              .forEach(({ priority }) => {
                priority >= 500 && priority <= 999
                  ? alarmValues.medium++
                  : alarmValues.high++;
              });

            const highOrMedium = alarmValues.high >= alarmValues.medium;
            return (
              <span>
                <span>
                  <ContentCard
                    styleName={
                      highOrMedium ? "card_alertred" : "card_alertyellow"
                    }
                    contents={[
                      <div className="alerts">
                        <p>{highOrMedium ? "High" : "Medium"}</p>
                        <img
                          className="alert_redtriangle"
                          src={highOrMedium ? triangleRed : yellowSquare}
                          alt="square"
                        />
                      </div>,
                    ]}
                  />
                  <Popover
                    placement="bottomLeft"
                    content={popoverAlert}
                    trigger="hover"
                  >
                    <Badge
                      badgeImg={yellowSquare}
                      countAlert={alarmValues.medium}
                    />
                    <Badge
                      badgeImg={triangleRed}
                      countAlert={alarmValues.high}
                    />
                  </Popover>
                </span>
              </span>
            );
          },
        },
        {
          title: "Commodity",
          sortDirections: ["descend", "ascend"],
          dataIndex: "propane",
          width: "10%",
          render: (text, record) => <span>Propane</span>,
        },
        {
          title: "Current Volume",
          sortDirections: ["ascend", "descend"],
          sorter: (a, b) => {
            if (
              (a.node.latestReading
                ? a.node.latestReading.levelPercent != null
                  ? a.node.latestReading.levelPercent *
                    100 *
                    (a.node.specifications
                      ? a.node.specifications.capacityGallons / 100
                      : 0)
                  : 0
                : "0") <
              (b.node.latestReading
                ? b.node.latestReading.levelPercent != null
                  ? b.node.latestReading.levelPercent *
                    100 *
                    (b.node.specifications
                      ? b.node.specifications.capacityGallons / 100
                      : 0)
                  : 0
                : "0")
            ) {
              return -1;
            } else {
              return 1;
            }
          },
          dataIndex: "volume",
          width: "10%",
          render: (text, record) => (
            <span>
              {record.node.latestReading
                ? record.node.latestReading.levelPercent != null
                  ? record.node.latestReading.levelPercent *
                    100 *
                    (record.node.specifications
                      ? record.node.specifications.capacityGallons / 100
                      : 0)
                  : 0
                : "0"}{" "}
              G
            </span>
          ),
        },
        {
          title: "Refill Potential",
          sortDirections: ["ascend", "descend"],
          sorter: (a, b) => {
            if (
              (a.node.latestReading
                ? a.node.latestReading.refillPotentialGallons != null
                  ? a.node.latestReading.refillPotentialGallons
                  : "0"
                : "0") <
              (b.node.latestReading
                ? b.node.latestReading.refillPotentialGallons != null
                  ? b.node.latestReading.refillPotentialGallons
                  : "0"
                : "0")
            ) {
              return -1;
            } else {
              return 1;
            }
          },
          dataIndex: "potential",
          width: "10%",
          render: (text, record) => (
            <span>
              {record.node.latestReading
                ? record.node.latestReading.refillPotentialGallons != null
                  ? record.node.latestReading.refillPotentialGallons
                  : "0"
                : "0"}{" "}
              G
            </span>
          ),
        },
        {
          title: "Tank Capacity",
          sortDirections: ["ascend", "descend"],
          sorter: (a, b) => {
            if (
              (a.node.specifications
                ? a.node.specifications.capacityGallons
                : "") <
              (b.node.specifications
                ? b.node.specifications.capacityGallons
                : "")
            ) {
              return -1;
            } else {
              return 1;
            }
          },
          dataIndex: "capacityGallons",
          width: "10%",
          render: (text, record) => (
            <span>
              {record.node.specifications
                ? record.node.specifications.capacityGallons
                : ""}{" "}
              G
            </span>
          ),
        },
        {
          title: (
            <Popover
              placement="bottomRight"
              content={
                <div className="tank_menu">
                  <ul>
                    <li onClick={this.exportDrawer}>
                      <i className="fas fa-file-export"></i>
                      <p>Export</p>
                    </li>
                    <li>
                      {/* <i className="fas fa-check-square"></i> */}
                      {/* <p>Select Multiple</p> */}
                      <Checkbox
                        // checked={this.state.selectionEnabled}
                        onChange={this.setSelection}
                      >
                        <p>Select Multiple</p>
                      </Checkbox>
                    </li>

                    <li onClick={this.showCustomizedForm}>
                      <i className="fas fa-sliders-h"></i>
                      <p>Customize View</p>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fas fa-save"></i>
                        <p>Save Current View</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              }
              // trigger="click"
            >
              <img
                style={{ width: 5, cursor: "pointer" }}
                src={ellipsisBlue}
                alt="ellipsis dot"
              />
            </Popover>
          ),
          width: "2%",
        },
      ],
    };
    this.hideForm = this.hideForm.bind(this);
    this.showCustomizedForm = this.showCustomizedForm.bind(this);
    this.exportDrawer = this.exportDrawer.bind(this);

    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const columns = [...that.state.columns];
        // const data =
        const item = columns.splice(fromIndex, 1)[0];
        columns.splice(toIndex, 0, item);
        that.setState({
          columns,
        });
      },
      nodeSelector: "th",
    };
  }

  loadMoreButton(count) {}
  componentDidMount() {
    this.updateFiltersFromProps();
  }

  componentDidUpdate(prevProps) {
    const prevPropsValues = {
      adSearchValue: prevProps.adSearchValue,
      adCommodityValue: prevProps.adCommodityValue,
      adLevelValue: prevProps.adLevelValue,
      adLevelOP: prevProps.adLevelOP,
      adAlert: prevProps.adAlert,
      adSensor: prevProps.adSensor,
      adTankSiveV: prevProps.adTankSiveV,
      adTankSiveOP: prevProps.adTankSiveOP,
      filterTableFromGraph: prevProps.filterTableFromGraph,
    };

    const currentPropsValues = {
      adSearchValue: this.props.adSearchValue,
      adCommodityValue: this.props.adCommodityValue,
      adLevelValue: this.props.adLevelValue,
      adLevelOP: this.props.adLevelOP,
      adAlert: this.props.adAlert,
      adSensor: this.props.adSensor,
      adTankSiveV: this.props.adTankSiveV,
      adTankSiveOP: this.props.adTankSiveOP,
      filterTableFromGraph: this.props.filterTableFromGraph,
    };

    if (!lodash.isEqual(prevPropsValues, currentPropsValues)) {
      this.updateFiltersFromProps();
    }
  }

  updateFiltersFromProps = () => {
    var filtercondition = [];
    if (this.props.adSearchValue != "")
      filtercondition.push({
        description: { op: "match", v: this.props.adSearchValue },
      });

    if (this.props.adLevelValue != "") {
      if (this.props.adLevelValue === "0.80" && this.props.adLevelOP === "<") {
        filtercondition.push({
          levelPercent: {
            op: this.props.adLevelOP,
            v: this.props.adLevelValue,
          },
          levelPercent: { op: ">", v: ".30" },
        });
      } else
        filtercondition.push({
          levelPercent: {
            op: this.props.adLevelOP,
            v: this.props.adLevelValue,
          },
        });
    }

    if (this.props.adAlert == "High") {
      filtercondition.push({ highAlarmCnt: { op: ">", v: 0 } });
    }
    if (this.props.adAlert == "Medium") {
      filtercondition.push({ mediumAlarmCnt: { op: ">", v: 0 } });
    }
    if (this.props.adSensor == "Online") {
      filtercondition.push({
        alarmingTypes: { op: "in", v: "sensorMissedReportsAlarm" },
      });
    }
    if (this.props.adSensor == "Offline") {
      filtercondition.push({
        alarmingTypes: { op: "not in", v: "sensorMissedReportsAlarm" },
      });
    }
    if (this.props.adTankSiveV != "" && this.props.adTankSiveOP != "")
      filtercondition.push({
        capacityGallons: {
          op: this.props.adTankSiveOP,
          v: this.props.adTankSiveV,
        },
      });

    console.log("this.props.adAler", filtercondition);

    this.setState({ filtercondition });
  };

  showForm() {
    this.setState({
      formVisible: true,
      mode: "advanced",
    });
  }

  showCustomizedForm = () => {
    this.setState({
      formVisible: true,
      mode: "customized",
      clicked: false,
      //   entry
    });
  };

  exportDrawer = () => {
    this.setState({
      exportVisibleDrawer: true,
    });
  };

  hideForm() {
    this.setState({
      formVisible: false,
      exportVisibleDrawer: false,
    });
  }
  // applyDateFilter = (from, to) => {
  //   let filters = [...this.state.filtercondition];
  //   if (from && to) {
  //     filters = [
  //       {
  //         timestamp: { op: ">=", v: new Date(from).toISOString() },
  //       },
  //       {
  //         timestamp: { op: "<=", v: new Date(to).toISOString() },
  //       },
  //     ];

  //     // Object.assign(filters, {
  //     //   timestamp: { op: ">=", v: new Date(from).toISOString() },
  //     //   timestamp: { op: "<=", v: new Date(to).toISOString() },
  //     // });
  //   } else {
  //     delete filters.splice(0, 1);
  //   }
  //   this.setState({
  //     filtercondition: filters,
  //     filteredByDate: true,
  //     selectedRowKeys: 0,
  //   });
  //   console.log("filterby date", filters);
  // };

  onSelectChange = (selectedRowKeys) => {
    if (selectedRowKeys.length > 1) {
      const lastSelectedRowIndex = [...selectedRowKeys].pop();
      this.setState({ selectedRowKeys: lastSelectedRowIndex });
    }
    this.setState({ selectedRowKeys });
    console.log("selectedRowKeys changed: ", selectedRowKeys);
  };
  setSelection = (e) => {
    this.setState({
      selectedRowKeys: [],
      selectionEnabled: e.target.checked,
    });
    console.log("selectedKeys", this.state.selectedRowKeys);
  };
  redirectToHome = (record) => {
    const { history } = this.props;
    if (history) history.push(`/tank-details/${record.node.id}`);
  };
  addAlertCounter = (alarm) => {
    if (alarm.alarming === true) {
    }
  };
  render() {
    const { history } = this.props;
    const {
      formVisible,
      mode,
      entry,
      exportVisibleDrawer,
      selectedRowKeys,
      selectionEnabled,
      pageSize,
      currentPage,
      pageData,
      filteredByDate,
      filtercondition,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      type: "checkbox",
    };
    console.log("anjaliaaaa", data.locationEntry);
    //const renderAuthrrButton = () => {
    //    if (data.locationEntry.tanks.totalCount > data.locationEntry.tanks.edges.length) {
    //        return <button>Logout</button>
    //    } else {
    //        return <button>Login</button>
    //    }
    //}

    return (
      <div className="tank_table">
        <Query
          query={tankTable}
          variables={{
            id: this.props.selectedTankId,
            after: null,
            before: null,
            filter: filtercondition,
            first: pageSize,
          }}
        >
          {({ data, error, loading, fetchMore }) => {
            //  <>
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
              if (
                filteredByDate ||
                !Object.keys(pageData).length ||
                String(this.state.selectedTankId) !==
                  String(this.props.selectedTankId)
              )
                this.setState({
                  pageData: { ...data.locationEntry.tanks },
                  selectedTankId: this.props.selectedTankId,
                  filteredByDate: false,
                });
              console.log("tankTable", data);
              console.log(
                "high alarm",
                data.locationEntry.tanks.aggregate.sum_hasHighAlarm
              );
              return (
                data &&
                data.locationEntry && (
                  <>
                    <ReactDragListView.DragColumn {...this.dragProps}>
                      <Table
                        dataSource={data.locationEntry.tanks.edges}
                        columns={this.state.columns}
                        size="small"
                        onRow={(record) => {
                          return {
                            onClick: (event) => {
                              this.redirectToHome(record);
                            },
                          };
                        }}
                        rowKey={(record) => record.node.id}
                        rowSelection={selectionEnabled ? rowSelection : null}
                        scroll={{ x: 1300 }}
                        pagination={true}
                      />
                      <div style={{ textAlign: "center" }}>
                        {data.locationEntry.tanks.totalCount >
                          data.locationEntry.tanks.edges.length && (
                          <Button
                            type="primary"
                            size="medium"
                            className="tank__loadmore"
                            onClick={() => {
                              const {
                                endCursor,
                              } = data.locationEntry.tanks.pageInfo;
                              console.log(endCursor);
                              fetchMore({
                                variables: { after: endCursor },
                                updateQuery: (
                                  prevResult,
                                  { fetchMoreResult }
                                ) => {
                                  console.log("prevResult", prevResult);
                                  console.log(
                                    "fetchMoreResult",
                                    fetchMoreResult
                                  );
                                  fetchMoreResult.locationEntry.tanks.edges = [
                                    ...prevResult.locationEntry.tanks.edges,
                                    ...fetchMoreResult.locationEntry.tanks
                                      .edges,
                                  ];
                                  this.setState({
                                    pageData: {
                                      ...pageData,
                                      edges: [
                                        ...fetchMoreResult.locationEntry.tanks
                                          .edges,
                                      ],
                                    },
                                  });
                                  // if (!fetchMoreResult)
                                  //   return [...prevResult, ...fetchMoreResult];
                                  // return fetchMoreResult;
                                  return fetchMoreResult;
                                },
                              });
                            }}
                          >
                            Load more..
                          </Button>
                        )}
                      </div>
                    </ReactDragListView.DragColumn>

                    <div className="tab_alerts tank_alerts">
                      <span>
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>
                          ({data.locationEntry.tanks.totalCount}) Tanks Found
                        </p>
                      </span>
                      <span>
                        <i className="fas fa-fire-alt"></i>
                        <p>
                          ({data.locationEntry.tanks.aggregate.sum_allAlarmCnt})
                          Alerts
                        </p>
                      </span>
                    </div>
                  </>
                )
              );
            }
          }}
        </Query>

        <AdvancedSearchForm
          visible={formVisible}
          showCustomizedForm={this.showCustomizedForm}
          hideForm={this.hideForm}
          mode={mode}
          entry={entry}
        />
        <ExportDrawer
          visible={exportVisibleDrawer}
          exportDrawer={this.exportDrawer}
          hideForm={this.hideForm}
          selectedCheckboxKeys={selectedRowKeys}
          tanksDataId={this.props.selectedTankId}
          tankData={pageData}
          tankFilteredData={filtercondition}

          // applyDateFilter={(from, to) => this.applyDateFilter(from, to)}
        />
      </div>
    );
  }
}

export default withRouter(TankTable);
