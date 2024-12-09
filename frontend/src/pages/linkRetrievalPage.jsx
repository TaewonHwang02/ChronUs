import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ButtonBlue from '../components/ButtonBlue';


const LinkRetrievalPage = () => {



    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">

            {/* Background Ellipse */}
            <div className="absolute w-full h-[84%] bg-selective_yellow rounded-br-[600px]"></div>

            
       {/* Text */}
       <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h4 className="text-4xl font-poppins font-semibold mb-2">Thank you for choosing</h4>
            
            <h3 className="text-6xl font-kulim font-semibold">
                <span className="text-white  ">Chron</span>
                <span className="text-steel_blue text-7xl">u</span>
                <span className="text-steel_blue">s</span>
            </h3>

           


        </div>

        <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-white ">
            <h3 className="text-3xl font-poppins mb-2">
                <span className="text-white  ">You will be notified of the most</span>
                <span className="text-white  ">optimal time slots upon</span>

            </h3>
    
        </div>
        

        {/* White Box */}
        <div class="absolute bottom-[3%] left-[10%] w-64 h-96 bg-white flex items-center justify-center"></div>


          




    
    </div>

    );
};
export default LinkRetrievalPage