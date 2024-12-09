import React from 'react';
import { Link, useNavigate } from 'react-router-dom';import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import LoginLogo from '../assets/Group 76.svg'; // White logo
import returnArr from '../assets/returnArrow.svg';
import defaultimg from '../assets/defaultOp.svg';
import minimum from  '../assets/minTime.svg';
import TimeRangePicker from '../components/timeRangePicker';
import DatePicker from '../components/datePicker';


const CreateMeeting = () => {

    const navigate = useNavigate();

    const handleTimeRangeChange = (range) => {
        console.log('Selected Time Range:', range);
    };

    const handleDateChange = (item) => {
        console.log('Selected Date Range:', item);
      };

    return (
        <div className="relative w-full h-screen bg-steel_blue flex items-center justify-center gap-1">
            <div className="w-2/5 h-4/5 relative">
                <img src={LoginLogo} alt="ChronUs Logo" className="w-20 h-35" />
                <div
                className="relative mt-4 font-poppins text-white flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/dashboard")} 
                >
                    <img src={returnArr} alt="return" className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </div>
                <h1 className='py-2 font-poppins text-[3vw] font-medium text-white '>Set Your Dates</h1>
                <div className=''>
                    <DatePicker onChange={handleDateChange} />
                </div>
            </div>
            <div className="w-2/5 h-4/5">
                <h3 className='py-1 font-poppins text-[1.3vw] font-normal text-[#98BCDA]'>Advanced Options</h3>
                <h2 className='font-poppins text-[2.75vw] font-normal text-[#ffffff]'>Select Your Time Frame</h2>
                <TimeRangePicker onChange={handleTimeRangeChange} />
                <button className="relative top-96 left-1/2 -translate-x-1/2 bg-selective_yellow text-white font-normal font-poppins py-1 px-12 rounded-[50px] shadow-md w-auto cursor-pointer"
                onClick={() => navigate("/schedule")}
                >
                    Generate Schedule
                </button>


            </div>
        </div>
    );
};


export default CreateMeeting;
