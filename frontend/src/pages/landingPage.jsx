import React from 'react';
import landingLogo from '../assets/Group 76.svg'; // Header logo
import Button from '../components/Button';


const LandingPage = () => {
  return (
    <div className="relative w-full h-screen bg-grey_background overflow-hidden">
      {/* Background */}
      <div class="absolute bottom-0 left-0 w-[88%] h-full bg-steel_blue rounded-br-[700px]"></div>



      {/*logo */}
      <div className="absolute top-32 left-20">
        <img src={landingLogo} alt="ChronUs Logo" className="w-20 h-20" />
      </div>

  
      <div className="absolute top-1/3 left-20 text-white">
        <h2 className="text-5xl font-poppins mb-2">Plan Smarter</h2>
        <h2 className="text-5xl font-poppins mb-2">with</h2>
        <h1 className="text-8xl font-kulim">
          <span className="text-white font-normal">Chron</span>
          <span className="text-selective_yellow text-9xl">u</span>
          <span className="text-selective_yellow">s</span>
        </h1>

        
        <div className="mt-8 ">
          <Button text="Log in" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;