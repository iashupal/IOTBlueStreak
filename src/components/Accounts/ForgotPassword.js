import React, { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import Pool from "./UserPool";

function ForgotPassword() {
  const [stage, setStage] = useState(1); // 1 = email stage, 2 =  code stage
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const getUser = () => {
    return new CognitoUser({
      Username: email.toLowerCase(),
      Pool,
    });
  };
  const sendCode = (event) => {
    event.preventDefault();
    getUser().forgotPassword({
      onSubmit: (data) => {
        console.log("onSuccess", data);
      },
      onFailure: (err) => {
        console.error("onFailure", err);
      },
      inputVerificationCode: (data) => {
        console.log("Input code", data);
        setStage(2);
      },
    });
  };
  const resetPassword = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords are not the same!");
      return;
    }
    getUser().confirmPassword(code, password, {
      onSuccess: (data) => {
        console.log("onSuccess", data);
      },
      onFailure: (err) => {
        console.error("onFailure", err);
      },
    });
  };
  return (
    <div>
      {stage === 1 && (
        <form onSubmit={sendCode}>
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email"
          />
          <button type="submit">Send Verification Code</button>
        </form>
      )}
      {stage === 2 && (
        <form onSubmit={resetPassword}>
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="email"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="email"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="email"
          />
          <button type="submit">Change Password</button>
        </form>
      )}
    </div>
  );
}
export default ForgotPassword;
