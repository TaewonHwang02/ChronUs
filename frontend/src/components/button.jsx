import React from 'react';

const Button = ({ text }) => {
  return (
    <button className="bg-selective_yellow text-black font-poppins py-2 px-12 rounded-[50px] shadow-md">
      {text}
    </button>
  );
};

export default Button;
