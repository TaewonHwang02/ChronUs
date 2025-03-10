// Wendy Kuang 261111975 (responsive design)
// Taewon Hwang 261013091
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import registerLogo from "../assets/WhiteLogo.svg";
import { DraggableSelector } from "react-draggable-selector";
import ButtonBlue from '../components/ButtonBlue.jsx';
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

const SchedulingMainPage = () => {
    const [dates, setDates] = useState([new Date()]);
    const [times, setTimes] = useState([]);
    const [aggregatedTimes, setAggregatedTimes] = useState([]);
    const [minTime, setMinTime] = useState(9);
    const [maxTime, setMaxTime] = useState(18);
    const [minimumTimeSlots, setMinimumTimeSlots] = useState(0); // store required minutes

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
                const response = await axios.get(`https://chronus-qrt1.onrender.com/api/meetings/${meetingLink}`);
                const meeting = response.data.meeting;

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

        // Calculate total selected minutes
        let totalSelectedMinutes = 0;
        for (const slot of times) {
            const [startH, startM] = slot.minTime.split(':').map(Number);
            const [endH, endM] = slot.maxTime.split(':').map(Number);
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;
            const duration = endTotal - startTotal;
            totalSelectedMinutes += duration;
        }

        // Check if participant meets the minimum minute requirement
        if (minimumTimeSlots > 0 && totalSelectedMinutes < minimumTimeSlots) {
            alert(`You must select at least ${minimumTimeSlots} minutes. You selected ${totalSelectedMinutes} minutes.`);
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
                `https://chronus-qrt1.onrender.com/api/meetings/${meetingLink}/select-time`,
                {
                    participantName: participant || user?.name,
                    selectedTimeSlots: formattedTimes,
                }
            );

            if (response.status === 200) {
                alert("Time slots submitted successfully!");

                const updatedMeetingResponse = await axios.get(
                    `https://chronus-qrt1.onrender.com/api/meetings/${meetingLink}`
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
        <div className="w-full h-full flex flex-col relative overflow-y-auto">
            <div className='fixed w-full h-full bg-grey_background z-[-3]'></div>
            <div className="absolute w-[95%] h-[422.6px] bg-selective_yellow rounded-br-[700px] z-[-2]"></div>

            {/* Logo + Heading */}
            <div className='flex flex-col mt-[4%] tb:mt-[5px]'>
                <div className="flex justify-center">
                    <img src={registerLogo} alt="ChronUs Logo" className="w-[80px] h-[80px]" />
                </div>
                <h1 className="font-kulim font-semibold text-[23px] tb:text-[3vw] leading-[4vw] text-white text-center">
                    Welcome {participant || user?.name}, Select Your Time Slots
                </h1>
            </div>

            
            {/* boxes */}
            <div className="flex flex-col tb:flex-row justify-center">
                {/* Left side: Grid Overlap Display */}
                <div className="m-[30px] ph:m-[20%] tb:m-[1%] bg-white p-[5px] tb:p-4 rounded-lg shadow-md tb:w-[30%]" >
                    <GridOverlapDisplay
                    startDate={dates[0]}
                    endDate={dates[dates.length - 1]}
                    startTime={convertToTimeString(minTime + ":00")}
                    endTime={convertToTimeString(maxTime + ":00")}
                    timeSlots={aggregatedTimes}
                    timeUnit={30}  // 30-minute increments
                    />
                </div>

                {/* Right side: User time selection */}
                <div className="m-[30px] ph:m-[20%] tb:m-[1%] flex flex-row justify-center bg-white p-4 px-[5%] rounded-lg shadow-md relative w-auto">
                    <div className="max-w-full overflow-x-auto">
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
                    </div>
                    <div className="absolute bottom-[-10%] tb:bottom-0 py-5 left-1/2 transform -translate-x-1/2">
                    <ButtonBlue text="Submit" onClick={submitTimeSlots} />
                    </div>
                </div>
            </div>



        </div>
    );
};

export default SchedulingMainPage;
