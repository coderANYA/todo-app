import React from "react";
import "./Alert.css";

export default function AlertClearOneTask({ 
show,
title,
onConfirm, 
onCancel })
{
  if (!show) return null;
  return (
    <div className="alert-overlay">
      <div className="alert alert-box alert-light d-flex flex-column justify-content-center align-items-center" role="alert">
        <p className="alert-text">
          ⚠️ Do you really want to delete the task <strong className="title-green">{title}</strong> ?
        </p>
        <div className="mt-3 d-flex justify-content-center">
          <button 
            onClick={onConfirm} 
            className="btn btn-danger me-2 alert-button">
            Yes
          </button>
          <button 
            onClick={onCancel} 
            className="btn btn-secondary alert-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
