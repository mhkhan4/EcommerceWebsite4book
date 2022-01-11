import React from "react";
import "./Popup.css";

function Popup(props) {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn btn btn-primary text-uppercase" onClick={() => props.setTrigger(false)}>
          Continue Shopping
        </button>
        {/* {setTimeout(() => {
          props.setTrigger(false);
        }, 1000)} */}

        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
