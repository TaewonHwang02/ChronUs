import React, { useState, useEffect } from "react";
import landingLogo from "../assets/logo.svg"; // Header logo
import Button from "../components/clearButton.jsx";
import { Link } from "react-router-dom";

const LandingPage = ({ darkMode, setDarkMode }) => {
  const [showToggle, setShowToggle] = useState(false);
  return (
    <div
      className="relative w-full h-screen bg-primary flex tb:flex-row items-center justify-center tb:justify-start overflow-hidden
    bg-center bg-[length:200%_auto] bg-no-repeat z-[-2]
    "
    >
      <div
        className="absolute inset-0 bg-center bg-[length:200%_auto] bg-no-repeat 
    bg-[url('/src/assets/lightBg.svg')] ph:bg-[url('/src/assets/bg-light-desktop.jpg')]
    dark:bg-[url('/src/assets/darkBg.svg')] dark:ph:bg-[url('/src/assets/bg-dark-desktop.jpg')]
    animate-float-slow z-[-1]"
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
            <span className="text-selective_yellow text-6xl tb:text-6xl uppercase">
              u
            </span>
            <span className="text-selective_yellow">s</span>
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

        <button
          onClick={() => setShowToggle(!showToggle)}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 p-3 bg-blue-500 text-white rounded"
        >
          Toggle Dark/Light
        </button>

        <div className="flex space-x-2 justify-center items-center z-0">
          <div
            onClick={() => setDarkMode(false)}
            className="p-4 bg-slate-300 rounded-sm"
          >
            <div></div>
          </div>
          <div
            onClick={() => setDarkMode(true)}
            className="p-4 bg-slate-300 rounded-sm"
          >
            Dark
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
    </div>
  );
};

export default LandingPage;
