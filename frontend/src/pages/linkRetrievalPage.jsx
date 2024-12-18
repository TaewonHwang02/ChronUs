import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonBlue from '../components/ButtonBlue';
import { DraggableSelector } from 'react-draggable-selector';

const LinkRetrievalPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve state from navigation
    const { meetingID, meetingLink } = location.state || {};
    const [dates, setDates] = useState([new Date()]);
    const [times, setTimes] = useState([]);
    const [inputMeetingName, setInputMeetingName] = useState("");
    const [error, setError] = useState("");

    // Validate state
    useEffect(() => {
        if (!meetingID || !meetingLink) {
            setError("Meeting details are missing. Please return to the previous page.");
        }
    }, [meetingID, meetingLink]);

    // Handle finalizing the meeting
    const handleFinalizeMeeting = () => {
        if (!inputMeetingName) {
            alert("Please provide a meeting name.");
            return;
        }

        // Mock finalization logic
        alert(`Meeting "${inputMeetingName}" finalized! Link copied to clipboard.`);
        navigator.clipboard.writeText(`http://localhost:5173/join/${meetingLink}`);
        navigate("/dashboard");
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">
            {/* Background Ellipse */}
            <div className="absolute w-full h-[84%] bg-selective_yellow rounded-br-[600px]"></div>

            {/* ChronUs Text */}
            <div className="absolute top-[25%] left-[47%] transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                <h4 className="text-4xl font-poppins font-semibold mb-2">Thank you for choosing</h4>
                <h3 className="text-6xl font-kulim font-semibold">
                    <span className="text-white">Chron</span>
                    <span className="text-steel_blue text-7xl">u</span>
                    <span className="text-steel_blue">s</span>
                </h3>
            </div>

            {/* Deadline and Information */}
            <div className="absolute top-1/2 left-[58%] transform -translate-x-1/2 -translate-y-1/2 text-white">
                <h3 className="text-3xl font-poppins mb-2">You will be notified of the most</h3>
                <h3 className="text-3xl font-poppins mb-8">optimal time slots upon</h3>
                <h3 className="text-3xl font-poppins mb-2">
                    Deadline
                </h3>
            </div>

            {/* Meeting Link Section */}
            <div className="absolute top-[65%] left-[62%] transform -translate-x-1/2 flex items-center justify-between space-x-4 w-[40%] h-16">
                {/* Meeting Name Input */}
                <input
                    type="text"
                
                    value={inputMeetingName}
                    onChange={(e) => setInputMeetingName(e.target.value)}
                    className="flex-grow p-2 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-steel_blue"
                />
                {/* Blue Button Finalizes Meeting */}
                <ButtonBlue text="Submit and Retrieve Link" onClick={handleFinalizeMeeting} />
            </div>

            {/* Time Selector */}
            <div className="absolute bottom-[10%] left-[20%] transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-md w-[33%] h-auto flex items-center justify-center">
                <DraggableSelector
                    minTime={8}
                    maxTime={19}
                    dates={dates}
                    timeSlots={times}
                    setTimeSlots={setTimes}
                    slotHeight={15}
                    slotWidth={50}
                    slotsMarginTop={5}
                    slotsMarginLeft={5}
                />
            </div>
        </div>
    );
};

export default LinkRetrievalPage;
