import React from 'react';
import landingLogo from '../assets/Group 76.svg'; // Header logo
import Button from '../components/Button';
import {Link} from 'react-router-dom'


const LandingPage = () => {
  return (
    <div className="relative w-full h-screen bg-grey_background overflow-hidden">
      {/* Background */}
      <div class="absolute bottom-0 left-0 w-[88%] h-full bg-steel_blue rounded-br-[700px]"></div>



      {/*logo */}
      <div className="absolute top-32 left-20">
        <img src={landingLogo} alt="ChronUs Logo" className="w-20 h-20" />
      </div>

      {/* gradient rectangle */}
      <div class="absolute top-[10%] left-[48.73%] w-64 h-64 bg-gradient-to-br from-steel_blue from-60% to-light_blue to-100% rounded-[18px] flex items-center justify-center"> </div>

      {/* rectangle */}
      <div class="absolute top-[50%] left-[48.73%] w-64 h-64 bg-white flex items-center justify-center"> </div>
      <div class="absolute top-[15%] right-[7%] w-64 h-64 bg-white flex items-center justify-center"> </div>
      <div class="absolute bottom-0 right-[7%] w-64 h-64 bg-white flex items-center justify-center"> </div>
      
       {/* Clear rectangles */}
      <div class="absolute top-0 right-[7%] w-64 h-20 bg-white opacity-40 flex items-center justify-center"> </div>
      <div class="absolute bottom-0 right-[33.5%] w-64 h-20 bg-white opacity-40 flex items-center justify-center"> </div>

       {/* Text */}
      <div className="absolute top-1/3 left-20 text-white">
        <h2 className="text-5xl font-poppins mb-2">Plan Smarter</h2>
        <h2 className="text-5xl font-poppins mb-2">with</h2>
        <h1 className="text-8xl font-kulim">
          <span className="text-white font-normal">Chron</span>
          <span className="text-selective_yellow text-9xl">u</span>
          <span className="text-selective_yellow">s</span>
        </h1>

      {/* Button */}
      <div className="mt-8 ">
        <Link to="/login">
        <Button text="Log in" />
        </Link>
      </div>

      <div className="mt-32 text-left"> 
    
      <p className="mt-4 text-sm text-white">
            Not registered yet?{' '}
            <a href="#" className="text-white">
              Register Now
            </a>
          </p>
      </div>

        
      </div>
    </div>
  );
};

export default LandingPage;