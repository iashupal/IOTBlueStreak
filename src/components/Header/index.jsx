import React, { useState, useEffect } from "react";
import AllResults from "../AllResult";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import "./styles.css";
import "../../config/global_styles.css";
const username = localStorage.getItem("username");
const userId = localStorage.getItem("userId");
function Header(props) {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="vertrax_header">
      <div className="vertrax_headerContainer">
              <div className="vertrax_header--left">
                  
                      <a href="/">
          <img
            src={require("../../assets/images/vertraxLogo.png")}
            alt="Vertrax_logo"
                          />
                          </a>
                     
          <AllResults
            resultHeading={
              props.tankdescription === ""
                ? "All Available Results"
                : props.tankdescription
            }
          />
          <AllResults resultHeading={props.tankIdWithName} />
        </div>
        {/* {signedIn ? ( */}
        <div className="vertrax_header--right">
          <span>
            <i className="fas fa-user user"></i>
          </span>
          <p className="vertrax_username">{props.username}</p>
          <Popover
            placement="bottomRight"
            content={
              <div className="tank_menu">
                <ul>
                  {/* <li>
                    <i className="fas fa-file-export"></i>
                    <p>Edit Profile</p>
                  </li> */}
                  {/* <li>
                    <Link to="/">
                      <i className="fas fa-check-square"></i>
                      <p>Preferences</p>
                    </Link>
                  </li> */}
                  <li onClick={logout}>
                    {/* <Link to="/login"> */}
                    {/* <AmplifySignOut> */}
                    <i className="fas fa-sliders-h"></i>
                    {/* </AmplifySignOut> */}
                    <p>Sign out</p>
                    {/* </Link> */}
                  </li>
                </ul>
              </div>
            }
            trigger="click"
          >
            <i className="fas fa-caret-down caret-icon"></i>
          </Popover>
        </div>
        {/* ) : (
          ""
        )} */}
      </div>
    </div>
  );
}
export default Header;
