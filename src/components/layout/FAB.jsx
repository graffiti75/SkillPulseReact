import React from 'react';
import { Icons } from '../common';
import './FAB.css';

const FAB = ({ onClick }) => {
  return (
    <button className="fab" onClick={onClick}>
      <Icons.Plus />
    </button>
  );
};

export default FAB;
