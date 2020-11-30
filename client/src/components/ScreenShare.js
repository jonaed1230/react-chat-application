import React from "react";
import share from "../Icons/share.svg";

/**
 * 
 * @param {object} props
 * @param {boolean} props.isMobileDevice
 * @param {Function} props.shareScreen
 */
const ScreenShare = ({ isMobileDevice, shareScreen }) => {
  let screenShare = (
    <span className="iconContainer" onClick={() => shareScreen()}>
      <img src={share} alt="Share screen" />
    </span>
  );
  if (isMobileDevice()) {
    screenShare = <></>;
  }
  return screenShare;
};

export default ScreenShare;
