import React from 'react';
import { Icons } from '../common';
import './EmptyState.css';

const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-state-icon">
      <Icons.Inbox />
    </div>
    <h3 className="empty-state-title">No tasks yet</h3>
    <p className="empty-state-text">
      Tap the + button to create your first task and start tracking your productivity.
    </p>
  </div>
);

export default EmptyState;
