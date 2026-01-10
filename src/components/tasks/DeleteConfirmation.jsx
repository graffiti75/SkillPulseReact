import React from 'react';
import { Icons } from '../common';
import './DeleteConfirmation.css';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, taskDescription }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '380px' }}
      >
        <div className="confirm-dialog">
          <div className="confirm-icon">
            <Icons.AlertCircle />
          </div>
          <h3 className="confirm-title">Delete Task?</h3>
          <p className="confirm-text">
            Are you sure you want to delete "{taskDescription}"? This action cannot be undone.
          </p>
          <div className="confirm-buttons">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
