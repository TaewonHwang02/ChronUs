import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ButtonBlue from '../components/ButtonBlue';
import { DraggableSelector } from "react-draggable-selector";


const LinkRetrievalPage = () => {
    const [dates, setDates] = useState([new Date()]); 
    const [times, setTimes] = useState([]);
    const location = useLocation();
    const user = location.state?.user || {}; 
    


    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">

        {/* Background Ellipse */}
        <div className="absolute w-full h-[84%] bg-selective_yellow rounded-br-[600px]"></div>

            
       {/* ChronUs Text*/}
       <div className="absolute top-[25%] left-[47%] transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h4 className="text-4xl font-poppins font-semibold mb-2">Thank you for choosing</h4>
            
            <h3 className="text-6xl font-kulim font-semibold">
                <span className="text-white  ">Chron</span>
                <span className="text-steel_blue text-7xl">u</span>
                <span className="text-steel_blue">s</span>
            </h3>
        </div>
        {/*  Text*/}
        <div className="absolute top-1/2 left-[58%] transform -translate-x-1/2 -translate-y-1/2 text-white ">
          
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
        
        <div className="absolute top-[65%] left-[62%] transform -translate-x-1/2 flex items-center justify-between space-x-4 w-[40%] h-16">
            {/* Meeting Name Input */}
            <input
                type="text"
                className="flex-grow p-2 text-black  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-steel_blue"
            />
            {/* Button */}
            <ButtonBlue text="Retrieve Link" />
        </div>

        
      {/* time Box */}
     
      <div className="absolute bottom-[10%] left-[20%] transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-md w-[33%] h-auto flex items-center justify-center">
    <DraggableSelector
        minTime={8}
        maxTime={19}
        dates={dates}
        timeSlots={times}
        setTimeSlots={setTimes}
        slotHeight={15}
        slotWidth={50}
        slotsMarginTop={5}        // Adjust the vertical gap (default is 11)
  slotsMarginLeft={5}      // Adj
    />
</div>



    </div>


    );
};
export default LinkRetrievalPage