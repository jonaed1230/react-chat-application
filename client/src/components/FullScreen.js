import React from "react";
import fullscreen from "../Icons/fullscreen.svg";
import minimize from "../Icons/minimize.svg";

/**
 * 
 * @param {object} props
 * @param {boolean} props.isfullscreen 
 * @param {Function} props.setFullscreen
 */
const FullScreenBtn = ({ isfullscreen, setFullscreen }) => {
  let fullscreenButton;
  if (isfullscreen) {
    fullscreenButton = (
      <span
        className="iconContainer"
        onClick={() => {
          setFullscreen(false);
        }}
      >
        <img src={minimize} alt="fullscreen" />
      </span>
    );
  } else {
    fullscreenButton = (
      <span
        className="iconContainer"
        onClick={() => {
          setFullscreen(true);
        }}
      >
        <img src={fullscreen} alt="fullscreen" />
      </span>
    );
  }
  return fullscreenButton;
};

export default FullScreenBtn;
