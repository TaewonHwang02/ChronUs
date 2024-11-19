import React from 'react';
import largeLogo from '../assets/logo_whitebg.png'; // Circular logo
import landingLogo from '../assets/logo.png'; // Header logo
import '../styles/LandingPage.css'; // Import CSS


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
          <span className="chron">Chron</span>
          <span className="us">Us</span>
        </h1>

      </div>
  
    
   
      </div>
    );
  };
  
  export default LandingPage;