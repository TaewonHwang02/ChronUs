import React from "react";

const Button = ({ text }) => {
  return (
    <button className="!border !border-white text-white font-poppins py-2 px-12 rounded-[50px]">
      {text}
    </button>
  );
};

export default Button;
