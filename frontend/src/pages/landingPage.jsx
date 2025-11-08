import React, { useState } from "react";
import landingLogo from "../assets/logo.svg";
import Button from "../components/clearButton.jsx";
import { useNavigate } from "react-router-dom";

const LandingPage = ({ darkMode, setDarkMode }) => {
  const [meetingName, setMeetingName] = useState("");
  const navigate = useNavigate();

  const handleHosting = () => {
    if (!meetingName.trim()) {
      alert("Please enter a meeting name before continuing.");
      return;
    }

    // Pass the meeting name to CreateMeeting via navigate's state
    navigate("/createMeeting", { state: { meetingName } });
  };

  return (
    <div
      className="relative w-full min-h-screen bg-primary flex tb:flex-row items-center justify-center tb:justify-start overflow-hidden
    bg-center bg-[length:200%_auto] bg-no-repeat z-0"
    >
      <div
        className="absolute inset-0 bg-center bg-[length:200%_auto] ph:bg-[length:120%_auto] bg-no-repeat 
        bg-[url('/src/assets/lightBg.svg')] ph:bg-[url('/src/assets/bg-light-desktop.svg')]
        dark:bg-[url('/src/assets/darkBg.svg')] dark:ph:bg-[url('/src/assets/bg-dark-desktop.svg')]
        animate-float-slow z-0"
      ></div>

      <div className="absolute w-full h-screen backdrop-blur-xs bg-gradient-to-b from-slate-900 to-transparent"></div>

      {/* Text + Input Section */}
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

        {/* Meeting Name Input Start Button */}
        <div className="font-poppins flex flex-wrap items-center justify-items-center">
          <input
            type="text"
            placeholder="Meeting Name"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            className="rounded-full bg-slate-500 bg-opacity-50 px-4 py-1 text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-0 focus:border-transparent"
          />
          <div className="my-8 mx-6">
            <Button text="Start Hosting" onClick={handleHosting} />
          </div>
        </div>

        {/* Floating background */}
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
