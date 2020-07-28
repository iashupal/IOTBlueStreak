import React, { Fragment, useState } from "react";
import Header from "../Header";
// import { AccountContext } from "./index";
import { Checkbox, Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import arrowLeft from "../../assets/images/arrow-left-blue.png";
import vertraxHome from "../../assets/images/Vertrax-Home-FluffyClouds.png";
import "./styles.css";
import { Auth } from "aws-amplify";
import { AuthenticationDetails } from "amazon-cognito-identity-js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const { loading } = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    if (checked && email !== "") {
      localStorage.email = email;
      localStorage.password = password;
      localStorage.checkbox = checked;
    }
    Auth.signIn(authDetails, checked)
      .then((data) => {
        // localStorage.setItem("token", data.session.idToken.jwtToken);
        window.location = "/";
        console.log("Logged in", data);
      })
      .catch((err) => {
        console.error("Failed to login", err);
      });
  };
  const handleClick = (event) => {
    setChecked(!checked);
    console.log(`checked = ${event.target.checked}`);
  };
  return (
    <Fragment>
      <div className="vertrax_header">
        <div className="vertrax_headerContainer">
          <div className="vertrax_header--left">
            <img
              src={require("../../assets/images/vertraxLogo.png")}
              alt="Vertrax_logo"
            />
          </div>
        </div>
      </div>
      <div className="signIn">
        <div className="signin_left">
          <img src={vertraxHome} alt="Vertrax_homeCloud" />
        </div>
        <div className="signin_rght">
          <div className="signin_inr_rght">
            {/* <AmplifyAuthenticator>
              <AmplifySignIn
                headerText="Client Login"
                slot="sign-in"
              ></AmplifySignIn> */}
            <h4>
              Client <strong>Login</strong>
            </h4>
            <form>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="text"
                placeholder="email"
                required
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="password"
                required
              />
              <div className="signin_checkbox">
                <Checkbox onClick={handleClick} checked={checked}>
                  Remember Me
                </Checkbox>
                <p>
                  <Link to="/forgot-password">Forgot Password</Link>
                </p>
              </div>
              <Button
                className="signin_btn"
                type="primary"
                size="large"
                icon={<PoweroffOutlined />}
                icon={<img className="arrow" src={arrowLeft} alt="Sign In" />}
                onClick={onSubmit}
                loading={loading}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;

// import React, { Fragment, useState, Component } from "react";
// import { Form, Input, Button, Checkbox, message } from "antd";
// import { Link } from "react-router-dom";
// import arrowLeft from "../../assets/images/arrow-left-blue.png";
// import vertraxHome from "../../assets/images/Vertrax-Home-FluffyClouds.png";
// import "./styles.css";
// import { Auth } from "aws-amplify";
// import { AuthenticationDetails } from "amazon-cognito-identity-js";

// class Login extends Component {
//   // const [email, setEmail] = useState("");
//   // const [password, setPassword] = useState("");
//   // const [checked, setChecked] = useState(false);
//   // const { loading } = useState(false);

//   onSubmit = (event) => {
//     event.preventDefault();
//     const authDetails = new AuthenticationDetails({
//       Username: email,
//       Password: password,
//     });
//     if (checked && email !== "") {
//       localStorage.email = email;
//       localStorage.password = password;
//       localStorage.checkbox = checked;
//     }
//     Auth.signIn(authDetails, checked)
//       .then((data) => {
//         // localStorage.setItem("token", data.session.idToken.jwtToken);
//         window.location = "/";
//         console.log("Logged in", data);
//       })
//       .catch((err) => {
//         console.error("Failed to login", err);
//       });
//   };
//   const handleClick = (event) => {
//     setChecked(!checked);
//     console.log(`checked = ${event.target.checked}`);
//   };
//   return (
//     <Fragment>
//       <div className="vertrax_header">
//         <div className="vertrax_headerContainer">
//           <div className="vertrax_header--left">
//             <img
//               src={require("../../assets/images/vertraxLogo.png")}
//               alt="Vertrax_logo"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="signIn">
//         <div className="signin_left">
//           <img src={vertraxHome} alt="Vertrax_homeCloud" />
//         </div>
//         <div className="signin_rght">
//           <div className="signin_inr_rght">
//             <h4>
//               Client <strong>Login</strong>
//             </h4>
//             <Form>
//               <input
//                 value={email}
//                 onChange={(event) => setEmail(event.target.value)}
//                 type="text"
//                 placeholder="email"
//                 required
//               />
//               <input
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 type="password"
//                 placeholder="password"
//                 required
//               />
//               <div className="signin_checkbox">
//                 <Checkbox onClick={handleClick} checked={checked}>
//                   Remember Me
//                 </Checkbox>
//                 <p>
//                   <Link to="/forgot-password">Forgot Password</Link>
//                 </p>
//               </div>
//               <Button
//                 className="signin_btn"
//                 type="primary"
//                 size="large"
//                 icon={<PoweroffOutlined />}
//                 icon={<img className="arrow" src={arrowLeft} alt="Sign In" />}
//                 onClick={onSubmit}
//                 loading={loading}
//               >
//                 Login
//               </Button>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// }

// export default Login;
