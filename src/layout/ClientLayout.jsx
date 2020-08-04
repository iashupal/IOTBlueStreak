import React, { Component, Fragment } from "react";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import ClientHistoryTable from "../components/ClientHistoryTable";
import AdvancedSearchForm from "../components/AdvancedSearchForm";
import ContentCard from "../components/ContentCard";
import AnimatedTank from "../components/Chart/AnimatedTank";
import Heading from "../components/Heading";
import TankInfo from "../components/TankInfo";
import arrowLeft from "../assets/images/arrow-left-blue.png";
import dropBlue from "../assets/images/drop-blue.png";
import triangleRed from "../assets/images/triangle-red.png";
import Loader from "../components/Loader";
import wifiGrey from "../assets/images/wifi-grey.png";
import wifiGreen from "../assets/images/wifi-green.png";
import "./styles.css";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import LineChart from "../components/LineChart";
import { easeQuadInOut } from "d3-ease";
const username = localStorage.getItem("username");

const tankDetail = gql`
  query tankTableData($id: Int) {
    tank(id: $id) {
      id
      externalId
      description
      sensor {
        serialNumber
        id
        lastReportTimestamp
      }
      specifications {
        capacityGallons
        capacity
        capacityUnits
        vertical
        heightMeters
        widthMeters
      }
      parent {
        id
        description
        ... on GatewayLocation {
          parent {
            id
            description
            ... on LocationEntry {
              parent {
                id
                description
              }
            }
          }
        }
      }
      latestReading {
        gateway {
          serialNumber
          mostRecentTimestamp
        }
        refillPotentialGallons
        levelPercent
        rawQuality
        temperatureCelsius
        batteryVoltage
        levelGallons
      }
      alarms {
        alarmType
        priority
        alarming
        parentType
        triggeredAt
        clearedAt
        parent {
          id
          description
        }
      }
      readings(first: 10) {
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

class ClientLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false,
      username: username,
      description: "",
      selectid: this.props.match.params.id,
      filterChildData: {},
      startDate: "",
      endDate: "",
      oneDay: "",
      newCurrentDate: "",
      clearGraph: false,
      // showBack: location.hash.split("?")[0] !== "#/",
    };
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.handleBack = this.handleBack.bind(this);
    // this.hook = hashHistory.listenBefore((loc) =>
    //   this.setState({ showBack: loc.pathname !== "/" })
    // );
  }
  // componentWillUnmount() {
  //   this.hook(); //unlisten
  // }
  showForm() {
    this.setState({
      formVisible: true,
      mode: "advanced",
    });
  }
  hideForm() {
    this.setState({
      formVisible: false,
    });
  }
  handleChildClientHistory = (filtercondition, startDate, endDate) => {
    console.log("filter child data", filtercondition, startDate, endDate);
    this.setState({ filterChildData: filtercondition });
    this.setState({ startDate: startDate });
    this.setState({ endDate: endDate });
  };
  handleBack() {
    this.props.history.goBack();
  }
  render() {
    console.log("line to client newCurrentDate", this.state.newCurrentDate);
    let { data } = this.props;
    if (data.loading) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
    console.log("selectid", this.state.selectid);
    console.log("selectedTankId", this.state.selectid);
    console.log("tank specific detail", data);
    console.log("id", this.props.match.params.id);
    // console.log("desc", data.tank.description);
    console.log("triggeredat", data.tank.alarms[3].triggeredAt);
    const {
      formVisible,
      description,
      username,
      mode,
      entry,
      selectid,
      filterChildData,
      startDate,
      endDate,
      clearGraph,
    } = this.state;
    return (
      <Fragment>
        <Header
          tankdescription={data.tank ? data.tank.parent.parent.description : ""}
          tankIdWithName={
            data.tank ? `${data.tank.id} ${data.tank.description}` : ""
          }
          username={username}
        />
        <div className="cards">
          <div className="client_wrapper">
            {/* section 1 */}
            <div className="client_top--content">
              <div className="client_left--content" onClick={this.handleBack}>
                <img className="hide_form" src={arrowLeft} alt="back_arrow" />
                <p>
                  {data.tank
                    ? data.tank.parent
                      ? data.tank.parent.description
                      : ""
                    : ""}
                </p>
                {/* </Link> */}
              </div>
              {/* )} */}
              <div className="client_right--content">
                {/* <Search
                  saveIcon
                  styleName="client_search"
                  saveiconStyle="iconStyle"
                />
                <Button
                  className="client_btn"
                  type="primary"
                  icon={<img className="icons" src={filter} alt="filter" />}
                  size="large"
                  ghost
                >
                  Filter
                </Button>
                <Button
                  icon={<img className="icons" src={setting} alt="setting" />}
                  className="client_btn"
                  type="primary"
                  size="large"
                  ghost
                  onClick={this.showForm}
                >
                  Advanced Search
                </Button>
                <Button
                  size="large"
                  className="client_export--btn"
                  icon={<img className="icons" src={fileExport} alt="print" />}
                  type="primary"
                >
                  Export
                </Button> */}
              </div>
            </div>
            {/* section 2 */}
            <div className="client_section2">
              <div className="client_LeftSectn">
                <div className="client_inr--divisn">
                  <div className="client_inr--divisn">
                    <AnimatedTank
                      percentage={
                        data.tank
                          ? data.tank.latestReading
                            ? data.tank.latestReading.levelPercent * 100
                            : ""
                          : ""
                      }
                      duration={1.4}
                      easingFunction={easeQuadInOut}
                      image={dropBlue}
                      percentageSign="%"
                    />
                    <div>
                      <Heading
                        heading={data.tank ? data.tank.id : ""}
                        fontSize="20px"
                      />
                      <Heading
                        heading={data.tank ? data.tank.description : ""}
                        fontSize="20px"
                      />
                    </div>
                  </div>
                  {/* <ContentCard
                    contents={[
                      <div className="client_graph--days">
                        <div className="cleient_graphs">
                          <div className="client_graph--tanks">
                            <div>
                              <AnimatedTank
                                lostpercentage
                                graphDesignStyle
                                percentage={66}
                                duration={1.4}
                                easingFunction={easeQuadInOut}
                                percentageSign="%"
                                percntgStatus="UP TIME"
                              />
                              <img
                                className="client_graph-icons"
                                src={broadcastBlue}
                                alt="broadcast"
                              />
                              <div>
                                <img
                                  className="client_graph-icons"
                                  src={checkGreen}
                                  alt="check_mark"
                                />
                                <p>Good Signal</p>
                              </div>
                            </div>
                            <div>
                              <AnimatedTank
                                lostpercentage
                                graphDesignStyle
                                percentage={66}
                                duration={1.4}
                                easingFunction={easeQuadInOut}
                                percentageSign="%"
                                percntgStatus="SUCCESSFUL"
                              />
                              <img
                                className="client_graph-icons"
                                src={wifiBlue}
                                alt="broadcast"
                              />
                              <div>
                                <img
                                  className="client_graph-icons"
                                  src={checkGreen}
                                  alt="check_mark"
                                />
                                <p>Good Signal</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Divider type="vertical" />
                        <div>
                          <div style={{ marginBottom: "10px" }}>
                            <div className="client_tank-signals">
                              <img
                                className="client_graph-icons"
                                src={broadcastBlue}
                                alt="broadcast"
                              />
                              <h3>54</h3>
                              <span>days</span>
                            </div>
                            <p>Consecutive days with a good signal</p>
                          </div>
                          <div>
                            <div className="client_tank-signals">
                              <img
                                className="client_graph-icons"
                                src={wifiBlue}
                                alt="broadcast"
                              />
                              <h3>26</h3>
                              <span>days</span>
                            </div>
                            <p>Consecutive days with a good Reading</p>
                          </div>
                        </div>
                      </div>,
                    ]}
                  /> */}
                </div>
                {/* left inr section */}
                <div className="client_tank--detailedInfo">
                  <div>
                    <TankInfo
                      tankHead="Current Level(L)"
                      tankDetail={
                        data.tank
                          ? data.tank.latestReading
                            ? data.tank.latestReading.levelGallons === null
                              ? "0"
                              : Math.round(
                                  data.tank.latestReading.levelGallons
                                ) +
                                " " +
                                "G"
                            : "0"
                          : 0
                      }
                    />
                    <TankInfo
                      tankHead="Refill Potential"
                      tankDetail={
                        data.tank
                          ? data.tank.latestReading
                            ? data.tank.latestReading.refillPotentialGallons ===
                              null
                              ? "0"
                              : Math.round(
                                  data.tank.latestReading.refillPotentialGallons
                                ) +
                                " " +
                                "G"
                            : "0"
                          : 0
                      }
                    />
                    {/* <TankInfo
                      tankHead="# of Alerts Last 30 Days"
                      tankDetail="1"
                    /> */}
                  </div>
                  <div>
                    <TankInfo
                      tankHead="Current Temp."
                      tankDetail={
                        data.tank
                          ? data.tank.latestReading
                            ? data.tank.latestReading.temperatureCelsius ===
                              null
                              ? "0"
                              : (
                                  data.tank.latestReading.temperatureCelsius *
                                    1.8 +
                                  32
                                ).toFixed(1) +
                                " " +
                                "F"
                            : "0"
                          : 0
                      }
                    />
                    {/* <TankInfo
                      tankHead="Avg. Temp. Last 30 Days"
                      tankDetail="42 F"
                    /> */}
                    <TankInfo
                      tankHead="Battery"
                      tankDetail={
                        data.tank
                          ? data.tank.latestReading
                            ? data.tank.latestReading.batteryVoltage === null
                              ? "0"
                              : data.tank.latestReading.batteryVoltage +
                                " " +
                                "V"
                            : "0"
                          : 0
                      }
                    />
                  </div>
                  <div className="client_top--alerts">
                    <h3>Most Recent Alert</h3>
                    <div className="client_alerts--detailedData">
                      {data.tank.alarms.alarmType ===
                        "sensorMissedReportsAlarm" &&
                      data.tank.alarms.alarming === true ? (
                        <ContentCard
                          styleName="card_online card_popover"
                          contents={[
                            <div className="alerts top_alerts">
                              <img
                                style={{ width: 18 }}
                                src={wifiGreen}
                                alt="download"
                              />

                              <p> - ONLINE</p>

                              {/* <img
                                className="alert_redtriangle"
                                src={triangleRed}
                                alt="triangle"
                              /> */}
                            </div>,
                          ]}
                        />
                      ) : (
                        <ContentCard
                          styleName="card_alertred card_popover"
                          contents={[
                            <div className="alerts top_alerts">
                              <img
                                style={{ width: 18 }}
                                src={wifiGrey}
                                alt="download"
                              />

                              <p> - OFFLINE</p>

                              <img
                                className="alert_redtriangle"
                                src={triangleRed}
                                alt="triangle"
                              />
                            </div>,
                          ]}
                        />
                      )}
                      <p className="alert_time">
                        {data.tank.alarms.alarmType ===
                        "sensorMissedReportsAlarm"
                          ? ""
                          : moment
                              .utc(data.tank.alarms[3].triggeredAt)
                              .format("YYYY-MM-DD HH:mm")}

                        {/* 3/15/20 - 3:30pm */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="client_RghtSectn">
                <LineChart
                  selectedTankId={selectid}
                  passFilteredData={filterChildData}
                  startDate={startDate}
                  endDate={endDate}
                  clearGraph={clearGraph}
                  clearGraphFilter={() => this.setState({ clearGraph: false })}
                />
              </div>
            </div>
            {/* section 3 */}
            <div className="vertrax_clientLayout">
              <ClientHistoryTable
                selectedTankId={selectid}
                updateParent={this.handleChildClientHistory}
                clearGraph={() => this.setState({ clearGraph: true })}
              />
            </div>
          </div>
          <AdvancedSearchForm
            visible={formVisible}
            showForm={this.showForm}
            hideForm={this.hideForm}
            mode={mode}
            entry={entry}
          />
        </div>
      </Fragment>
    );
  }
}

export default graphql(tankDetail, {
  options: (props) => {
    return {
      variables: {
        id: props.match.params.id,
        username: username,
      },
    };
  },
})(ClientLayout);
// export default ClientLayout;
