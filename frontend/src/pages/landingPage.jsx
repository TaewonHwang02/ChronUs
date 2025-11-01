import React, { useState, useEffect } from "react";
import landingLogo from "../assets/logo.svg"; // Header logo
import Button from "../components/clearButton.jsx";
import { Link } from "react-router-dom";

const LandingPage = ({ darkMode, setDarkMode }) => {
  const [showToggle, setShowToggle] = useState(false);
  return (
    <div
      className="relative w-full h-screen bg-primary flex tb:flex-row items-center justify-center tb:justify-start overflow-hidden
    bg-center bg-[length:200%_auto] bg-no-repeat z-0
    "
    >
      <div
        className="absolute inset-0 bg-center bg-[length:200%_auto] ph:bg-[length:120%_auto] bg-no-repeat 
    bg-[url('/src/assets/lightBg.svg')] ph:bg-[url('/src/assets/bg-light-desktop.svg')]
    dark:bg-[url('/src/assets/darkBg.svg')] dark:ph:bg-[url('/src/assets/bg-dark-desktop.svg')]
    animate-float-slow z-0"
      ></div>
      <div className="absolute w-full h-screen backdrop-blur-xs bg-gradient-to-b from-slate-900 to-transparent"></div>

      {/* Text part on left */}
      <div className="flex flex-col justify-center items-start space-y-[45px] px-[45px] tb:px-[5%] w-full tb:w-1/2 relative">
        <div>
          <img src={landingLogo} alt="ChronUs Logo" className="w-[54px]" />
        </div>

        <div className="text-white">
          <h2 className="text-m tb:text-2xl font-poppins mb-1">Plan Smarter</h2>
          <h2 className="text-lg tb:text-2xl font-poppins mb-2 py-2">with</h2>
          <h1 className="text-6xl tb:text-6xl font-kulim">
            <span className="text-white font-normal">Chron</span>
            <span className="text-tertiary text-6xl tb:text-6xl uppercase">
              u
            </span>
            <span className="text-tertiary">s</span>
          </h1>
        </div>

        <div className="font-poppins flex flex-wrap items-center">
          <input
            type="text"
            placeholder="Meeting Name"
            className="rounded-full bg-slate-500 bg-opacity-50 px-4 py-1 text-sm text-white placeholder-slate-300"
          />
          <div className="my-8 mx-6">
            <Link to="/createMeeting">
              <Button text="Start Hosting"></Button>
            </Link>
          </div>
        </div>

        <style>
          {`
          @keyframes floatSlow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-float-slow {
            animation: floatSlow 10s ease-in-out infinite;
          }
        `}
        </style>
      </div>

      {/* Option Panel */}
      <div className="absolute bottom-0 w-full transform flex flex-col items-end z-10 font-poppins text-sm text-white">
        <div
          className={`cursor-pointer bg-tertiary text-white
      flex flex-col items-center justify-center
      transition-all duration-300 ease-in-out
      ${
        showToggle
          ? "w-full h-1/4 rounded-lg p-2"
          : "mb-8 mr-6 w-12 h-12 rounded-full p-0"
      }
    `}
        >
          {!showToggle && (
            <span onClick={() => setShowToggle(true)} className="text-2xl">
              +
            </span>
          )}

          {/* Expanded panel */}
          {showToggle && (
            <div className="flex flex-row w-full h-full justify-center relative">
              <div className="flex flex-col items-center">
                {/* Theme selector */}
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
    </div>
  );
};

export default LandingPage;
