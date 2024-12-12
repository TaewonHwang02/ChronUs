import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ButtonBlue from '../components/ButtonBlue';


const LinkRetrievalPage = () => {

    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">

        {/* Background Ellipse */}
        <div className="absolute w-full h-[84%] bg-selective_yellow rounded-br-[600px]"></div>

            
       {/* Text */}
       <div className="absolute top-[25%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h4 className="text-4xl font-poppins font-semibold mb-2">Thank you for choosing</h4>
            
            <h3 className="text-6xl font-kulim font-semibold">
                <span className="text-white  ">Chron</span>
                <span className="text-steel_blue text-7xl">u</span>
                <span className="text-steel_blue">s</span>
            </h3>
        </div>

        <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-white ">
          
            <h3 className="text-3xl font-poppins mb-2">
                <span className="text-white  ">You will be notified of the most</span>
            </h3>
            <h3 className="text-3xl font-poppins mb-8">
                <span className="text-white  ">optimal time  slots upon</span>
            </h3>
            <h3 className="text-3xl font-poppins mb-2">
               <span className="text-white  ">Deadline:</span>
           </h3>
        </div>
        
        <div className="absolute top-[65%] left-[59%] transform -translate-x-1/2 flex items-center justify-between space-x-4 w-[40%] h-16">
            {/* Meeting Name Input */}
            <input
                type="text"
                className="flex-grow p-2 text-black  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-steel_blue"
            />
            {/* Button */}
            <ButtonBlue text="Retrieve Link" />
        </div>

        
      {/* White Box */}
        <div class="absolute bottom-[3%] left-[10%] w-96 h-[30rem] bg-white flex items-center justify-center"></div>


        
    
    </div>

    );
};
export default LinkRetrievalPage