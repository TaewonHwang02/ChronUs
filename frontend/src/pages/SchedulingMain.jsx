import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import registerLogo from "../assets/WhiteLogo.svg"; 
import { DraggableSelector } from "react-draggable-selector";

const SchedulingMainPage = () => {
    const [dates, setDates] = useState([
     
    ]); // Pre-populated dates for demonstration
    const [times, setTimes] = useState([]);
    const location = useLocation();
    const user = location.state?.user || {};  

    return (
        <div className="relative w-full h-screen bg-grey_background overflow-hidden">
            {/* Background Ellipse */}
            <div className="absolute w-[95%] h-[422.6px] bg-selective_yellow rounded-br-[700px]"></div>

            {/* Logo */}
            <div className="absolute top-[10%] right-[47.5%]">
                <img src={registerLogo} alt="ChronUs Logo" className="w-20 h-20" />
            </div>

            {/* Title */}
            <h1 className="absolute w-full h-full top-[20%] left-[1%] font-kulim font-semibold text-[2vw] leading-[3vw] text-white text-center">
                Welcome {user.name || "User"}, Select Your Time Slots
            </h1>

            {/* Draggable Selector */}
            <div className="absolute top-[30%] left-[5%] w-[40%]">
                <DraggableSelector
                    minTime={8}               // Start time
                    maxTime={19}              // End time 
                    dates={dates}             
                    timeSlots={times}         
                    setTimeSlots={setTimes}   
                />
            </div>

        </div>
    );
};

export default SchedulingMainPage;
