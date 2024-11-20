import React from 'react';
import '../styles.css'
const Button = ({ text }) => {
    return (
      <button className="button rounded shadow transition">
        {text}
      </button>
    );
  };

  export default Button