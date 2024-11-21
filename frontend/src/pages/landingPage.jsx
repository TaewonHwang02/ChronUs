import React from 'react';
import largeLogo from '../assets/logo_whitebg.png'; // Circular logo
import landingLogo from '../assets/Group 61.svg'; // Header logo
import '../styles/LandingPage.css'; // Import CSS
import Button from '../components/Button';


const LandingPage = () => {
    return (
        <div className="landing-page">
        <div className="background"></div>
        {/* Logo in the Top-Left Corner */}
        <div className="logo-container">
          <img src={landingLogo} alt="Logo" className="logo" />
        </div>

        <div className="text-content">
        <h2>Plan Smarter</h2>
        <h2>with</h2>
        <h1>
          <span class="chron">Chron</span>
          <span class="u">u</span>
          <span class="s">s</span>
        </h1>

        <Button text="Log in"/>
      </div>
  
    
   
      </div>
    );
  };
  
  export default LandingPage;