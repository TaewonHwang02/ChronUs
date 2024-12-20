import React, { useState } from 'react';
import { Link,useNavigate,useLocation,useParams } from 'react-router-dom';
import registerLogo from "../assets/WhiteLogo.svg"; // Header logo
import { DraggableSelector } from "react-draggable-selector";
import axios from "axios"

const LinkPage = () => {
    const {meetingLink} = useParams();
    const [dates, setDates] = useState([new Date()]); 
    const [times, setTimes] = useState([]);
    const user = location.state?.user || {}; 
    const [participantName, setParticipantName] = useState("")
    const navigate = useNavigate();

    const handleJoinMeeting = async () => {
        
        try {
            const response = await axios.post("http://localhost:5001/api/meetings/join-meeting", {
                meetingLink,
                participantName,
                times,
            });

            console.log("Response from backend:", response.data);
            alert("Successfully joined the meeting!");
            console.log(participantName)
            navigate(`/schedulingmain/${meetingLink}`, {
                state: { meetingLink, participantName },
            });
        } catch (error) {
            console.error("Error joining meeting:", error.response?.data || error.message);
            alert("Failed to join the meeting. Please try again.");
        }
    };


    
    return (
        <div>
            <div className="absolute w-full h-[84%] bg-steel_blue rounded-br-[600px] z-[-1]"></div>
        <div className='p-0 ph:p-[100px] tb:p-0'>
            {/* Background Ellipse */}
            

            <div className='flex flex-col flex-col tb:flex-row tb:items-center translate-y-[40px] tb:translate-y-[5%]'>
                {/* time Box */}
                <div className="order-2 tb:order-1 mx-[10px] tb:mx-auto tb:ml-[8%] tb:my-[8%] mt-[30px] transform bg-white p-4 rounded-lg shadow-md tb:w-[33%] flex items-center justify-center ">
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
                
                {/* Right-Side */}
                <div className="order-1 tb:order-2 flex flex-col space-y-[40px] tb:space-y-[10vh] flex-1 translate-y-[-7%]">
                    <div className='space-y-[5vh]'>
                        {/* Logo */}
                        <div className="flex justify-center">
                            <img src={registerLogo} alt="ChronUs Logo" className="h-auto w-28" />
                        </div>
                        {/* Register Heading */}
                        <h1 className="font-poppins font-semibold text-[25px] tb:text-[3vw] text-white text-center">
                            Join {user.name || "User"}'s ChronUs
                        </h1>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-5">
                        {/* Full Name */}
                        <div className="flex flex-col items-start justify-center ">
                            <label
                            htmlFor="name"
                            className="font-poppins font-normal tb:text-[0.95vw] text-white"
                            >
                            Full Name
                            </label>
                            <input
                            type="text"
                            id="name"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            className="bg-[#FBFBFB] shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md p-2 w-72 h-8"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="flex flex-col items-start justify-center ">
                            <label
                            htmlFor="password"
                            className="font-poppins font-normal tb:text-[0.95vw] text-white"
                            >
                            Password
                            </label>
                            <input
                            type="text"
                            id="password"
                            value=""
                            onChange=""
                            className="bg-[#FBFBFB] shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md p-2 w-72 h-8"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col items-center justify-center">
                        {/* Register Button */}
                        <button
                            className="justify-center h-[25px] tb:h-auto w-[60px] tb:w-[6vw] bg-selective_yellow shadow rounded-2xl tb:text-[1.5vw] font-poppins font-normal text-white"
                            onClick={handleJoinMeeting}
                        >
                            Go!
                        </button>
                    </div>

                </div>
            </div>
        </div>
        </div>
    );
};

export default LinkPage;