import React, { Component, Fragment } from "react";
import Search from "../Search";
import Tab from "../Tab";
import SubTabs from "../SubTabs";
import DeepSubTab from "../DeepSubTab";
import GatewayTab from "../GatewayTab";
import "./styles.css";
import { gql } from "apollo-boost";
import { graphql, Query } from "react-apollo";
import Loader from "../Loader";
const userId = localStorage.getItem("userId");

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

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "",
      subTab: "",
      formVisible: false,
      selectid: userId,
      description: "",
      subDescription: "",
      deepSubTabDesc: "",
      gatewayDesc: "",
      searchValue: "",
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
    };
  }
  searchTextfromleftTab(searchtext) {
    this.setState({ searchValue: searchtext });
  }

  changeTab = (tab, id, desc) => {
    localStorage.setItem("userId", id);
    this.setState({
      tab,
      selectid: id,
      description: desc,
      adserchtxt: "",
    });
    console.log("description", desc);
    console.log("userid1", id);
  };
  changeSubTabs = (subtab, id, subDesc) => {
    this.setState({
      subtab,
      selectid: id,
      subDescription: subDesc,
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
    });
    console.log("subDescription", subDesc);
  };
  changeDeepSubTabs = (deepsubtab, id, deepsubDesc) => {
    this.setState({
      deepsubtab,
      selectid: id,
      deepSubTabDesc: deepsubDesc,
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
    });
    console.log("deepSubTabDesc", deepsubDesc);
  };
  changeGatewayTab = (gatewaytab, id, gatewayDesc) => {
    this.setState({
      gatewaytab,
      selectid: id,
      description: gatewayDesc,
      adserchtxt: "",
      adlevelvalue: "",
      adlevelOp: "",
    });
  };
  handleClick = (e) => {
    console.log("click ", e);
  };
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
    const {
      tab,
      username,
      description,
      subDescription,
      subtab,
      deepsubtab,
      gatewaytab,
      formVisible,
      mode,
      entry,
    } = this.state;

    return (
      <Fragment>
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
                      text={item.node.description}
                      onClick={() =>
                        this.changeTab(
                          item.node.id,
                          item.node.id,
                          item.node.description
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
                                      <div className="leftGateway_desc">
                                        {item.node.description}
                                      </div>
                                    ) : (
                                      <SubTabs
                                        text={item.node.description}
                                        styleName="tab_branch"
                                        onClick={() =>
                                          this.changeSubTabs(
                                            item.node.id,
                                            item.node.id,
                                            item.node.description
                                          )
                                        }
                                        selected={subtab === item.node.id}
                                      />
                                    )}
                                    {subtab === item.node.id &&
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
                                              console.log(
                                                "Locationdatainner",
                                                data
                                              );
                                              return data.locationEntry.sublocations.edges.map(
                                                (item) => (
                                                  <div className="tab_content subtab_content">
                                                    {item.node.__typename ===
                                                    "GatewayLocation" ? (
                                                      <div className="leftGateway_inrdesc">
                                                        {item.node.description}
                                                      </div>
                                                    ) : (
                                                      <DeepSubTab
                                                        text={
                                                          item.node.description
                                                        }
                                                        onClick={() =>
                                                          this.changeDeepSubTabs(
                                                            item.node.id,
                                                            item.node.id,
                                                            item.node
                                                              .description,
                                                            item.node.__typename
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
                                                      item.node.__typename ===
                                                        "Location" && (
                                                        <Query
                                                          query={leftPanel}
                                                          variables={{
                                                            id: item.node.id,
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
                                                                <div>error</div>
                                                              );
                                                            } else if (data) {
                                                              console.log(
                                                                "deepsubtab",
                                                                data
                                                              );
                                                              return data.locationEntry.sublocations.edges.map(
                                                                (item) => (
                                                                  <div className="tab_content subtab_content">
                                                                    {item.node
                                                                      .__typename ===
                                                                    "GatewayLocation" ? (
                                                                      <div className="leftGateway_inrdesc">
                                                                        {
                                                                          item
                                                                            .node
                                                                            .description
                                                                        }
                                                                      </div>
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
                                                                              .description
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
                                                                      item.node
                                                                        .id &&
                                                                      item.node
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
                                                                                    {item
                                                                                      .node
                                                                                      .__typename ===
                                                                                    "GatewayLocation" ? (
                                                                                      <div className="leftGateway_inrdesc">
                                                                                        {
                                                                                          item
                                                                                            .node
                                                                                            .description
                                                                                        }
                                                                                      </div>
                                                                                    ) : (
                                                                                      ""
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
      </Fragment>
    );
  }
}
export default graphql(leftPanel, {
  options: (props) => {
    return {
      variables: {
        id: userId,
        // id: props.match.params.id,
      },
    };
  },
})(SideNav);
