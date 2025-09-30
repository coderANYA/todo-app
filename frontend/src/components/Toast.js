import React, { useEffect, useRef } from "react";
import "./Toast.css";

export default function Toast({ message, show }) {
  const toastRef = useRef(null);

  useEffect(() => {
    if (show && toastRef.current) {
      const toastEl = toastRef.current;

      // Initialize the Bootstrap toast
      const bsToast = new window.bootstrap.Toast(toastEl, {
        delay: 5000,        // 5 seconds
        autohide: true,
      });

      bsToast.show();
    }
  }, [show]);

  return (
    <div
      ref={toastRef}
      className="toast bottom-0 start-0 m-4"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">

      <div className="d-flex">
        <div
          className="toast-body">
            <strong>{message}</strong>
        </div>
      </div>
    </div>
  );
}
