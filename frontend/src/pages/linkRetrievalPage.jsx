import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ButtonBlue from '../components/ButtonBlue';


const LinkRetrievalPage = () => {



    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">

            {/* Background Ellipse */}
            <div className="absolute w-full h-[84%] bg-selective_yellow rounded-br-[600px]"></div>

            
       {/* Text */}
       <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h4 className="text-5xl font-poppins mb-2">Thank you for choosing</h4>
            
            <h3 className="text-8xl font-kulim">
                <span className="text-white font-normal">Chron</span>
                <span className="text-steel_blue text-9xl">u</span>
                <span className="text-steel_blue">s</span>
            </h3>
        </div>

          




    
    </div>

    );
};
export default LinkRetrievalPage