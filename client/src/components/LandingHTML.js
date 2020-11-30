import React from "react";

/**
 * 
 * @param {object} props
 * @param {boolean} props.copied
 * @param {Function} props.showCopiedMessage
 * @param {string} props.yourID
 * @param {string} props.receiverID
 * @param {Function} props.setReceiverID
 * @param {Function} props.callPeer
 * @param {Function} props.setCopied
 */
const LandingHTML = ({ copied, showCopiedMessage, yourID, receiverID, setReceiverID, callPeer, setCopied }) => (
  <main>
    <div className="u-margin-top-xxlarge u-margin-bottom-xxlarge">
      <div className="o-wrapper-l">
        <div className="hero flex flex-column">
          <div>
            <div className="actionText">
              Send this Username to your friend,{" "}
              <span
                className={
                  copied ? "username highlight copied" : "username highlight"
                }
                onClick={() => {
                  showCopiedMessage(yourID, setCopied);
                }}
              >
                {yourID}
              </span>
              ?
            </div>
          </div>
          <div className="callBox flex">
            <input
              type="text"
              placeholder="Friend ID"
              value={receiverID}
              onChange={(e) => setReceiverID(e.target.value)}
              className="form-input"
            />
            <button
              onClick={() => callPeer(receiverID.toLowerCase().trim())}
              className="primaryButton"
            >
              Call
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default LandingHTML;
