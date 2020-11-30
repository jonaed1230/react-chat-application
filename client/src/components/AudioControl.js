import React from 'react';
import microphone from "../Icons/microphone.svg";
import microphonestop from "../Icons/microphone-stop.svg";

/**
 * 
 * @param {object} props
 * @param {boolean} props.audioMuted
 * @param {Function} props.toggleMuteAudio
 */
const AudioControl = ({ audioMuted, toggleMuteAudio }) => {
  let audioControl;
  if (audioMuted) {
    audioControl = (
      <span className="iconContainer" onClick={() => toggleMuteAudio()}>
        <img src={microphonestop} alt="Unmute audio" />
      </span>
    );
  } else {
    audioControl = (
      <span className="iconContainer" onClick={() => toggleMuteAudio()}>
        <img src={microphone} alt="Mute audio" />
      </span>
    );
  }
  return audioControl;
};

export default AudioControl;
