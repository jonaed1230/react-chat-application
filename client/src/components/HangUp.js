import React from "react";
import hangup from "../Icons/hang-up.svg";

/**
 *
 * @param {object} props
 * @param {Function} props.endCall
 */
const HangUp = ({ endCall }) => (
  <span className="iconContainer" onClick={() => endCall()}>
    <img src={hangup} alt="End call" />
  </span>
);

export default HangUp;
