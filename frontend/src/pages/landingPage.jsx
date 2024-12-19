import React from 'react';
import landingLogo from '../assets/Group 76.svg'; // Header logo
import Button from '../components/Button';
import {Link} from 'react-router-dom'


const LandingPage = () => {
  return (
    <div className="relative w-full h-screen flex items-center overflow-hidden">
      {/* Grey Background */}
      <div className='absolute w-full h-screen bg-grey_background z-[-2]'></div>
      {/* Blue Ellipse Background */}
      <div class="absolute bottom-0 left-0 w-[88%] h-full bg-steel_blue rounded-br-[700px] z-[-1]"></div>

      {/* rectangle row 1*/}
      <div className='invisible ph:visible'>
        {/* gradient rectangle */}
        <div class="absolute top-[10%] left-[48.73%] w-64 h-64 bg-gradient-to-br from-steel_blue from-60% to-light_blue to-100% rounded-[18px] flex items-center justify-center"> </div>
        <div class="absolute top-[50%] left-[48.73%] w-64 h-64 bg-white flex items-center justify-center"> </div>
        {/* Clear rectangle */}
        <div class="invisible absolute bottom-0 right-[33.5%] w-64 h-20 bg-white opacity-40 flex items-center justify-center"> </div>
      </div>
      
      {/* rectangle row 2*/}
      <div className=''>
        {/* Clear rectangle */}
        <div class="absolute top-0 right-[-60%] ph:right-[7%] w-64 h-20 bg-white opacity-40 flex items-center justify-center"> </div>
        <div class="absolute top-[15%] right-[-60%] ph:right-[7%] w-64 h-64 bg-white flex items-center justify-center"> </div>
        <div class="absolute bottom-0 right-[-60%] ph:right-[7%] w-64 h-64 bg-white flex items-center justify-center"> </div>
      </div>
      
      {/* Left Side */}
      <div className='flex flex-col space-y-[30px] translate-y-[-30px] ml-[45px]'>
        {/*logo */}
        <div className="">
          <img src={landingLogo} alt="ChronUs Logo" className="w-20 h-20" />
        </div>

        {/* Text */}
        <div className="text-white">
          <h2 className="text-3xl ph:text-5xl font-poppins mb-2">Plan Smarter</h2>
          <h2 className="text-3xl ph:text-5xl font-poppins mb-2">with</h2>
          <h1 className="text-5xl ph:text-8xl font-kulim">
            <span className="text-white font-normal">Chron</span>
            <span className="text-selective_yellow text-6xl ph:text-9xl">u</span>
            <span className="text-selective_yellow">s</span>
          </h1>
        </div>

        {/* Button */}
        <div className="">
          <Link to="/login">
          <Button text="Log in"/>
          </Link>
        </div>
      </div>
      

      <div className="absolute bottom-0 text-left font-poppins m-[10px]"> 
        <p className="text-sm text-black ph:text-white">
            Not registered yet?{' '}
            <a href="#" className="">
              Register Now
            </a>
        </p>
      </div>

        
      
    </div>
  );
};

export default LandingPage;