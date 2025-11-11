import React from "react";

const Accordion = ({
  title,
  subtext,
  children,
  imageSrc,
  isActive,
  onToggle,
}) => {
  return (
    <div
      className={`accordion w-full rounded-md transition-all duration-300 ease-in-out ${
        isActive
          ? "border-yellow-500 border-t-4 bg-secondary"
          : "bg-secondary opacity-70"
      }`}
    >
      <div
        className="accordion-item cursor-pointer flex items-center space-x-4 ph:px-10 px-4 ph:py-3 py-2"
        onClick={onToggle}
      >
        <img
          src={imageSrc}
          alt={`${title} image`}
          className="w-15 h-16 object-cover"
        />
        <div className="flex flex-col flex-grow">
          <h3 className="ph:text-base text-[15px] opacity-80 font-medium font-poppins text-secondary_letter">
            {title}
          </h3>
          <p className="ph:text-xs text-[10px] text-secondary_letter opacity-60 mt-1 font-poppins">
            {subtext}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="accordion-content px-4 py-0 bg-secondary rounded-b-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
