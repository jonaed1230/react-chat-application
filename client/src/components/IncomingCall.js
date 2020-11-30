import React from 'react';

/**
 * 
 * @param {object} props
 * @param {boolean} props.receivingCall
 * @param {boolean} props.callAccepted
 * @param {boolean} props.callRejected
 * @param {Function} props.acceptCall
 * @param {Function} props.rejectCall
 * @param {string} props.caller
 */
const IncomingCall = ({ receivingCall, callAccepted, callRejected, acceptCall, rejectCall, caller }) => {
  if (receivingCall && !callAccepted && !callRejected) {
    return (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div>
            <span className="callerID">{caller}</span> is calling you!
          </div>
          <div className="incomingCallButtons flex">
            <button
              name="accept"
              className="alertButtonPrimary"
              onClick={() => acceptCall()}
            >
              Accept
            </button>
            <button
              name="reject"
              className="alertButtonSecondary"
              onClick={() => rejectCall()}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <></>
    );
  }
};

export default IncomingCall;
