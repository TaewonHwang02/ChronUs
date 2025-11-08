import React from "react";

const Button = ({ text }) => {
  return (
    <button className="!border-2 text-gray-50 text-sm font-poppins font-thin text-base px-8 rounded-[50px]">
      {text}
    </button>
  );
};

export default Button;
