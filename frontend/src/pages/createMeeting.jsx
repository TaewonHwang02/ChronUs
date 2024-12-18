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
    const [timeRange, setTimeRange] = useState({ start: 480, end: 1020 });
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

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
                deadline: new Date(), // Replace with actual deadline
                //participants: ["user1@example.com", "user2@example.com"], // Replace with actual participants
            };
    
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
    
    
    

    const handleDateChange = (selectedDates) => {
        setDateRange({
            startDate: selectedDates.startDate,
            endDate: selectedDates.endDate,
        });
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    const handleToggle = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    // const handleAddParticipant = () => {
    //     if (newParticipant && !participants.includes(newParticipant)) {
    //         setParticipants([...participants, newParticipant]);
    //         setNewParticipant("");
    //     }
    // };

    return (
        <div className="relative w-full h-screen bg-steel_blue flex items-center justify-center gap-1">
            <div className="w-2/5 h-4/5 relative">
                <img src={LoginLogo} alt="ChronUs Logo" className="w-20 h-35" />
                <div
                    className="relative w-2/3 mt-4 font-poppins text-white flex items-center space-x-2 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                >
                    <img src={returnArr} alt="return" className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </div>
                <h1 className="py-2 font-poppins text-[3vw] font-medium text-white">Set Your Dates</h1>
                <DatePicker onChange={handleDateChange} />
                <div className="mt-2 px-3 w-4/5 left-1/2">
                    <label className="flex items-center space-x-2 text-[#ffffff]">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={emailOption}
                            onChange={(e) => setEmailOption(e.target.checked)}
                        />
                        <span className="px-2 text-l font-poppins">
                            Receive an E-mail of curated dates/times upon the Deadline
                        </span>
                    </label>
                </div>
            </div>
            <div className="w-2/5 h-4/5">
                <h3 className="py-1 font-poppins text-[1.3vw] font-normal text-[#98BCDA]">Advanced Options</h3>
                <h2 className="font-poppins text-[2.75vw] font-normal text-[#ffffff]">Select Your Time Frame</h2>
                <div className="mb-5 w-full left-1/2">
                    <TimeRangePicker onChange={handleTimeRangeChange} />
                </div>
                <div className="py-8">
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
                        <MinRangeSlider onChange={handleTimeRangeChange} />
                    </Accordion>
                </div>
                <button
                    className="relative bottom-0 left-1/2 -translate-x-1/2 bg-selective_yellow text-white font-normal font-poppins py-1 px-12 rounded-[50px] shadow-md w-auto cursor-pointer"
                    onClick={handleGenerateSchedule}
                >
                    Generate Schedule
                </button>
            </div>
        </div>
    );
};

export default CreateMeeting;
