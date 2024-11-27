import React from 'react';
import LoginLogo from '../assets/GreenLogo.svg'; // Login logo
import Button from '../components/Button';

const LoginPage = () => {
    


    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Background Rectangle */}
        <div class="absolute bottom-0 right-0 w-[60%] h-full bg-pine_green rounded-bl-[432px]"></div>

      {/* Log In Heading */}
      <h1 className="absolute w-[14.6%] h-[6.1%] top-[25.4%] left-[14.1%] font-kulim font-semibold text-[3.65vw] leading-[5.6vw] text-[#032B43] text-center">
        Log In
      </h1>

      {/* Email Address */}
      <label
        htmlFor="email"
        className="absolute top-[39.4%] left-[8.64%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
      >
        Email Address
      </label>
      <input
        type="email"
        id="email"
        className="absolute w-[23.6%] h-[4.9%] top-[43.1%] left-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
      />

      {/* Password */}
      <label
        htmlFor="password"
        className="absolute top-[49.2%] left-[8.7%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        className="absolute w-[23.6%] h-[4.9%] top-[52.7%] left-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
      />

      {/* Sign In Button */}
      <button className="absolute w-[12.4%] h-[5%] top-[64.6%] left-[14.2%] bg-[#FFBA08] shadow rounded-[2.7%] text-[1.46vw] font-poppins font-normal leading-[2vw] text-[#000000]">
        Sign In
      </button>

      {/* 'Or' Text */}
      <p className="absolute top-[75.6%] left-[20%] font-poppins text-[1.15vw] text-[#0D2D7F]">
        or
      </p>

      {/* Lines Around 'Or' */}
      <div className="absolute top-[77.2%] left-[7.03%] w-[11.1%] border border-black"></div>
      <div className="absolute top-[77.2%] left-[23.2%] w-[11.1%] border border-black"></div>

      {/* Register Link */}
      <p className="absolute top-[91.4%] left-[78.6%] w-[26.7%] font-poppins text-[0.93vw] font-light leading-[5.6vw] text-[#FFFFFF] text-center">
        Not registered yet?{' '}
        <a href="/register" className="underline">
          Register Now
        </a>
      </p>

      {/* Placeholder Shapes */}
      <div className="absolute top-[8.4%] left-[15.7%]">
        <img src={LoginLogo} alt="ChronUs Logo" className="w-20 h-20" />
      </div>
    </div>

        

    );
};
export default LoginPage