import React, { useEffect, useState, useRef, Suspense } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { Howl } from "howler";
import { useSelector, useDispatch } from 'react-redux';

import "rodal/lib/rodal.css";

import ringtone from "./Sounds/ringtone.mp3";

import ScreenShare from "./components/ScreenShare";
import FullScreenBtn from "./components/FullScreen";
import VideoControl from "./components/VideoControl";
import AudioControl from "./components/AudioControl";
import HangUp from "./components/HangUp";
import LandingHTML from "./components/LandingHTML";
import IncomingCall from "./components/IncomingCall";
import { setLocalStream, setPeers, setStreams, setSocket, setScreenShare } from "./state/ducks/ui";

// import { showCopiedMessage, isMobileDevice } from "./utils/tools";

const ringtoneSound = new Howl({
  src: [ringtone],
  loop: true,
  preload: true,
});

function App() {
  const [isfullscreen, setFullscreen] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef([]);
  const myPeer = useRef();

  useEffect(() => {
    startCall();
  }, []);

  /**
   * Socket.io socket
   */
  const { socket, localStream, peers, screenShare, streams } = useSelector((store) => store);
  const dispatch = useDispatch();

  // redirect if not https
  /* if(location.href.substr(0,5) !== 'https')
  location.href = 'https' + location.href.substr(4, location.href.length - 4)
 */
  //////////// CONFIGURATION //////////////////

  /**
   * RTCPeerConnection configuration
   */
  const configuration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      // public turn server from https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
      // set your own servers here
      {
        url: "turn:192.158.29.39:3478?transport=udp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
    ],
  };

  /**
   * UserMedia constraints
   */
  let constraints = {
    audio: true,
    video: false,
  };

  /////////////////////////////////////////////////////////

  // enabling the camera at startup
  function startCall() {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("Received local stream");
        userVideo.current.srcObject = stream;
        dispatch(setLocalStream(stream));
        init();
      })
      .catch((e) => console.log(e));
  }

  /**
   * initialize the socket connections
   */
  function init() {
    dispatch(setSocket(io()))

    socket.on("initReceive", (socket_id) => {
      console.log("INIT RECEIVE " + socket_id);
      addPeer(socket_id, false);

      socket.emit("initSend", socket_id);
    });

    socket.on("initSend", (socket_id) => {
      console.log("INIT SEND " + socket_id);
      addPeer(socket_id, true);
    });

    socket.on("removePeer", (socket_id) => {
      console.log("removing peer " + socket_id);
      removePeer(socket_id);
    });

    socket.on("disconnect", () => {
      console.log("GOT DISCONNECTED");
      for (let socket_id in peers) {
        removePeer(socket_id);
      }
    });

    socket.on("signal", (data) => {
      peers[data.socket_id].signal(data.signal);
    });
  }

  /**
   * Remove a peer with given socket_id.
   * Removes the video element and deletes the connection
   * @param {String} socket_id
   */
  function removePeer(socket_id) {
    let videoEl = document.getElementById(socket_id);
    if (videoEl) {
      const tracks = videoEl.srcObject.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });

      videoEl.srcObject = null;
      videoEl.parentNode.removeChild(videoEl);
    }
    if (peers[socket_id]) peers[socket_id].destroy();
    delete peers[socket_id];
  }

  /**
   * Creates a new peer connection and sets the event listeners
   * @param {String} socket_id
   *                 ID of the peer
   * @param {Boolean} am_initiator
   *                  Set to true if the peer initiates the connection process.
   *                  Set to false if the peer receives the connection.
   */
  function addPeer(socket_id, am_initiator) {
    
    peers[socket_id] = new SimplePeer({
      initiator: am_initiator,
      stream: localStream,
      config: configuration,
    });
    dispatch(setPeers(peers));

    peers[socket_id].on("signal", (data) => {
      socket.emit("signal", {
        signal: data,
        socket_id: socket_id,
      });
    });

    peers[socket_id].on("stream", (stream) => {
      dispatch(setStreams([...streams, { stream, socket_id }]));
    });
  }

  /**
   * Opens an element in Picture-in-Picture mode
   * @param {HTMLVideoElement} el video element to put in pip mode
   */
  function openPictureMode(el) {
    console.log("opening pip");
    el.requestPictureInPicture();
  }

  /**
   * Switches the camera between user and environment. It will just enable the camera 2 cameras not supported.
   */
  function switchMedia() {
    if (constraints.video.facingMode.ideal === "user") {
      constraints.video.facingMode.ideal = "environment";
    } else {
      constraints.video.facingMode.ideal = "user";
    }

    const tracks = localStream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      for (let socket_id in peers) {
        for (let index in peers[socket_id].streams[0].getTracks()) {
          for (let index2 in stream.getTracks()) {
            if (
              peers[socket_id].streams[0].getTracks()[index].kind ===
              stream.getTracks()[index2].kind
            ) {
              peers[socket_id].replaceTrack(
                peers[socket_id].streams[0].getTracks()[index],
                stream.getTracks()[index2],
                peers[socket_id].streams[0]
              );
              break;
            }
          }
        }
      }

      dispatch(setLocalStream(stream));
    });
  }

  /**
   * Enable screen share
   */
  function setScreen() {
    if (!screenShare) {
      dispatch(setScreenShare(true));
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true, ...constraints })
        .then((stream) => {
          stream.getVideoTracks()[0].onended = function () {
            stopScreen();
          };
          for (let socket_id in peers) {
            for (let index in peers[socket_id].streams[0].getTracks()) {
              for (let index2 in stream.getTracks()) {
                if (
                  peers[socket_id].streams[0].getTracks()[index].kind ===
                  stream.getTracks()[index2].kind
                ) {
                  peers[socket_id].replaceTrack(
                    peers[socket_id].streams[0].getTracks()[index],
                    stream.getTracks()[index2],
                    peers[socket_id].streams[0]
                  );
                  break;
                }
              }
            }
          }
          dispatch(setLocalStream(stream));
          socket.emit("removeUpdatePeer", "");
        });
    } else {
      dispatch(setScreenShare(false));
      stopScreen();
    }
  }

  function stopScreen() {
    const tracks = localStream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("Received local stream");
        for (let socket_id in peers) {
          for (let index in peers[socket_id].streams[0].getTracks()) {
            for (let index2 in stream.getTracks()) {
              if (
                peers[socket_id].streams[0].getTracks()[index].kind ===
                stream.getTracks()[index2].kind
              ) {
                peers[socket_id].replaceTrack(
                  peers[socket_id].streams[0].getTracks()[index],
                  stream.getTracks()[index2],
                  peers[socket_id].streams[0]
                );
                break;
              }
            }
          }
        }
        dispatch(setLocalStream(stream));
      })
      .catch((e) => alert(`getusermedia error ${e.name}`));
  }

  /**
   * Disables and removes the local stream and all the connections to other peers.
   */
  function removeLocalStream() {
    if (localStream) {
      const tracks = localStream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });
    }

    for (let socket_id in peers) {
      removePeer(socket_id);
    }
  }

  /**
   * Enable/disable microphone
   */
  function toggleMute() {
    for (let index in localStream.getAudioTracks()) {
      localStream.getAudioTracks()[
        index
      ].enabled = !localStream.getAudioTracks()[index].enabled;
    }
  }
  /**
   * Enable/disable video
   */
  function toggleVid() {
    for (let index in localStream.getVideoTracks()) {
      localStream.getVideoTracks()[
        index
      ].enabled = !localStream.getVideoTracks()[index].enabled;
    }
  }



  /**
   * Making Chat Option
   */

  function sendText(text, id) {
    console.log(text);
  }

  let UserVideo;
  if (localStream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (isfullscreen) {
    PartnerVideo = (
      <video
        className="partnerVideo cover"
        playsInline
        ref={partnerVideo}
        autoPlay
      />
    );
  } else if (!isfullscreen) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    );
  }

  return (
    <div className="callContainer" style={{ display: 'none' }}>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      {/* <div className="partnerVideoContainer">{PartnerVideo}</div>
      <div className="userVideoContainer">{UserVideo}</div>
      <div className="controlsContainer flex">
        <AudioControl
          audioMuted={audioMuted}
          toggleMuteAudio={toggleMuteAudio}
        />
        <VideoControl
          videoMuted={videoMuted}
          toggleMuteVideo={toggleMuteVideo}
        />
        <ScreenShare
          shareScreen={shareScreen}
        />
        <FullScreenBtn
          isfullscreen={isfullscreen}
          setFullscreen={setFullscreen}
        />
        <HangUp endCall={endCall} />
      </div> */}
    </div>
  );
}

export default App;
