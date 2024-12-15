import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import LoginLogo from '../assets/Group 76.svg'; // White logo
import returnArr from '../assets/returnArrow.svg';
import minimum from '../assets/defaultOp.svg';
import defaultimg from  '../assets/minTime.svg';
import TimeRangePicker from '../components/timeRangePicker';
import DatePicker from '../components/datePicker';
import Accordion from '../components/accordionOptions';
import MinRangeSlider from '../components/minTimeRange';


const CreateMeeting = () => {

    const handleGenerateSchedule = async () => {
        const meetingData = {
          meetingID: "meeting123", // Replace with actual data
          userID: "user456",
          scheduleMode: activeIndex === 0 ? "common_time" : "common_date", // Based on the selected accordion
          emailOption: true, // Retrieve checkbox value dynamically
          timeZone: "UTC", // Replace with actual data
          begTimeFrame: 480, // Start time in minutes
          endTimeFrame: 1020, // End time in minutes
          minimumTimeSlot: 30, // Replace with actual data
          startDate: new Date(), // Replace with selected date range
          endDate: new Date(), // Replace with selected date range
          deadline: new Date(), // Replace with actual data
          participants: ["user1@example.com", "user2@example.com"], // Replace with actual data
        };
      
        try {
          const response = await axios.post("http://localhost:5000/api/meetings/create-meeting", meetingData);
          console.log(response.data.message);
          navigate("/schedule"); // Redirect after successful meeting creation
        } catch (error) {
          console.error("Error creating meeting:", error.response?.data || error.message);
        }
      };

    const navigate = useNavigate();

    const handleTimeRangeChange = (range) => {
        console.log('Selected Time Range:', range);
    };

    const handleDateChange = (item) => {
        console.log('Selected Date Range:', item);
      };

    const [activeIndex, setActiveIndex] = useState(null);

    const [emailOption, setEmailOption] = useState(false);

    const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className="relative w-full h-screen bg-steel_blue flex items-center justify-center gap-1">
            <div className="w-2/5 h-4/5 relative">
                <img src={LoginLogo} alt="ChronUs Logo" className="w-20 h-35" />
                <div
                className="relative w-2/3 mt-4 font-poppins text-white flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <img src={returnArr} alt="return" className="w-5 h-5"/>
                    <span>Back to Dashboard</span>
                </div>
                <h1 className='py-2 font-poppins text-[3vw] font-medium text-white '>Set Your Dates</h1>
                    <DatePicker onChange={handleDateChange}/>

                <div className="mt-2 px-3 w-4/5 left-1/2">
                    <label className="flex items-center space-x-2 text-[#ffffff]">
                        <input type="checkbox" className="form-checkbox" checked={emailOption} onChange={(e) => setEmailOption(e.target.checked)} />
                        <span className="px-2 text-l font-poppins">Receive an E-mail of curated dates/times upon the Deadline</span>
                    </label>
                </div>
                
            </div>
            <div className="w-2/5 h-4/5">
                <h3 className='py-1 font-poppins text-[1.3vw] font-normal text-[#98BCDA]'>Advanced Options</h3>
                <h2 className='font-poppins text-[2.75vw] font-normal text-[#ffffff]'>Select Your Time Frame</h2>

                <div className="mb-5 w-full left-1/2">
                <TimeRangePicker onChange={handleTimeRangeChange} />
                </div>

                <div className="mt-2 px-4 w-full left-1/2">
                    <label className="flex items-center space-x-2 text-[#ffffff]">
                        <input type="checkbox" className="form-checkbox " />
                        <span className="px-2 text-l font-poppins">Or, limit Participants to your Availibilities</span>
                    </label>
                </div>  
                
                <div className='py-8 '>
                <Accordion title="Default Option" subtext="Participants are free to select their most convenient times" imageSrc={defaultimg} isActive={activeIndex===0} onToggle={() => handleToggle(0)}>
                </Accordion>
                <Accordion title="Minimum Time Slot" subtext="Participants must fulfill the minimum time slots designated by the Host" imageSrc={minimum} isActive={activeIndex===1} onToggle={() => handleToggle(1)}>
                    <MinRangeSlider onChange={handleTimeRangeChange} />
                </Accordion>
                </div>              

                <button className="relative bottom-0 left-1/2 -translate-x-1/2 bg-selective_yellow text-white font-normal font-poppins py-1 px-12 rounded-[50px] shadow-md w-auto cursor-pointer"
                onClick={handleGenerateSchedule}
                >
                    Generate Schedule
                </button>


            </div>
        </div>
    );
};


export default CreateMeeting;
