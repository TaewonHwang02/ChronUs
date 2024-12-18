import React from 'react';

const Button = ({ text,onClick}) => {
  return (
    <button className="bg-steel_blue text-white font-poppins py-2 px-12 rounded-[50px] shadow-md" onClick={onClick}>
      {text}
    </button>
  );
};


export default Button;

