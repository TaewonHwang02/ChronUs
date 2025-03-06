// Dana Lee 261054107
// Wendy Kuang 261111975 (part of the responsive design)

import React from 'react';
import landingLogo from '../assets/Group 76.svg'; // Header logo
import demoPic from '../assets/demo.svg'; // Demo picture
import Button from '../components/button.jsx';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative w-full h-screen flex tb:flex-row items-center justify-center tb:justify-start overflow-hidden">
      <div className="absolute w-full h-screen bg-grey_background z-[-2]"></div>
      <div className="absolute bottom-0 left-0 w-[88%] h-full bg-steel_blue rounded-br-[700px] z-[-1]"></div>

      {/* Text part on left */}
      <div className="flex flex-col justify-center space-y-[40px] px-[45px] tb:px-[5%] w-full tb:w-1/2">
        <div>
          <img src={landingLogo} alt="ChronUs Logo" className="w-[120px] h-[120px]" />
        </div>

        <div className="text-white">
          <h2 className="text-lg tb:text-3xl font-poppins mb-2">Plan Smarter</h2>
          <h2 className="text-lg tb:text-3xl font-poppins mb-2">with</h2>
          <h1 className="text-6xl tb:text-7xl font-kulim ">
            <span className="text-white font-normal">Chron</span>
            <span className="text-selective_yellow text-6xl tb:text-8xl">u</span>
            <span className="text-selective_yellow">s</span>
          </h1>
        </div>

        {/* Direct user to login page */}
        <div>
          <Link to="/login">
            <Button text="Log in" />
          </Link>
        </div>

        {/* If user has not registered, direct them to the register page */}
        <div className="font-poppins m-[10px]">
          <p className="text-xs text-white">
            Not registered yet?{' '}
            <Link to="/register" className="underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>

      {/* Floating white block columns (to disappear in phone mode) */}
      {/* Preview of website feature */}
      <div className="sm:visible invisible sm:flex relative w-full tb:flex-row tb:w-1/2 h-full items-center justify-center gap-8">
        <div className="flex w-2/3 flex-col gap-y-12 gap-4 top-[10%] float-animation">
          <div className="w-full h-64 bg-gradient-to-br from-steel_blue from-60% to-light_blue to-100% rounded-[18px]"></div>
          <div className="w-full h-96 bg-white flex justify-center items-center rounded-sm">
            <img src={demoPic} alt="Demo" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex w-1/3 h-full justify-center flex-col gap-y-12 gap-4 top-[15%] float-animation">
          <div className="w-full h-[30%] bg-white opacity-40 rounded-sm"></div>
          <div className="w-full h-[60%] bg-white rounded-sm"></div>
          <div className="w-full h-[30%] bg-white rounded-sm"></div>
        </div>
      </div>

      {/* Making white blocks on right slightly float */}
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
