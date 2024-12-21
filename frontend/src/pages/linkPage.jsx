// Wendy Kuang 261111975 (part of the responsive design)

import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import registerLogo from "../assets/WhiteLogo.svg";
import axios from "axios";
import GridOverlapDisplay from '../components/GridOverlapDisplay';

const convertToDate = (dateString) => {
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1;
    const day = parseInt(dateString.slice(6, 8), 10);
    return new Date(year, month, day);
};

const convertToTimeString = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const LinkPage = () => {
    const { meetingLink } = useParams();  // Get meeting link from URL params
    const [dates, setDates] = useState([new Date()]);
    const [aggregatedTimes, setAggregatedTimes] = useState([]);
    const [minTime, setMinTime] = useState(9);
    const [maxTime, setMaxTime] = useState(18);
    const [minimumTimeSlots, setMinimumTimeSlots] = useState(0); // store required minutes
    const [participantName, setParticipantName] = useState("");
    const location = useLocation();
    const user = location.state?.user || {}; 
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetching meeting data for:", meetingLink);  // Debugging
        const fetchMeetingData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/meetings/${meetingLink}`);
                const meeting = response.data.meeting;

                console.log("Meeting data:", meeting); // Debugging: check meeting data

                setMinTime(meeting.begTimeFrame / 60);
                setMaxTime(meeting.endTimeFrame / 60);

                const startDate = new Date(meeting.startdate);
                const endDate = new Date(meeting.enddate);
                const dateArray = [];
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    dateArray.push(new Date(d));
                }
                setDates(dateArray);

                // Store minimum required minutes
                setMinimumTimeSlots(meeting.minimumTimeSlots || 0);

                const allParticipantsTimes = meeting.participants.flatMap((p) => p.times);
                const formattedTimes = allParticipantsTimes.map((timeSlot) => {
                    const slotDate = convertToDate(timeSlot.date);
                    const dayIndex = dateArray.findIndex(d => d.toDateString() === slotDate.toDateString());

                    return {
                        day: dayIndex,
                        date: timeSlot.date,
                        minTime: convertToTimeString(timeSlot.minTime),
                        maxTime: convertToTimeString(timeSlot.maxTime),
                    };
                });

                setAggregatedTimes(formattedTimes);
            } catch (error) {
                console.error("Error fetching meeting data:", error.response?.data || error.message);
                setAggregatedTimes([]);
            }
        };

        fetchMeetingData();
    }, [meetingLink]);

    const handleJoinMeeting = async () => {
        try {
            const response = await axios.post("http://localhost:5001/api/meetings/join-meeting", {
                meetingLink,
                participantName,
                times: [],  // No times selected initially
            });

            console.log("Response from backend:", response.data);
            alert("Successfully joined the meeting!");
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
                <div className='flex flex-col tb:flex-row tb:items-center translate-y-[40px] tb:translate-y-[5%]'>
                    {/* Left side: Grid Overlap Display */}
                    <div className="order-2 tb:order-1 mx-[30px] tb:mx-auto tb:ml-[8%] tb:my-[8%] mt-[30px] transform bg-white p-4 rounded-lg shadow-md tb:w-[33%] flex items-center justify-center">
                    <div className="  rounded-lg shadow-md w-full md:w-3/4" >
                    <GridOverlapDisplay
                    startDate={dates[0]}
                    endDate={dates[dates.length - 1]}
                    startTime={convertToTimeString(minTime + ":00")}
                    endTime={convertToTimeString(maxTime + ":00")}
                    timeSlots={aggregatedTimes}
                    timeUnit={30}  // 30-minute increments
                    />
                </div>
                    </div>
                    
                    {/* Right side: Meeting Info */}
                    <div className="order-1 tb:order-2 flex flex-col space-y-[40px] tb:space-y-[10vh] flex-1 translate-y-[-7%]">
                        <div className='space-y-[5vh]'>
                            <div className="flex justify-center">
                                <img src={registerLogo} alt="ChronUs Logo" className="h-24 w-auto" />
                            </div>
                            <h1 className="font-poppins font-semibold text-[25px] tb:text-[3vw] text-white text-center">
                                Join {user.name || "User"}'s ChronUs
                            </h1>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center space-y-5">
                            <div className="flex flex-col items-start justify-center ">
                                <label
                                    htmlFor="name"
                                    className="font-poppins font-normal mb-2 tb:text-[1vw] text-white"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={participantName}
                                    onChange={(e) => setParticipantName(e.target.value)}
                                    className="font-poppins bg-[#FBFBFB] shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md p-2 w-72 h-8"
                                />
                            </div>

                          
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <button
                                className="justify-center h-[25px] p-1 tb:h-auto w-[60px] tb:w-[6vw] bg-selective_yellow shadow rounded-2xl tb:text-[1.3vw] font-poppins font-normal text-white"
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
