import React from "react";
import FullCard from "../FullCard";
import HalfCard from "../HalfCard";

function MainCard(props) {
  const wholeCard = props.wholeCard;
  console.log("hello");
  const callback = (above30) => {
    console.log("above30", props.above30);
    props.callTankParent(above30);
    console.log("above30", above30);
  };
  if (wholeCard) {
    return (
      <HalfCard
        selectedTank={props.selectedTankId}
        selectedTypeGateway={props.selectedTypename}
      />
    );
  }
  return (
    <FullCard
      selectedTank={props.selectedTankId}
      selectedTypeGateway={props.selectedTypename}
      parentCallBack={callback}
    />
  );
}
export default MainCard;
