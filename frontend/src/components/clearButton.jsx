import React from "react";
import PropTypes from "prop-types";

const Button = ({ text, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className="!border-2 text-gray-50 text-sm font-poppins font-thin px-8 rounded-[50px]"
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button;
