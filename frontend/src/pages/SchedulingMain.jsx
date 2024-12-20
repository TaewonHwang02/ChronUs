import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import registerLogo from "../assets/WhiteLogo.svg";
import { DraggableSelector } from "react-draggable-selector";
import ButtonBlue from '../components/ButtonBlue';
import axios from "axios";
// Import the new GridOverlapDisplay component
import GridOverlapDisplay from '../components/GridOverlapDisplay';

// Converts "YYYYMMDD" string to Date object
const convertToDate = (dateString) => {
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1;
    const day = parseInt(dateString.slice(6, 8), 10);
    return new Date(year, month, day);
};

// Ensures time in "HH:mm" format
const convertToTimeString = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const SchedulingMainPage = () => {
    const [dates, setDates] = useState([new Date()]);
    const [times, setTimes] = useState([]);
    const [aggregatedTimes, setAggregatedTimes] = useState([]);
    const [minTime, setMinTime] = useState(9);
    const [maxTime, setMaxTime] = useState(18);

    const location = useLocation();
    const user = location.state?.user || {};
    const participant = location.state?.participantName;
    const { meetingLink } = useParams();

    useEffect(() => {
        console.log("Current selected times:", times);
    }, [times]);

    useEffect(() => {
        const fetchMeetingData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/meetings/${meetingLink}`);
                const meeting = response.data.meeting;

                // Convert timeframe from minutes to hours
                setMinTime(meeting.begTimeFrame / 60);
                setMaxTime(meeting.endTimeFrame / 60);

                // Create a date array from startdate to enddate (inclusive)
                const startDate = new Date(meeting.startdate);
                const endDate = new Date(meeting.enddate);
                const dateArray = [];
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    dateArray.push(new Date(d));
                }
                setDates(dateArray);

                // Extract participant times
                const allParticipantsTimes = meeting.participants.flatMap((p) => p.times);

                // Format times for GridOverlapDisplay
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

                console.log("Formatted Time Slots (aggregatedTimes):", formattedTimes);
                setAggregatedTimes(formattedTimes);
            } catch (error) {
                console.error("Error fetching meeting data:", error.response?.data || error.message);
                setAggregatedTimes([]);
            }
        };

        fetchMeetingData();
    }, [meetingLink]);

    const handleTimeSlotSelection = (newTimeSlots) => {
        console.log("User selected the following time slots:", newTimeSlots);
        setTimes(newTimeSlots);
    };

    const submitTimeSlots = async () => {
        if (times.length === 0) {
            alert("Please select time slots before submitting");
            return;
        }

        try {
            const formattedTimes = times.map(timeSlot => ({
                ...timeSlot,
                minTime: convertToTimeString(timeSlot.minTime),
                maxTime: convertToTimeString(timeSlot.maxTime)
            }));

            console.log("Submitting selected time slots:", formattedTimes);
            const response = await axios.post(
                `http://localhost:5001/api/meetings/${meetingLink}/select-time`,
                {
                    participantName: participant || user?.name,
                    selectedTimeSlots: formattedTimes,
                }
            );

            if (response.status === 200) {
                alert("Time slots submitted successfully!");

                const updatedMeetingResponse = await axios.get(
                    `http://localhost:5001/api/meetings/${meetingLink}`
                );
                const updatedMeeting = updatedMeetingResponse.data.meeting;
                const allParticipantsTimes = updatedMeeting.participants.flatMap((p) => p.times);

                console.log("Updated aggregated participant times:", allParticipantsTimes);
                const newAggregatedTimes = allParticipantsTimes.map(timeSlot => {
                    const slotDate = convertToDate(timeSlot.date);
                    const dayIndex = dates.findIndex(d => d.toDateString() === slotDate.toDateString());

                    return {
                        day: dayIndex,
                        date: timeSlot.date,
                        minTime: convertToTimeString(timeSlot.minTime),
                        maxTime: convertToTimeString(timeSlot.maxTime)
                    };
                });

                setAggregatedTimes(newAggregatedTimes);
                setTimes(formattedTimes);
            }
        } catch (error) {
            console.error("Error submitting time slots:", error.response?.data || error.message);
            alert("Failed to submit time slots. Please try again.");
        }
    };

    console.log("Aggregated Times before passing to GridOverlapDisplay:", aggregatedTimes);

    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">
            <div className="absolute w-[95%] h-[422.6px] bg-selective_yellow rounded-br-[700px]"></div>

            <div className="absolute top-[10%] right-[47.5%]">
                <img src={registerLogo} alt="ChronUs Logo" className="w-20 h-20" />
            </div>

            <h1 className="absolute w-full top-[20%] left-[1%] font-kulim font-semibold text-[2vw] leading-[3vw] text-white text-center">
                Welcome {participant || user?.name}, Select Your Time Slots
            </h1>

            <div className="absolute top-[30%] left-[5%] w-[90%] grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side: Grid Overlap Display */}
                <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto">
                    {/* Replace OverlapTimeSlotsDisplay with GridOverlapDisplay */}
                    <GridOverlapDisplay timeSlots={aggregatedTimes} timeUnit={30} />
                </div>

                {/* Right side: User time selection */}
                <div className="bg-white p-4 rounded-lg shadow-md relative w-full max-w-sm mx-auto">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <ButtonBlue text="Reset Times" onClick={() => setTimes([])} />
                    </div>
                    <DraggableSelector
                        minTime={minTime}
                        maxTime={maxTime}
                        dates={dates}
                        timeSlots={times}
                        setTimeSlots={handleTimeSlotSelection}
                        slotHeight={15}
                        slotWidth={55}
                        mode="date"
                        timeUnit={30}
                        dateFormat="M.D"
                        timeFormat="HH:mm A"
                    />
                    <div className="absolute py-5 left-1/2 transform -translate-x-1/2">
                        <ButtonBlue text="Submit" onClick={submitTimeSlots} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulingMainPage;
