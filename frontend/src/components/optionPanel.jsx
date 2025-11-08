import React, { useState } from "react";

const OptionPanel = ({ darkMode, setDarkMode }) => {
  const [showToggle, setShowToggle] = useState(false);

  return (
    <div className="fixed bottom-0 w-full transform flex flex-col items-end z-10 font-poppins text-sm text-white">
      <div
        className={`cursor-pointer bg-tertiary text-white
        flex flex-col items-center justify-center
        transition-all duration-300 ease-in-out
        ${
          showToggle
            ? "w-full h-1/4 rounded-lg p-2"
            : "mb-10 mr-10 w-12 h-12 rounded-full p-0"
        }`}
      >
        {!showToggle && (
          <span onClick={() => setShowToggle(true)} className="text-2xl">
            +
          </span>
        )}

        {showToggle && (
          <div className="flex flex-row w-full h-full justify-center relative">
            <div className="flex flex-col items-center">
              <div className="flex flex-row space-x-2 p-3">
                <div
                  onClick={() => setDarkMode(false)}
                  className={`p-1 rounded-sm cursor-pointer flex flex-row space-x-1 transition-colors duration-300
                  ${!darkMode ? "bg-yellow-700" : "bg-slate-200"}`}
                >
                  <div className="rounded-sm w-6 h-8 bg-selective_blue"></div>
                  <div className="rounded-sm w-6 h-8 bg-white"></div>
                  <div className="rounded-sm w-6 h-8 bg-tertiary"></div>
                </div>

                <div
                  onClick={() => setDarkMode(true)}
                  className={`p-1 rounded-sm cursor-pointer flex flex-row space-x-1 transition-colors duration-300
                  ${darkMode ? "bg-dark" : "bg-slate-200"}`}
                >
                  <div className="rounded-sm w-6 h-8 bg-dark"></div>
                  <div className="rounded-sm w-6 h-8 bg-grey"></div>
                  <div className="rounded-sm w-6 h-8 bg-tertiary"></div>
                </div>
              </div>
              <span className="mt-2 text-white">Theme</span>
            </div>

            <div
              onClick={() => setShowToggle(false)}
              className="absolute top-0 right-0 mb-2 px-2 py-1 !border-0 text-white rounded-full text-xl cursor-pointer"
            >
              -
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionPanel;
