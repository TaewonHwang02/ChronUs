import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays } from 'date-fns';
import { getAuth } from "firebase/auth";
import axios from "axios";
import LoginLogo from '../assets/Group 76.svg';
import returnArr from '../assets/returnArrow.svg';
import minimum from '../assets/defaultOp.svg';
import defaultimg from '../assets/minTime.svg';
import TimeRangePicker from '../components/timeRangePicker';
import Accordion from '../components/accordionOptions';
import MinRangeSlider from '../components/minTimeRange';
import DatePicker from '../components/datePicker';

const CreateMeeting = () => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 3),
    });

    const [emailOption, setEmailOption] = useState(false);
    const [HostTime, setHostTime] = useState(false);
    const [timeRange, setTimeRange] = useState({ start: 480, end: 1020 });
    const [activeIndex, setActiveIndex] = useState(null);
    const [emailDate, setEmailDate] = useState(null);
    const [minimumTimeSlots, setMinimumTimeSlots] = useState(0);
    const navigate = useNavigate();

    const handleDateChange = (selectedDates) => {
        setDateRange({
            startDate: selectedDates.startDate,
            endDate: selectedDates.endDate,
        });
    };

    const handleTimeRangeChange = (range) => {
        const convertedRange = {
            start: range.min * 60, // Convert hours to minutes
            end: range.max * 60, // Convert hours to minutes
        };
        setTimeRange(convertedRange);
    };

    const handleToggle = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
 
    const handleMinTimeSlotsChange = (value) => {
        console.log("MinRangeSlider value:", value);
        setMinimumTimeSlots(value);
    };

    const handleGenerateSchedule = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User is not authenticated");
            }
    
            // Fetch Firebase token
            const token = await user.getIdToken();
            console.log("Firebase Token:", token); // Debugging: Ensure token is retrieved

    
            // Prepare meeting data
            const meetingData = {
                userID: user.uid,
                scheduleMode: activeIndex === 0 ? "common_time" : "common_date",
                timeZone: "UTC",
                begTimeFrame: timeRange.start,
                endTimeFrame: timeRange.end,
                startdate: dateRange.startDate,
                enddate: dateRange.endDate,
                deadline: new Date(), 
                meetingName: "Meeting",
                emailOption,
                emailDate,
                //participants: ["user1@example.com", "user2@example.com"], // Replace with actual participants
            };
            console.log("ActiveIndex before sending:", activeIndex);
            console.log("Current minimumTimeSlots value:", minimumTimeSlots);
            if (activeIndex === 1) {
                meetingData.minimumTimeSlots = minimumTimeSlots;
            }
            console.log("MinimumTimeSlots before sending:", meetingData.minimumTimeSlots);

    
            // Make the POST request
            const response = await axios.post("http://localhost:5001/api/meetings/create-meeting", meetingData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass Firebase token
                },
            });
    
            console.log("Raw response from backend:", response.data);
            const { meeting, meetingLink } = response.data; // Correct destructuring
    
            console.log("State being passed to navigate:", { meetingID: meeting, meetingLink });
    
            // Navigate to the link retrieval page
            navigate("/linkretrieval", {
                state: { meetingID: meeting, meetingLink },
            });
        } catch (error) {
            console.error("Error creating meeting:", error.response?.data || error.message);
            alert("Failed to create the meeting. Please try again.");
        }
    };
    
    
    

   

    return (
        <div className="overflow-auto w-full h-screen bg-steel_blue flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-1 space-y-[70px] lg:space-y-0">
            <div className="space-y-[20px] lg:space-y-2 p-[25px] lg:p-0 w-full h-full lg:w-2/5 lg:h-4/5">
                <img src={LoginLogo} alt="ChronUs Logo" className="w-20 h-35" />
                <div
                    className="relative w-2/3 mt-4 font-poppins text-white text-xs flex items-center space-x-2 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                >
                    <img src={returnArr} alt="return" className=" w-3 h-3" />
                    <span>Back to Dashboard</span>
                </div>
                <h1 className="py-2 font-poppins text-3xl lg:text-[3vw] font-medium text-white">Set Your Dates</h1>
                <div className='flex items-center'>
                    <DatePicker onChange={handleDateChange}  />
                </div>
                
                <div className="px-3 w-full left-1/2">
                    <label className="flex items-center space-x-2 text-[#ffffff]">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={emailOption}
                            onChange={(e) => setEmailOption(e.target.checked)}
                        />
                        <span className="px-2 lg:text-sm text-xs lg:text-l font-poppins">
                            Receive an E-mail of curated dates/times
                        </span>
                    </label>

                    {emailOption && (
                        <div className="mt-2 space-y-0">
                            <div className="font-poppins text-[#ffffff]">
                                <label className="py-0 px-0 flex items-center space-x-2 text-[#ffffff] font-poppins text-xs">
                                <h2>Select date and time:</h2>
                                <input 
                                    type="datetime-local" 
                                    id="email-date"
                                    name="email-date"
                                    min="2024-12-19T08:30"
                                    className='font-poppins text-blue-950 w-3/5' 
                                    onChange={(e) => setEmailDate(e.target.value)}
                                    />                   
                                </label> 
                            </div>

                        </div>
                    )}

                </div>
            </div>
            <div className="flex flex-col lg:flex-none p-[25px] lg:p-0 w-full h-full lg:w-2/5 lg:h-4/5 space-y-[15px]">
                <h3 className="py-1 font-poppins text-[15px] lg:text-[1.3vw] font-normal text-[#98BCDA]">Advanced Options</h3>
                <h2 className="font-poppins text-[18px] lg:text-2xl font-normal text-[#ffffff]">Select Your Time Frame</h2>
                <div className=" mb-5 w-full left-1/2">
                    <TimeRangePicker onChange={handleTimeRangeChange} />
                </div>

                <div className="py-3">
                    <h2 className="py-2 font-poppins text-[15px] lg:text-2xl font-normal text-[#ffffff]">Select Your Scheduling Options</h2>
                    <Accordion
                        title="Default Option"
                        subtext="Participants are free to select their most convenient times"
                        imageSrc={defaultimg}
                        isActive={activeIndex === 0}
                        onToggle={() => handleToggle(0)}
                    />
                    <Accordion
                        title="Minimum Time Slot"
                        subtext="Participants must fulfill the minimum time slots designated by the Host"
                        imageSrc={minimum}
                        isActive={activeIndex === 1}
                        onToggle={() => handleToggle(1)}
                    >
                        <MinRangeSlider onChange={handleMinTimeSlotsChange} />
                    </Accordion>
                </div>

                <div className='flex justify-center'>
                    <button
                        className="mb-8 relative bg-selective_yellow text-white font-normal font-poppins py-1 px-12 rounded-[50px] shadow-lg w-auto cursor-pointer"
                        onClick={handleGenerateSchedule}
                    >
                        Generate Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateMeeting;
