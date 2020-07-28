import React, { Fragment, Component } from "react";
import Header from "../components/Header";
import { Layout } from "antd";
import ArrowButton from "../components/ArrowButton";
import MainCard from "../components/MainCard";
import { Button } from "antd";
import cogBlue from "../assets/images/cog-blue.png";
import Search from "../components/Search";
import Tab from "../components/Tab";
import SubTabs from "../components/SubTabs";
import DeepSubTab from "../components/DeepSubTab";
import GatewayTab from "../components/GatewayTab";
import GatewayTankTab from "../components/GatewayTankTab";
import TankTable from "../components/TankTable";
import AdvancedSearchForm from "../components/AdvancedSearchForm";
import "./styles.css";
import { gql } from "apollo-boost";
import { graphql, Query } from "react-apollo";
import Loader from "../components/Loader";
import SideNav from "../components/SideNav";
import {
  RightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { subscribe } from "graphql";
import { type } from "jquery";
const userId = localStorage.getItem("userId");
const username = localStorage.getItem("username");

const leftPanel = gql`
  query leftPanelData($id: Int) {
    locationEntry(id: $id) {
      ... on Location {
        sublocations(first: 100, sortDirection: asc, sortBy: description) {
          totalCount
          edges {
            node {
              __typename
              id
              description
            }
          }
        }
      }
    }
  }
`;

// const leftGatewayQuery = gql`
//   query leftGatewayPanelData($id: Int) {
//     locationEntry(id: $id) {
//       ... on GatewayLocation {
//         tanks(first: 100) {
//           edges {
//             node {
//               __typename
//               id
//               description
//             }
//           }
//         }
//       }
//     }
//   }
// `;

const { Sider, Content } = Layout;
class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftPanelData: [],
      wholeCard: false,
      username: username,
      tab: "",
      subTab: "",
      formVisible: false,
      tankId: "",
      selectid: userId,
      typename: "",
      description: "",
      subDescription: "",
      deepSubTabDesc: "",
      gatewayTabDesc: "",
      gatewayTankTabDesc: "",
      searchValue: "",
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
      adAlert: "",
      adSensor: "",
      adTankSiveV: "",
      adTankSiveOP: "",
      selectedTab: false,
      selectedSubTab: false,
      selectedDeepSubTab: false,
      selectedGatewayTab: false,
      selectedGatewayTankTab: false,
      advanceReset: false,
      subChildId: "",
      subTabId: "",
      gatewayId: "",
      gatewayTankId: "",
      adCommodityValue: "Propane",
      collapsed: false,
      filterTableFromGraph: "",
    };
    this.changeFullTab = this.changeFullTab.bind(this);
    this.changeHalfTab = this.changeHalfTab.bind(this);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.onSearchingAdvance = this.onSearchingAdvance.bind(this);
    this.onsavingAdvanceSearch = this.onsavingAdvanceSearch.bind(this);
  }
  toggleCollapse = () => this.setState({ collapsed: !this.state.collapsed });
  onsavingAdvanceSearch() {
    console.log("savingAdvanceSearch");
    this.setState({
      formVisible: false,
    });
    //console.log("testing state",this.state.advanceSerachValue);
  }

  onSearchingAdvance(
    valueadvance,
    tankStatus,
    alert,
    sensor,
    tankSizeV,
    tankSizeO
  ) {
    var op = "",
      value = "";
    if (tankStatus === "Below 10%") {
      op = "<";
      value = "0.10";
    } else if (tankStatus === "Below 30%") {
      op = "<";
      value = "0.30";
    } else if (tankStatus === "30% to 80%") {
      op = "<";
      value = "0.80";
    } else if (tankStatus === "Above 80%") {
      op = ">";
      value = "0.80";
    }

    this.setState(
      {
        advanceReset: false,
        formVisible: false,
        adserchtxt: valueadvance,
        adlevelvalue: value,
        adlevelOp: op,
        adAlert: alert,
        adSensor: sensor,
        adTankSiveV: tankSizeV,
        adTankSiveOP: tankSizeO,
      },

      function () {
        console.log("function state", this.state.adserchtxt);
      }
    );
    //console.log("anjali", tagValue2)
    //console.log("tag alert", this.state.adlevelOp);
  }
  changeFullTab() {
    this.setState({ wholeCard: true });
  }

  changeHalfTab() {
    this.setState({ wholeCard: false });
  }
  searchTextfromleftTab(searchtext) {
    this.setState({ searchValue: searchtext });
  }

  changeTab = (tab, id, desc, typename, tabDeselectCondition) => {
    localStorage.setItem("userId", id);
    this.state.subChildId = id;
    if (tabDeselectCondition === true) {
      tab = "";
      id = userId;
    }

    this.setState({
      advanceReset: true,
      tab,
      selectid: id,
      description: desc,
      typename: typename,
      subtab: "",
      deepsubtab: "",
      gatewaytab: "",
      gatewaytanktab: "",
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
      adAlert: "",
      adSensor: "",
      adTankSiveV: "",
      adTankSiveOP: "",
      subDescription: "",
      deepSubTabDesc: "",
      gatewayTabDesc: "",
      gatewayTankTabDesc: "",
      selectedTab: !tabDeselectCondition,
    });
    console.log("typename", typename);
    console.log("description", desc);
    console.log("userid1", id);
  };

  changeSubTabs = (subtab, id, subDesc, typename, subtabDeselectCondition) => {
    this.state.subTabId = id;
    if (subtabDeselectCondition === true && this.state.selectid == id) {
      subtab = "";
      id = this.state.subChildId;
    }
    console.log("aaaaaaaaaaaaaaaaaa", this.state.selectid, id);
    this.setState({
      advanceReset: true,
      subtab,
      selectid: id,
      subDescription: subDesc,
      typename: typename,
      deepsubtab: "",
      gatewaytab: "",
      gatewaytanktab: "",
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
      adAlert: "",
      adSensor: "",
      adTankSiveV: "",
      adTankSiveOP: "",
      deepSubTabDesc: "",
      gatewayTabDesc: "",
      gatewayTankTabDesc: "",
      selectedSubTab: !subtabDeselectCondition,
    });
    console.log("typename", typename);
    console.log("subDescription", subDesc);
  };

  changeDeepSubTabs = (
    deepsubtab,
    id,
    deepsubDesc,
    typename,
    deepsubTabDeselectCondition
  ) => {
    this.state.gatewayId = id;
    if (deepsubTabDeselectCondition === true && this.state.selectid == id) {
      deepsubtab = "";
      id = this.state.subTabId;
    }
    this.setState({
      advanceReset: true,
      deepsubtab,
      selectid: id,
      deepSubTabDesc: deepsubDesc,
      typename: typename,
      gatewaytab: "",
      gatewaytanktab: "",
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
      adAlert: "",
      adSensor: "",
      adTankSiveV: "",
      adTankSiveOP: "",
      gatewayTabDesc: "",
      gatewayTankTabDesc: "",
      selectedDeepSubTab: !deepsubTabDeselectCondition,
    });
    console.log("deepSubTabDesc", deepsubDesc);
  };
  changeGatewayTab = (
    gatewaytab,
    id,
    gatewayDesc,
    typename,
    gatewayTabDeselectCondition
  ) => {
    this.state.gatewayTankId = id;
    if (gatewayTabDeselectCondition === true && this.state.selectid == id) {
      gatewaytab = "";
      id = this.state.gatewayId;
    }
    this.setState({
      advanceReset: true,
      gatewaytab,
      selectid: id,
      gatewayTabDesc: gatewayDesc,
      typename: typename,
      gatewaytanktab: "",
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
      adAlert: "",
      adSensor: "",
      adTankSiveV: "",
      adTankSiveOP: "",
      gatewayTankTabDesc: "",
      selectedGatewayTab: !gatewayTabDeselectCondition,
    });
  };
  changeGatewayTankTab = (
    gatewaytanktab,
    id,
    gatewaytankDesc,
    typename,
    gatewayTankTabDeselectCondition
  ) => {
    if (gatewayTankTabDeselectCondition === true && this.state.selectid == id) {
      gatewaytanktab = "";
      id = this.state.gatewayTankId;
    }
    this.setState({
      advanceReset: true,
      gatewaytanktab,
      selectid: id,
      gatewayTankTabDesc: gatewaytankDesc,
      typename: typename,
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
      adAlert: "",
      adSensor: "",
      adTankSiveV: "",
      adTankSiveOP: "",
      selectedGatewayTankTab: !gatewayTankTabDeselectCondition,
    });
  };
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

  handleGraphicClick = () => {
    console.log("tank id------------------------", tankId);
    this.setState((tankId = this.state.tankId));
  };
  // handleGraphFilter = (tankId) => {
  //   this.setState({ filterTableFromGraph: tankId });
  //   console.log("filterTable from graph", this.state.filterTableFromGraph);
  // };
  render() {
    let { data } = this.props;
    var filterdata = [];
    if (data.loading) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
    if (this.props.data.locationEntry.sublocations.edges.length > 0) {
      console.log(
        "search data",
        this.props.data.locationEntry.sublocations.edges
      );
      filterdata = this.props.data.locationEntry.sublocations.edges.filter(
        (item) => {
          return (
            item.node.description
              .toString()
              .toLowerCase()
              .indexOf(this.state.searchValue.toString().toLowerCase()) !== -1
          );
        }
      );
    }
    console.log("selectid", this.state.selectid);
    console.log("desc---", this.state.description);
    console.log("leftTabs", data);
    console.log("SelectedId", this.state.selectid);

    const wholeCard = this.state.wholeCard;
    const {
      tab,
      username,
      description,
      subDescription,
      subtab,
      formVisible,
      mode,
      entry,
      deepsubtab,
      gatewaytab,
      deepSubTabDesc,
      gatewaytanktab,
      gatewayTabDesc,
      gatewayTankTabDesc,
      collapsed,
      typename,
      adAlert,
      selectedTab,
      selectedSubTab,
      selectedDeepSubTab,
      selectedGatewayTab,
      selectedGatewayTankTab,
      tankId,
    } = this.state;
    let button;
    if (wholeCard) {
      button = (
        <ArrowButton
          iconName="fa-angle-down"
          backgroundColor="var(--color-primary)"
          onClick={this.changeHalfTab}
        />
      );
    } else {
      button = (
        <ArrowButton iconName="fa-angle-up" onClick={this.changeFullTab} />
      );
    }

    return (
      <Fragment>
        <Header tankdescription={description} username={username} />
        <div className="cards">
          <MainCard
            wholeCard={wholeCard}
            selectedTankId={this.state.selectid ? this.state.selectid : ""}
            selectedTypename={typename}
            // callback={this.handleGraphicClick}
          />
          {button}
        </div>
        <div className="vertrax_btmSectn">
          <Layout>
            <Sider
              style={{
                overflow: "auto",
                height: "110vh",
                // height: "112vh",
                left: 0,
              }}
              theme="light"
              trigger={null}
              collapsible
              collapsed={collapsed}
              onCollapse={(e) => this.toggleCollapse(e)}
            >
              {/* <div className="app__logo" /> */}
              {/* <SideNav /> */}

              <div className="vertrax_leftSection">
                <Search
                  saveIcon
                  onChange={(e) => this.searchTextfromleftTab(e.target.value)}
                />
                <div className="tab_wrapper">
                  {filterdata.length > 0 ? (
                    <Fragment>
                      {filterdata.map((item) => (
                        <div>
                          <Tab
                            id="tab1"
                            text={item.node.description}
                            onClick={() =>
                              this.changeTab(
                                item.node.id,
                                item.node.id,
                                item.node.description,
                                item.node.__typename,
                                selectedTab
                              )
                            }
                            selected={tab === item.node.id}
                            alertCount="10"
                            fireCount="2"
                            key={item.node.id}
                          />
                          {tab === item.node.id &&
                            item.node.__typename === "Location" && (
                              <Query
                                query={leftPanel}
                                variables={{ id: item.node.id }}
                              >
                                {({ loading, error, data }) => {
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
                                    console.log("LocationData", data);
                                    return data.locationEntry.sublocations.edges.map(
                                      (item) => (
                                        <div className="tab_content">
                                          {item.node.__typename ===
                                          "GatewayLocation" ? (
                                            <SubTabs
                                              text={item.node.description}
                                              styleName="tab_branch"
                                              onClick={() =>
                                                this.changeSubTabs(
                                                  item.node.id,
                                                  item.node.id,
                                                  item.node.description,
                                                  item.node.__typename,
                                                  selectedSubTab
                                                )
                                              }
                                              selected={subtab === item.node.id}
                                            />
                                          ) : (
                                            <SubTabs
                                              text={item.node.description}
                                              styleName="tab_branch"
                                              onClick={() =>
                                                this.changeSubTabs(
                                                  item.node.id,
                                                  item.node.id,
                                                  item.node.description,
                                                  item.node.__typename,
                                                  selectedSubTab
                                                )
                                              }
                                              selected={subtab === item.node.id}
                                            />
                                          )}
                                          {subtab === item.node.id &&
                                            item.node.__typename ===
                                              "Location" && (
                                              <Query
                                                query={leftPanel}
                                                variables={{ id: item.node.id }}
                                              >
                                                {({ loading, error, data }) => {
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
                                                    console.log(
                                                      "Locationdatainner",
                                                      data
                                                    );
                                                    return data.locationEntry.sublocations.edges.map(
                                                      (item) => (
                                                        <div className="tab_content subtab_content">
                                                          {item.node
                                                            .__typename ===
                                                          "GatewayLocation" ? (
                                                            // <div className="leftGateway_inrdesc">
                                                            //   {
                                                            //     item.node
                                                            //       .description
                                                            //   }
                                                            // </div>
                                                            <DeepSubTab
                                                              text={
                                                                item.node
                                                                  .description
                                                              }
                                                              onClick={() =>
                                                                this.changeDeepSubTabs(
                                                                  item.node.id,
                                                                  item.node.id,
                                                                  item.node
                                                                    .description,
                                                                  item.node
                                                                    .__typename,
                                                                  selectedDeepSubTab
                                                                )
                                                              }
                                                              selected={
                                                                deepsubtab ===
                                                                item.node.id
                                                              }
                                                            />
                                                          ) : (
                                                            <DeepSubTab
                                                              text={
                                                                item.node
                                                                  .description
                                                              }
                                                              onClick={() =>
                                                                this.changeDeepSubTabs(
                                                                  item.node.id,
                                                                  item.node.id,
                                                                  item.node
                                                                    .description,
                                                                  item.node
                                                                    .__typename,
                                                                  selectedDeepSubTab
                                                                )
                                                              }
                                                              selected={
                                                                deepsubtab ===
                                                                item.node.id
                                                              }
                                                            />
                                                          )}
                                                          {deepsubtab ===
                                                            item.node.id &&
                                                            item.node
                                                              .__typename ===
                                                              "Location" && (
                                                              <Query
                                                                query={
                                                                  leftPanel
                                                                }
                                                                variables={{
                                                                  id:
                                                                    item.node
                                                                      .id,
                                                                }}
                                                              >
                                                                {({
                                                                  loading,
                                                                  error,
                                                                  data,
                                                                }) => {
                                                                  if (loading) {
                                                                    return (
                                                                      <div>
                                                                        <Loader />
                                                                      </div>
                                                                    );
                                                                  }
                                                                  if (error) {
                                                                    return (
                                                                      <div>
                                                                        error
                                                                      </div>
                                                                    );
                                                                  } else if (
                                                                    data
                                                                  ) {
                                                                    console.log(
                                                                      "deepsubtab",
                                                                      data
                                                                    );
                                                                    return data.locationEntry.sublocations.edges.map(
                                                                      (
                                                                        item
                                                                      ) => (
                                                                        <div className="tab_content subtab_content">
                                                                          {item
                                                                            .node
                                                                            .__typename ===
                                                                          "GatewayLocation" ? (
                                                                            // <div className="leftGateway_inrdesc">
                                                                            //   {
                                                                            //     item
                                                                            //       .node
                                                                            //       .description
                                                                            //   }
                                                                            // </div>
                                                                            <GatewayTab
                                                                              text={
                                                                                item
                                                                                  .node
                                                                                  .description
                                                                              }
                                                                              onClick={() =>
                                                                                this.changeGatewayTab(
                                                                                  item
                                                                                    .node
                                                                                    .id,
                                                                                  item
                                                                                    .node
                                                                                    .id,
                                                                                  item
                                                                                    .node
                                                                                    .description,
                                                                                  item
                                                                                    .node
                                                                                    .__typename,
                                                                                  selectedGatewayTab
                                                                                )
                                                                              }
                                                                              selected={
                                                                                gatewaytab ===
                                                                                item
                                                                                  .node
                                                                                  .id
                                                                              }
                                                                            />
                                                                          ) : (
                                                                            <GatewayTab
                                                                              text={
                                                                                item
                                                                                  .node
                                                                                  .description
                                                                              }
                                                                              onClick={() =>
                                                                                this.changeGatewayTab(
                                                                                  item
                                                                                    .node
                                                                                    .id,
                                                                                  item
                                                                                    .node
                                                                                    .id,
                                                                                  item
                                                                                    .node
                                                                                    .description,
                                                                                  item
                                                                                    .node
                                                                                    .__typename,
                                                                                  selectedGatewayTab
                                                                                )
                                                                              }
                                                                              selected={
                                                                                gatewaytab ===
                                                                                item
                                                                                  .node
                                                                                  .id
                                                                              }
                                                                            />
                                                                          )}
                                                                          {gatewaytab ===
                                                                            item
                                                                              .node
                                                                              .id &&
                                                                            item
                                                                              .node
                                                                              .__typename ===
                                                                              "Location" && (
                                                                              <Query
                                                                                query={
                                                                                  leftPanel
                                                                                }
                                                                                variables={{
                                                                                  id:
                                                                                    item
                                                                                      .node
                                                                                      .id,
                                                                                }}
                                                                              >
                                                                                {({
                                                                                  loading,
                                                                                  error,
                                                                                  data,
                                                                                }) => {
                                                                                  if (
                                                                                    loading
                                                                                  ) {
                                                                                    return (
                                                                                      <div>
                                                                                        <Loader />
                                                                                      </div>
                                                                                    );
                                                                                  }
                                                                                  if (
                                                                                    error
                                                                                  ) {
                                                                                    return (
                                                                                      <div>
                                                                                        error
                                                                                      </div>
                                                                                    );
                                                                                  } else if (
                                                                                    data
                                                                                  ) {
                                                                                    console.log(
                                                                                      "gatewayTab",
                                                                                      data
                                                                                    );
                                                                                    return data.locationEntry.sublocations.edges.map(
                                                                                      (
                                                                                        item
                                                                                      ) => (
                                                                                        <div className="tab_content subtab_content">
                                                                                          <GatewayTankTab
                                                                                            text={
                                                                                              item
                                                                                                .node
                                                                                                .description
                                                                                            }
                                                                                            onClick={() =>
                                                                                              this.changeGatewayTankTab(
                                                                                                item
                                                                                                  .node
                                                                                                  .id,
                                                                                                item
                                                                                                  .node
                                                                                                  .id,
                                                                                                item
                                                                                                  .node
                                                                                                  .description,
                                                                                                item
                                                                                                  .node
                                                                                                  .__typename,
                                                                                                selectedGatewayTankTab
                                                                                              )
                                                                                            }
                                                                                            selected={
                                                                                              gatewaytanktab ===
                                                                                              item
                                                                                                .node
                                                                                                .id
                                                                                            }
                                                                                          />
                                                                                        </div>
                                                                                      )
                                                                                    );
                                                                                  }
                                                                                }}
                                                                              </Query>
                                                                            )}
                                                                        </div>
                                                                      )
                                                                    );
                                                                  }
                                                                }}
                                                              </Query>
                                                            )}
                                                        </div>
                                                      )
                                                    );
                                                  }
                                                }}
                                              </Query>
                                            )}
                                        </div>
                                      )
                                    );
                                  }
                                }}
                              </Query>
                            )}
                        </div>
                      ))}
                    </Fragment>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Sider>
            <Content>
              <div className="vertrax_rightSectn">
                <div className="vertrax_table--header">
                  {description === description ? (
                    <div className="vertrax_rightSectn--header">
                      <div className="vertrax_header--all">
                        {!collapsed ? (
                          <MenuUnfoldOutlined
                            className="app__navTrigger"
                            onClick={() => this.toggleCollapse(collapsed)}
                          />
                        ) : (
                          <MenuFoldOutlined
                            className="app__navTrigger"
                            onClick={() => this.toggleCollapse(collapsed)}
                          />
                        )}

                        {description === description ? (
                          <h3>
                            {description === "" ? "All Clients" : description}
                          </h3>
                        ) : (
                          description
                        )}
                      </div>

                      {subDescription === "" ? (
                        ""
                      ) : (
                        <div className="vertrax_header--all">
                          <RightOutlined
                            style={{ color: "#215CAA", fontSize: "18px" }}
                          />
                          <h4>{subDescription}</h4>
                        </div>
                      )}
                      {deepSubTabDesc === "" ? (
                        ""
                      ) : (
                        <div className="vertrax_header--all">
                          <RightOutlined
                            style={{ color: "#215CAA", fontSize: "18px" }}
                          />
                          <h4>{deepSubTabDesc}</h4>
                        </div>
                      )}
                      {gatewayTabDesc === "" ? (
                        ""
                      ) : (
                        <div className="vertrax_header--all">
                          <RightOutlined
                            style={{ color: "#215CAA", fontSize: "18px" }}
                          />
                          <h4>{gatewayTabDesc}</h4>
                        </div>
                      )}
                      {gatewayTankTabDesc === "" ? (
                        ""
                      ) : (
                        <div className="vertrax_header--all">
                          <RightOutlined
                            style={{ color: "#215CAA", fontSize: "18px" }}
                          />
                          <h4>{gatewayTankTabDesc}</h4>
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <Button
                      className="client_btn"
                      type="primary"
                      ghost
                      icon={
                        <img
                          className="btn_icons"
                          src={cogBlue}
                          alt="setting"
                        />
                      }
                      size="large"
                      // ghost
                      onClick={this.showForm}
                    >
                      Advanced Search
                    </Button>
                  </div>
                </div>
                <TankTable
                  selectedTankId={this.state.selectid}
                  adSearchValue={this.state.adserchtxt}
                  adLevelValue={this.state.adlevelvalue}
                  adLevelOP={this.state.adlevelOp}
                  adAlert={this.state.adAlert}
                  adSensor={this.state.adSensor}
                  adTankSiveV={this.state.adTankSiveV}
                  adTankSiveOP={this.state.adTankSiveOP}
                  adCommodityValue={this.state.adCommodityValue}
                  // callback={tankId}
                />
              </div>
            </Content>
          </Layout>
        </div>
        <AdvancedSearchForm
          visible={formVisible}
          showForm={this.showForm}
          hideForm={this.hideForm}
          mode={mode}
          entry={entry}
          fetchSerachValue={this.onSearchingAdvance}
          initialvalue={this.state.adserchtxt}
          advanceReset={this.state.advanceReset}
          SavingAdvanceSearch={this.onsavingAdvanceSearch}
        />
      </Fragment>
    );
  }
}

export default graphql(leftPanel, {
  options: (props) => {
    return {
      variables: {
        id: userId,
        username: username,
      },
    };
  },
})(MainLayout);
