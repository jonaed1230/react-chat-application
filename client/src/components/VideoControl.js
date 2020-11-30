import React from 'react';
import camera from "../Icons/camera.svg";
import camerastop from "../Icons/camera-stop.svg";

/**
 * 
 * @param {object} props
 * @param {boolean} props.videoMuted
 * @param {Function} props.toggleMuteVideo
 */
const VideoControl = ({ videoMuted, toggleMuteVideo }) => {
  let videoControl;
  if (videoMuted) {
    videoControl = (
      <span className="iconContainer" onClick={() => toggleMuteVideo()}>
        <img src={camerastop} alt="Resume video" />
      </span>
    );
  } else {
    videoControl = (
      <span className="iconContainer" onClick={() => toggleMuteVideo()}>
        <img src={camera} alt="Stop audio" />
      </span>
    );
  };
  return videoControl;
};

export default VideoControl;
