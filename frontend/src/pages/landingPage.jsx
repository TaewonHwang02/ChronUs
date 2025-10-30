import React, { useState, useEffect } from "react";
import landingLogo from "../assets/logo.svg"; // Header logo
import Button from "../components/clearButton.jsx";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div
      className="relative w-full h-screen bg-primary-light flex tb:flex-row items-center justify-center tb:justify-start overflow-hidden
    bg-[url('/src/assets/lightBg.svg')]   /* Mobile light */
    ph:bg-[url('/src/assets/bg-light-desktop.jpg')]  /* Desktop light */
    dark:bg-[url('/src/assets/lightBg.svg')]   /* Mobile dark */
    dark:ph:bg-[url('/src/assets/bg-dark-desktop.jpg')] /* Desktop dark */
    bg-center bg-[length:200%_auto] bg-no-repeat 
    "
    >
      <div className="absolute w-full h-screen backdrop-blur-xs bg-gradient-to-b from-slate-900 to-transparent"></div>
      {/* <div className="absolute bottom-0 left-0 w-[88%] h-full  rounded-br-[700px] z-[-1]"></div> */}

      {/* Text part on left */}
      <div className="flex flex-col justify-center space-y-[45px] px-[45px] tb:px-[5%] w-full tb:w-1/2 relative">
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

        <div className="font-poppins wrap justify-center">
          <input
            type="text"
            placeholder="Meeting Name"
            className="rounded-full px-4 py-1"
          />
          <div className="my-8">
            <Link to="/createMeeting">
              <Button text="Start Hosting"></Button>
            </Link>
          </div>
        </div>

        <div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className=" px-6 border border-white rounded-full text-white"
          >
            Toggle {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        {/* Direct user to login page
        <div>
          <Link to="/login">
            <Button text="Log in" />
          </Link>
        </div> */}

        {/* If user has not registered, direct them to the register page
        <div className="font-poppins m-[10px]">
          <p className="text-xs text-white">
            Not registered yet?{" "}
            <Link to="/register" className="underline">
              Register Now
            </Link>
          </p>
        </div> */}
      </div>

      {/* Floating white block columns (to disappear in phone mode) */}
      {/* Preview of website feature */}
      <div className="sm:visible invisible sm:flex relative w-full tb:flex-row tb:w-1/2 h-full items-center justify-center gap-8 z-10"></div>

      {/* Making prototypes float */}
      <style>
        {`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
