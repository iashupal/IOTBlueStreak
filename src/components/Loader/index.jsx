import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined
    type="loading"
    style={{ fontSize: 48, color: "var(--color-primary)" }}
    spin
  />
);

function Loader() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "1fr",
        gridTemplateColumns: "1fr",
        height: "100vh",
      }}
    >
      <div style={{ alignSelf: "center", justifySelf: "center" }}>
        {antIcon}
      </div>
    </div>
  );
}

export default Loader;
