import React, { Component } from "react";
import { Drawer, Button, Divider, Row, Col, Checkbox } from "antd";
import SaveCard from "../SaveCard";
import arrowLeft from "../../assets/images/arrow-left-blue.png";
import Search from "../Search";
import { DatePicker } from "antd";
import moment from "moment";
import "./styles.css";
import AdvancedSearchTabs from "../AdvancedSearchTabs";
import Filters from "../Filters";
import save from "../../assets/images/save.png";
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
const POST_MUTATION = gql`
  mutation {
    setUserSavedSearches(savedSearches: { client: "Test New", totalcount: "2" })
  }
`;
class AdvancedSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tagVisible: false,
        tagVisible1: false,
        advanceReset:false,
      events: {},
      file: null,
      advancedTab: 0,
      filterTab: "",
      tagValue: "",
      tagValue1: "",
      tagValue2: "",
      tagValue3: "",
      tagValue4: "",
      serchtxt:"",
        sizeValue: 0,
        levelGallonValue: 0
    };
    } 
    resetSearch() {
        this.state.advanceReset = true
        console.log("anjali")
        this.setState({ serchtxt: "" });
        this.state.tagValue = ""
            this.state.tagValue1=""
            this.state.tagValue2= ""
            this.state.tagValue3= ""
            this.state.tagValue4 = ""
            this.state.levelGallonValue = ""
           // this.state.serchtxt= this.props.initialvalue
            this.state.filterTab = ""
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

  SavingAdvanceSearch() {
    // console.closeTag("Ad", "SavingAdvanceSearch");
    this.props.SavingAdvanceSearch();
  }
  searchTextfromAdvanceTab(searchtext) {
    this.setState({ serchtxt: searchtext });
  }
  showTagChip = (tagValue) => {
    console.log(1);
    this.setState({ tagValue, tagVisible: !this.state.tagVisible });
    if (this.state.tagValue === "Propane") {
      $("#dvPropane").removeClass("activeSelectedTag");
    }
    $("#dvPropane").addClass("activeSelectedTag");
  };
  showTagstatus = (tagValue1) => {
    console.log(1);
    this.setState({ tagValue1 }, function () {
      console.log("tagValue1", tagValue1);
    });
    $("#tgStatus").removeClass("ant-tag-hidden");
  };
  showTagAlerts = (tagValue2) => {
    console.log(2);
    this.setState({ tagValue2 }, function () {
      console.log("tagValue2", tagValue2);
    });
    $("#tgAlerts").removeClass("ant-tag-hidden");
  };
  showTagSensor = (tagValue3) => {
    console.log(3);
    this.setState({ tagValue3 }, function () {
      console.log("tagValue3", tagValue3);
    });
    $("#tgSensor").removeClass("ant-tag-hidden");
  };
  showTagSize = (tagValue4) => {
    console.log(1);
    this.setState({ tagValue4 }, function () {
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
  }
  handleCloseSensor() {
      if (this.state.tagValue3 === "Online") {
      $("#on").removeClass("activeSelectedTag");
      } else if (this.state.tagValue3 === "Offline") {
      $("#off").removeClass("activeSelectedTag");
    }
      $("#tgSensor").addClass("ant-tag-hidden");
      this.state.tagValue3 = "";
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
  }
  onChange = (e) => {
    // this.setState({
    //   checked: e.target.checked,
    // });
    console.log(`checked = ${e.target.checked}`);
  };
  render() {
      const { visible, hideForm, mode, advanceReset } = this.props;
      if (visible === true && advanceReset === true && this.state.advanceReset===false)
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
      tagVisible,
      tagVisible1,
      checked,
      sizeValue,
    } = this.state;
    return (
      <div className="advanced_form">
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
              value={this.state.serchtxt}
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
                    text="Gateway/Sensors"
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
                            levelGallonValue: e.target.value,
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
                      <div className="saved_searches--content">
                        <strong>Campora</strong>
                        <span>- 3/16 4:52pm</span>
                      </div>
                      <div className="saved_searches--content">
                        <strong>Budget Propane</strong>
                        <span>- 3/14 2:12pm</span>
                      </div>
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
                      </div>
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
            <div className="filter__saveBtn">
              <Button
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
                onClick={this.SavingAdvanceSearch.bind(this)}
              >
                Save
              </Button>
            </div>
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
                Save
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
