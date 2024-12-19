import React, { useState,useEffect } from 'react';
import { Link, useLocation,useParams } from 'react-router-dom';
import registerLogo from "../assets/WhiteLogo.svg"; 
import { DraggableSelector } from "react-draggable-selector";
import ButtonBlue from '../components/ButtonBlue';
import axios from "axios"


const SchedulingMainPage = () => {
    const [dates, setDates] = useState([new Date()]); 
    const [times, setTimes] = useState([]);
    const location = useLocation();
    const user = location.state?.user || {};  
    const participant = location.state?.participantName;
    const [meetingData, setMeetingData] = useState(null)
    console.log(participant)
    const { meetingLink } = useParams();
    useEffect(() => {
        const fetchMeetingData = async () => {
          try {
            const response = await axios.get(`http://localhost:5001/api/meetings/${meetingLink}`);
            const meeting = response.data.meeting;
    
            setMeetingData(meeting);
    
            // Generate all dates in the range
            const startDate = new Date(meeting.startdate);
            const endDate = new Date(meeting.enddate);
            const dateArray = [];
    
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
              dateArray.push(new Date(d)); 
            }
    
            setDates(dateArray);
          } catch (error) {
            console.error("Error fetching meeting data:", error.response?.data || error.message);
          }
        };
    
        fetchMeetingData();
      }, [meetingLink]);


    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">

            {/* Background Ellipse */}
            <div className="absolute w-[95%] h-[422.6px] bg-selective_yellow rounded-br-[700px]"></div>

            {/* Logo */}
            <div className="absolute top-[10%] right-[47.5%]">
                <img src={registerLogo} alt="ChronUs Logo" className="w-20 h-20" />
            </div>
            {/* Background Ellipse */}
            <div className="absolute w-[95%] h-[422.6px] bg-selective_yellow rounded-br-[700px]"></div>

            {/* Logo */}
            <div className="absolute top-[10%] right-[47.5%]">
                <img src={registerLogo} alt="ChronUs Logo" className="w-20 h-20" />
            </div>


            {/* Title */}
            <h1 className="absolute w-full h-full top-[20%] left-[1%] font-kulim font-semibold text-[2vw] leading-[3vw] text-white text-center">
                Welcome {participant|| location.state?.user?.name}, Select Your Time Slots
            </h1>

            {/* Draggable Selector */}
            <div className="absolute top-[30%] left-[5%] w-[90%] flex justify-between">

            {/* Left Draggable Selector */}
            <div className="w-[40%] bg-white p-4 rounded-lg shadow-md">
                <DraggableSelector
                    minTime={8}               // Start time
                    maxTime={19}              // End time 
                    dates={dates}             
                    timeSlots={times}         
                    setTimeSlots={setTimes}  
                    slotHeight={18}
                    slotWidth={55} 
                    mode = {"date"}
            
                />
            </div>

            {/* Right Draggable Selector */}
            <div className="w-[40%] bg-white p-4 rounded-lg shadow-md relative">
                {/* Centered Button */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <ButtonBlue text="Reset Times" />
                </div>
                <DraggableSelector
                    minTime={8}               // Start time
                    maxTime={19}              // End time 
                    dates={dates}             
                    timeSlots={times}         
                    setTimeSlots={setTimes}   
                    slotHeight={18}
                    slotWidth={55} 
                    mode={"date"}
               
                />
            </div>
            </div>




    
    </div>

    );
};
export default SchedulingMainPage