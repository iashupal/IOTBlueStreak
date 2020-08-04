import React, { Component } from "react";
import { Drawer, Button, Divider, Row, Col, Checkbox, Modal } from "antd";
import SaveCard from "../SaveCard";
import arrowLeft from "../../assets/images/arrow-left-blue.png";
import Search from "../Search";
import { DatePicker } from "antd";
import moment from "moment";
import "./styles.css";
import AdvancedSearchTabs from "../AdvancedSearchTabs";
import Filters from "../Filters";
import save from "../../assets/images/save.png";
import Loader from "../../components/Loader";
import { Tag } from "antd";
import FilterChips from "../FilterChips";
import { gql } from "apollo-boost";
import { graphql, Query, Mutation } from "react-apollo";
import $ from "jquery";
// const Add_Search = gql`
//   mutation ($searchdata: String!) {
//     setUserSavedSearches(savedSearches: { searchdata })
//   }
// `;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const userSavedQuery = gql`
  {
    loggedInUser {
      savedSearches
    }
  }
`;
const POST_MUTATION = gql`
  mutation($savedSearches: JSONObject) {
    setUserSavedSearches(savedSearches: [$savedSearches])
  }
`;

class Popup extends Component {
  render() {
    return (
      // <Modal>
      <div className="popup">
        <div className="popup_inner">
          <h2>{this.props.text}</h2>
          <input
            className="vertrax__tankInput"
            type="text"
            onChange={(e) => this.props.SearchName(e.target.value)}
            placeholder="Enter Name for Save Search"
            required
          />
          <Button
            type="primary"
            size="medium"
            className="popup_closebtn"
            onClick={this.props.closePopup}
          >
            Cancel
          </Button>
          <Button
            type="default"
            size="medium"
            className="popup_btn"
            onClick={this.props.savePopup}
            onClickCapture={this.props.callQuery}
          >
            Save
          </Button>
        </div>
      </div>
      // </Modal>
    );
  }
}

class AdvancedSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      exposedFunctions: {},
      temp: [],
      renderSaves: [],
      visible: false,
      tagVisible: false,
      tagVisible1: false,
      advanceReset: false,
      tempadvanceReset: false,
      events: {},
      file: null,
      advancedTab: 0,
      filterTab: "",
      tagValue: "",
      tagValue1: "",
      tagValue2: "",
      tagValue3: "",
      tagValue4: "",
      serchtxt: "",
      id: 0,
      saveSearchName: "",
      sizeValue: 0,
      levelGallonValue: 0,
      savedSearches: {},
      tempdata: {
        client: "Test New",
        totalcount: "2",
      },
      disableSearch: true,
      IsSaveSearch: false,
    };
  }
  resetSearch() {
    this.setState({ tempadvanceReset: true });

    console.log("anjali");
    this.setState({ serchtxt: "" });
    this.state.tagValue = "";
    this.state.tagValue1 = "";
    this.state.tagValue2 = "";
    this.state.tagValue3 = "";
    this.state.tagValue4 = "";
    this.state.levelGallonValue = 0;
    // this.state.serchtxt= this.props.initialvalue
    this.state.filterTab = "";
  }

  savetogglePopup() {
    if (this.state.saveSearchName == "" && this.state.showPopup == true) {
    } else {
      this.setState({
        showPopup: !this.state.showPopup,
      });
    }
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }
  changeTab = (advancedTab) => {
    this.setState({
      advancedTab,
    });
  };
  changeFilterTab = (filterTab) => {
    this.setState({
      filterTab,
    });
  };
  callfetchValue() {
    this.props.fetchSerachValue(
      this.state.serchtxt,
      this.state.tagValue1,
      this.state.tagValue2,
      this.state.tagValue3,
      this.state.levelGallonValue,
      this.state.tagValue4
    );
  }
  saveAdvance() {
    this.updateFiltersFromProps(
      this.state.serchtxt,
      this.state.tagValue1,
      this.state.tagValue2,
      this.state.tagValue3,
      this.state.levelGallonValue,
      this.state.tagValue4
    );
  }

  updateFiltersFromProps(
    serchtxt,
    tankStatus,
    alert,
    sensor,
    tankSizeV,
    tankSizeO
  ) {
    this.state.disableSearch = false;
    if (
      serchtxt == "" &&
      tankStatus == "" &&
      alert == "" &&
      sensor == "" &&
      tankSizeV == 0 &&
      tankSizeO == ""
    )
      this.state.disableSearch = true;
    let { currentId } = this.props;
    var filtercondition1 = [];

    var op = "",
      value = "";
    if (tankStatus === "Below 10%") {
      op = "<";
      value = "0.10";
    } else if (tankStatus === "Below 30%") {
      op = "<";
      value = "0.30";
    } else if (tankStatus === "30% to 80%") {
      op = "<=";
      value = "0.80";
    } else if (tankStatus === "Above 80%") {
      op = ">";
      value = "0.80";
    }
    if (serchtxt != "")
      filtercondition1.push({
        description: { op: "match", v: this.state.serchtxt },
      });

    if (tankStatus != "") {
      if (value === "0.80" && op === "<=") {
        filtercondition1.push(
          {
            levelPercent: {
              op: op,
              v: value,
            },
          },
          {
            levelPercent: {
              op: ">=",
              v: ".30",
            },
          }
        );
      } else if (value === "0.10" && op === "<") {
        filtercondition1.push({
          levelPercent: {
            op: op,
            v: value,
          },
        });
        filtercondition1.push({
          levelPercent: { op: "isNull" },
        });
      } else if (value === "0.30" && op === "<") {
        filtercondition1.push({
          levelPercent: {
            op: op,
            v: value,
          },
        });
        filtercondition1.push({
          levelPercent: { op: "isNull" },
        });
      } else
        filtercondition1.push({
          levelPercent: {
            op: op,
            v: value,
          },
        });
    }

    if (alert == "High") {
      filtercondition1.push({ highAlarmCnt: { op: ">", v: 0 } });
    }
    if (alert == "Medium") {
      filtercondition1.push({ mediumAlarmCnt: { op: ">", v: 0 } });
    }
    if (sensor == "Offline") {
      filtercondition1.push({
        alarmingTypes: { op: "in", v: "sensorMissedReportsAlarm" },
      });
    }
    if (sensor == "Online") {
      filtercondition1.push({
        alarmingTypes: { op: "not in", v: "sensorMissedReportsAlarm" },
      });
    }
    if (tankSizeV != "" && tankSizeO != "")
      filtercondition1.push({
        capacityGallons: {
          op: tankSizeO,
          v: tankSizeV,
        },
      });

    console.log("this.state.temp", this.state.temp);
    var tempSaveSerches = [];
    if (value === "0.80" && op === "<=") {
      tempSaveSerches.push({
        filter: filtercondition1,
        id: currentId,
        date: new Date(),
        name: this.state.saveSearchName,
      });
    } else {
      tempSaveSerches.push({
        filter: {
          _or: filtercondition1,
        },
        id: currentId,
        date: new Date(),
        name: this.state.saveSearchName,
      });
    }
    if (this.state.temp.length != undefined) {
      this.state.temp.forEach(function (entry, index) {
        console.log("index", index, entry);
        var searchvar = [];
        searchvar = entry;

        Object.values(searchvar).forEach(function (element, index) {
          if (index <= 9) tempSaveSerches.push(element);
        });
      });
    }

    console.log("tempsave serchhdsd", tempSaveSerches);

    this.setState({
      savedSearches: tempSaveSerches,
      //    {
      //    searches3: {
      //        filter: {
      //            _or: filtercondition1
      //        },
      //        id: currentId,
      //        date: new Date()
      //        },
      //    searches4: {
      //        filter: {
      //             _or: filtercondition1
      //        },
      //        id: currentId,
      //        date: new Date()
      //        }
      //}
    });
  }
  getName = (saveSearchName) => {
    this.setState({ saveSearchName }, function () {
      console.log("tagValue4", saveSearchName);
      this.saveAdvance();
    });
  };

  searchBySave(filter, id) {
    this.state.IsSaveSearch = true;
    this.props.fetchSaveValue(filter, id);
  }
  SavingAdvanceSearch() {
    // console.closeTag("Ad", "SavingAdvanceSearch");
    this.props.SavingAdvanceSearch();
  }
  searchTextfromAdvanceTab(searchtext) {
    this.setState({ serchtxt: searchtext });
    this.saveAdvance();
  }
  showTagChip = (tagValue) => {
    console.log(1);
    this.state.disableSearch = false;
    this.setState({ tagValue, tagVisible: !this.state.tagVisible });
    if (this.state.tagValue === "Propane") {
      $("#dvPropane").removeClass("activeSelectedTag");
    }
    $("#dvPropane").addClass("activeSelectedTag");
  };
  showTagstatus = (tagValue1) => {
    console.log(1);
    this.setState({ tagValue1 }, function () {
      this.saveAdvance();
      console.log("tagValue1", tagValue1);
    });
    $("#tgStatus").removeClass("ant-tag-hidden");
  };
  showTagAlerts = (tagValue2) => {
    console.log(2);
    this.setState({ tagValue2 }, function () {
      this.saveAdvance();
      console.log("tagValue2", tagValue2);
    });
    $("#tgAlerts").removeClass("ant-tag-hidden");
    this.saveAdvance();
  };
  showTagSensor = (tagValue3) => {
    console.log(3);
    this.setState({ tagValue3 }, function () {
      this.saveAdvance();
      console.log("tagValue3", tagValue3);
    });
    $("#tgSensor").removeClass("ant-tag-hidden");
  };
  showTagSize = (tagValue4) => {
    console.log(1);
    this.setState({ tagValue4 }, function () {
      this.saveAdvance();
      console.log("tagValue4", tagValue4);
    });
    $("#tgSize").removeClass("ant-tag-hidden");
  };
  closeTag(e) {
    console.log(e);
  }
  handleClose = () => {
    this.setState({ tagVisible: !this.state.tagVisible });
    if (this.state.tagValue === "Propane") {
      $("#dvPropane").removeClass("activeSelectedTag");
      this.saveAdvance();
    }
  };
  handleCloseStatus() {
    // this.setState({ tagVisible1: !this.state.tagVisible1 });
    if (this.state.tagValue1 === "Below 10%") {
      $("#below10").removeClass("activeSelectedTag");
    } else if (this.state.tagValue1 === "Below 30%") {
      $("#below30").removeClass("activeSelectedTag");
    } else if (this.state.tagValue1 === "30% to 80%") {
      $("#below30to80").removeClass("activeSelectedTag");
    } else if (this.state.tagValue1 === "Above 80%") {
      $("#above80").removeClass("activeSelectedTag");
    }
    $("#tgStatus").addClass("ant-tag-hidden");
    this.state.tagValue1 = "";
    this.saveAdvance();
    //this.callfetchValue();
    // $("#dvTag_Status").remove();
  }
  handleCloseAlerts() {
    if (this.state.tagValue2 === "Medium") {
      $("#medium").removeClass("activeSelectedTag");
    } else if (this.state.tagValue2 === "High") {
      $("#high").removeClass("activeSelectedTag");
    }
    $("#tgAlerts").addClass("ant-tag-hidden");
    this.state.tagValue2 = "";
    this.saveAdvance();
  }
  handleCloseSensor() {
    if (this.state.tagValue3 === "Online") {
      $("#on").removeClass("activeSelectedTag");
    } else if (this.state.tagValue3 === "Offline") {
      $("#off").removeClass("activeSelectedTag");
    }
    $("#tgSensor").addClass("ant-tag-hidden");
    this.state.tagValue3 = "";
    this.saveAdvance();
  }
  handleCloseSize() {
    if (this.state.tagValue4 === ">=") {
      $("#greaterthanequalto").removeClass("activeSelectedTag");
    } else if (this.state.tagValue4 === "<=") {
      $("#lessthanequalto").removeClass("activeSelectedTag");
    } else if (this.state.tagValue4 === "=") {
      $("#equalto").removeClass("activeSelectedTag");
    }
    $("#tgSize").addClass("ant-tag-hidden");
    this.state.tagValue4 = "";
    this.saveAdvance();
  }
  onChange = (e) => {
    // this.setState({
    //   checked: e.target.checked,
    // });
    console.log(`checked = ${e.target.checked}`);
  };
  render() {
    const { visible, hideForm, mode, advanceReset, currentId } = this.props;
    if (
      visible === true &&
      advanceReset === true &&
      this.state.tempadvanceReset === false
    )
      this.resetSearch();

    // console.log("fetchSerachValueeeee", this.props.advanceReset)
    //if (advanceReset === true) {
    //        this.state.tagValue="",
    //        this.state.tagValue1 = "",
    //        this.state.tagValue2 = "",
    //        this.state.tagValue3 = "",
    //        this.state.tagValue4 = "",
    //        this.state.levelGallonValue = ""
    //}
    //this.props.advanceReset = false;

    const {
      advancedTab,
      filterTab,
      tagValue,
      tagValue1,
      tagValue2,
      tagValue3,
      tagValue4,
      temp,
      tagVisible,
      tagVisible1,
      checked,
      sizeValue,
      tempdata,
      savedSearches,
      saveItemArray,
      renderSaves,
      disableSearch,
      serchtxt,
    } = this.state;
    return (
      <div className="advanced_form">
        {this.state.showPopup === true ? (
          <Mutation mutation={POST_MUTATION} variables={{ savedSearches }}>
            {(postMutation) => (
              <Popup
                text="Enter Name"
                closePopup={this.togglePopup.bind(this)}
                savePopup={this.savetogglePopup.bind(this)}
                callQuery={postMutation}
                SearchName={this.getName}
              />
            )}
          </Mutation>
        ) : null}
        {this.state.IsSaveSearch === false && (
          <Query query={userSavedQuery}>
            {({ data, error, loading }) => {
              // <>
              if (loading) {
                return (
                  <div>
                    <Loader />
                  </div>
                );
              }
              if (loading) return "Loading...";
              if (error) return `Error!`;
              if (data) {
                this.state.temp = data.loggedInUser.savedSearches;
              }
              return null;
            }}
          </Query>
        )}

        {mode === "advanced" ? (
          <Drawer
            title="Advanced Search"
            width={620}
            closable={false}
            visible={visible}
          >
            <img
              className="hideSearch_form"
              src={arrowLeft}
              alt="close"
              onClick={hideForm}
            />
            <Search
              styleName="advanced_search"
              value={serchtxt}
              onChange={(e) => this.searchTextfromAdvanceTab(e.target.value)}
            />

            <div className="advanced_btns">
              <AdvancedSearchTabs
                text="Filters"
                onClick={() => this.changeTab(0)}
                selected={advancedTab === 0}
              />
              <AdvancedSearchTabs
                text="Saved"
                onClick={() => this.changeTab(1)}
                selected={advancedTab === 1}
              />
            </div>
            {advancedTab === 0 && (
              <div>
                {tagValue === "Propane" && (
                  <div className="vertrax-tag">
                    <Tag
                      closable
                      visible={tagVisible}
                      onClose={() => this.handleClose()}
                      className="edit-tag"
                    >
                      {tagValue}
                    </Tag>
                  </div>
                )}
                {tagValue1 && (
                  <div className="vertrax-tag" id="dvTag_Status">
                    <Tag
                      id="tgStatus"
                      closable
                      // visible={tagVisible1}
                      onClose={() => this.handleCloseStatus()}
                      className="edit-tag"
                    >
                      {tagValue1}
                    </Tag>
                  </div>
                )}
                {tagValue2 && (
                  <div className="vertrax-tag" id="dvTag_alerts">
                    <Tag
                      id="tgAlerts"
                      closable
                      onClose={() => this.handleCloseAlerts()}
                      className="edit-tag"
                    >
                      {tagValue2}
                    </Tag>
                  </div>
                )}
                {tagValue3 && (
                  <div className="vertrax-tag" id="dvTag_sensor">
                    <Tag
                      id="tgSensor"
                      closable
                      onClose={() => this.handleCloseSensor()}
                      className="edit-tag"
                    >
                      {tagValue3}
                    </Tag>
                  </div>
                )}
                {tagValue4 && (
                  <div className="vertrax-tag" id="dvTag_size">
                    <Tag
                      id="tgSize"
                      closable
                      onClose={() => this.handleCloseSize()}
                      className="edit-tag"
                    >
                      {tagValue4}
                    </Tag>
                  </div>
                )}
              </div>
            )}
            {advancedTab === 0 && (
              <div className="advanced_wrapper--filters">
                <div className="advanced_wrapper--inrfilters">
                  <Filters
                    text="Commodity Type"
                    onClick={() => this.changeFilterTab(0)}
                    selected={filterTab === 0}
                  />
                  <Filters
                    text="Tank Status"
                    onClick={() => this.changeFilterTab(1)}
                    selected={filterTab === 1}
                  />
                  <Filters
                    text="Alerts"
                    onClick={() => this.changeFilterTab(2)}
                    selected={filterTab === 2}
                  />
                  <Filters
                    text="Sensors"
                    onClick={() => this.changeFilterTab(3)}
                    selected={filterTab === 3}
                  />
                  <Filters
                    text="Tank Size"
                    onClick={() => this.changeFilterTab(4)}
                    selected={filterTab === 4}
                  />
                </div>
                <Divider type="vertical" />
                <div className="advanced_wrapper--inrfilters">
                  {filterTab === 0 && (
                    <div>
                      <FilterChips
                        id="dvPropane"
                        text="Propane"
                        onClick={() => this.showTagChip("Propane")}
                        selected={tagValue === "Propane"}
                      />
                    </div>
                  )}
                  {filterTab === 1 && (
                    <div>
                      <FilterChips
                        id="below10"
                        text="Below 10%"
                        onClick={() => this.showTagstatus("Below 10%")}
                        selected={tagValue1 === "Below 10%"}
                      />

                      <FilterChips
                        id="below30"
                        text="Below 30%"
                        onClick={() => this.showTagstatus("Below 30%")}
                        selected={tagValue1 === "Below 30%"}
                      />
                      <FilterChips
                        id="below30to80"
                        text="30% to 80%"
                        onClick={() => this.showTagstatus("30% to 80%")}
                        selected={tagValue1 === "30% to 80%"}
                      />
                      <FilterChips
                        id="above80"
                        text="Above 80%"
                        onClick={() => this.showTagstatus("Above 80%")}
                        selected={tagValue1 === "Above 80%"}
                      />
                    </div>
                  )}
                  {filterTab === 2 && (
                    <div>
                      <FilterChips
                        id="medium"
                        text="Medium"
                        onClick={() => this.showTagAlerts("Medium")}
                        selected={tagValue2 === "Medium"}
                      />
                      <FilterChips
                        id="high"
                        text="High"
                        onClick={() => this.showTagAlerts("High")}
                        selected={tagValue2 === "High"}
                      />
                    </div>
                  )}
                  {filterTab === 3 && (
                    <div>
                      <FilterChips
                        id="on"
                        text="Online"
                        onClick={() => this.showTagSensor("Online")}
                        selected={tagValue3 === "Online"}
                      />
                      <FilterChips
                        id="off"
                        text="Offline"
                        onClick={() => this.showTagSensor("Offline")}
                        selected={tagValue3 === "Offline"}
                      />
                    </div>
                  )}
                  {filterTab === 4 && (
                    <div>
                      <input
                        className="vertrax__tankInput"
                        type="number"
                        onChange={(e) =>
                          this.setState({
                            levelGallonValue: e.target.valueAsNumber,
                          })
                        }
                        placeholder="Enter value for tank size"
                      />
                      <FilterChips
                        id="greaterthanequalto"
                        text="Greater than equal to"
                        onClick={() => this.showTagSize(">=")}
                        selected={tagValue4 === ">="}
                      />
                      <FilterChips
                        id="lessthanequalto"
                        text="Less than equal to"
                        onClick={() => this.showTagSize("<=")}
                        selected={tagValue4 === "<="}
                      />
                      <FilterChips
                        id="equalto"
                        text="Equal to"
                        onClick={() => this.showTagSize("=")}
                        selected={tagValue4 === "="}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            {advancedTab === 1 && (
              <div>
                <SaveCard
                  additionalPoints
                  heading="Saved Searches"
                  contents={[
                    <div className="saved_searches">
                      {
                        <Query query={userSavedQuery}>
                          {({ data, error, loading, refetch }) => {
                            // <>
                            //const { listItems } = data;
                            //console.log("refetch", refetch, "networkStatus", networkStatus)

                            //{
                            //    (loading || networkStatus === 4)

                            //    ? <div className="loading-items"><p>Loading...</p></div>
                            //        : < listItems={data} refetch={refetch} />

                            //}

                            if (loading) {
                              return (
                                <div>
                                  <loading />
                                </div>
                              );
                            }
                            if (loading) return "Loading...";
                            if (error) return `Error!`;
                            if (data) {
                              this.state.renderSaves = Object.values(
                                data.loggedInUser.savedSearches
                              );
                              if (this.state.renderSaves.length > 0)
                                this.state.renderSaves = Object.values(
                                  this.state.renderSaves[0]
                                );
                              console.log("alerts ", this.state.renderSaves);
                              // return data && <strong>{data.loggedInUser.savedSearches.searches1.date}</strong>;
                              // return
                              // {filterdata.length > 0 ? (
                              // <Fragment>
                              // {filterdata.map((item) =>
                              // )}
                              // </Fragment>
                              // ) : (
                              // ""
                              // )}
                              return (
                                <div>
                                  {this.state.renderSaves.map(
                                    (searches, index) => (
                                      <React.Fragment>
                                        {/* <div className="saved_searches--content"> */}
                                        <Button
                                          size="large"
                                          type="default"
                                          className="savedSearch_btn"
                                          // className="saved_searches--content"
                                          onClick={refetch()}
                                          onClickCapture={() => {
                                            this.searchBySave(
                                              searches.filter,
                                              searches.id
                                            );
                                          }}
                                        >
                                          {searches.name}{" "}
                                          {moment(searches.date).format(
                                            "YYYY-MM-DD"
                                          )}
                                        </Button>
                                        {/* </div> */}
                                      </React.Fragment>
                                    )
                                  )}
                                  {this.state.renderSaves.length == 0 && (
                                    <div className="saveNotFound">
                                      No searches found
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          }}
                        </Query>
                      }

                      {/*
                           * 
                             
                              <div className="saved_searches--content">
                                  <strong>Blount Pet</strong>
                                  <span> - 3/13 1:53pm</span>
                              </div>
                              <div className="saved_searches--content">
                                  <strong>Collett</strong>
                                  <span> - 3/12 4:11pm</span>
                              </div>
                              <div className="saved_searches--content">
                                  <strong>Core Fuels</strong>
                                  <span>- 3/11 11:52am</span>
                              </div>*/}
                    </div>,
                  ]}
                />
                <SaveCard
                  heading="Saved Views"
                  contents={[
                    <div className="saved_searches">
                      <div className="saved_searches--content">
                        Default View
                      </div>
                      <div className="saved_searches--content">
                        Saved View 1
                      </div>
                      <div className="saved_searches--content">
                        Saved View 2
                      </div>
                    </div>,
                  ]}
                />
              </div>
            )}
            {advancedTab === 0 && (
              <div className="filter__saveBtn">
                <Button
                  disabled={disableSearch}
                  className="saved_btn"
                  size="large"
                  // class="ant-btn saved_btn ant-btn-lg"
                >
                  Reset{" "}
                </Button>
                <Button
                  disabled={disableSearch}
                  className="saved_btn"
                  size="large"
                  // class="ant-btn saved_btn ant-btn-lg"
                  onClick={this.callfetchValue.bind(this)}
                >
                  Search{" "}
                </Button>

                <Button
                  icon={
                    <img
                      className="btn_icons filter_saveImg"
                      src={save}
                      alt="save"
                    />
                  }
                  size="large"
                  className="saved_btn"
                  onClick={this.togglePopup.bind(this)}
                  disabled={disableSearch}
                >
                  Save{" "}
                </Button>
              </div>
            )}
          </Drawer>
        ) : (
          <Drawer
            title={`Customize View`}
            width={620}
            closable={false}
            visible={visible}
          >
            <img
              className="hideSearch_form"
              src={arrowLeft}
              alt="close"
              onClick={hideForm}
            />

            <SaveCard
              heading="Tank Data to Customize"
              contents={[
                <div className="saved_searches">
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Tank Number
                        </Checkbox>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Current Volume
                        </Checkbox>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Tank Status
                        </Checkbox>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Refill Potential
                        </Checkbox>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Gateway Status
                        </Checkbox>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Refill Potential Diff.
                        </Checkbox>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Sensor Status
                        </Checkbox>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Temp at Tank
                        </Checkbox>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}> Alerts</Checkbox>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="export__data--content">
                        <Checkbox onChange={this.onChange}>
                          {" "}
                          Battery Level
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
              <Button
                icon={
                  <img
                    className="btn_icons filter_saveImg"
                    src={save}
                    alt="save"
                  />
                }
                size="large"
                className="customize--saved_btn"
                // className="client_export--btn"
                // onClick={this.SavingAdvanceSearch.bind(this)}
              >
                View
              </Button>
            </div>
          </Drawer>
        )}
      </div>
    );
  }
}

AdvancedSearchForm.defaultProps = {
  selected: false,
};
export default AdvancedSearchForm;
