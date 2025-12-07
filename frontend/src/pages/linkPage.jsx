import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import registerLogo from "../assets/logo.svg";
import axios from "axios";
import GridOverlapDisplay from "../components/GridOverlapDisplay";
import { API_BASE_URL } from "../config";
import linkpage_background from "../assets/bg-light-linkpage.svg";
import landingLogo from "../assets/logo.svg";
import { DateRange } from "react-date-range";

// const convertToDate = (dateString) => {
//   const year = parseInt(dateString.slice(0, 4), 10);
//   const month = parseInt(dateString.slice(4, 6), 10) - 1;
//   const day = parseInt(dateString.slice(6, 8), 10);
//   return new Date(year, month, day);
// };

// const convertToTimeString = (time) => {
//   const [hours, minutes] = time.split(":");
//   return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
// };

const LinkPage = () => {
  const [meetingName, setMeetingName] = useState("");
  const { meetingLink } = useParams(); // Get meeting link from URL params
  const [dates, setDates] = useState([new Date()]);
  const [aggregatedTimes, setAggregatedTimes] = useState([]);
  const [minTime, setMinTime] = useState(9);
  const [maxTime, setMaxTime] = useState(18);
  const [minimumTimeSlots, setMinimumTimeSlots] = useState(0); // store required minutes
  const [participantName, setParticipantName] = useState("");
  const location = useLocation();
  const user = location.state?.user || {};

  // Date range
  const [dateRange, setDateRange] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching meeting data for:", meetingLink); // Debugging
    const fetchMeetingData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/meetings/${meetingLink}`
        );
        const meeting = response.data.meeting;

        console.log("Meeting data:", meeting); // Debugging: check meeting data

        setMinTime(meeting.begTimeFrame / 60);
        setMaxTime(meeting.endTimeFrame / 60);

        const startDate = new Date(meeting.startdate);
        const endDate = new Date(meeting.enddate);
        const dateArray = [];
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          dateArray.push(new Date(d));
        }
        setDates(dateArray);

        setMeetingName(meeting.meetingName || "Meeting");

        // Logic for date range
        const start = new Date(meeting.startdate);
        const end = new Date(meeting.enddate);

        // Keeping only Month/ Date format to keep it short
        const startFormatted = start.toLocaleDateString("en-US", {
          month: "long",   
          day: "numeric",   
        });

        const endFormatted = end.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });
        setDateRange(`${startFormatted} - ${endFormatted}`);




        // Store minimum required minutes
        setMinimumTimeSlots(meeting.minimumTimeSlots || 0);

        const allParticipantsTimes = meeting.participants.flatMap(
          (p) => p.times
        );
        const formattedTimes = allParticipantsTimes.map((timeSlot) => {
          const slotDate = convertToDate(timeSlot.date);
          const dayIndex = dateArray.findIndex(
            (d) => d.toDateString() === slotDate.toDateString()
          );

          return {
            day: dayIndex,
            date: timeSlot.date,
            minTime: convertToTimeString(timeSlot.minTime),
            maxTime: convertToTimeString(timeSlot.maxTime),
          };
        });

        setAggregatedTimes(formattedTimes);
      } catch (error) {
        console.error(
          "Error fetching meeting data:",
          error.response?.data || error.message
        );
        setAggregatedTimes([]);
      }
    };

    fetchMeetingData();
  }, [meetingLink]);



  const handleJoinMeeting = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/meetings/join-meeting`,
        {
          meetingLink,
          participantName,
          times: [], // No times selected initially
        }
      );

      console.log("Response from backend:", response.data);
      alert("Successfully joined the meeting!");
      navigate(`/schedulingpage/${meetingLink}`, {
        state: { meetingLink, participantName },
      });
    } catch (error) {
      console.error(
        "Error joining meeting:",
        error.response?.data || error.message
      );
      alert("Failed to join the meeting. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background SVG */}
      <img
        src={linkpage_background}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
    <div className="w-full max-w-md flex flex-col items-center">

      {/* Logo */}
      <img src={landingLogo} className="w-[54px] absolute top-12 -translate-x-1/2  z-30"/>

      {/* Meeting Name */}
       {/* Title */}
        <h1 className="font-poppins font-semibold text-3xl text-black text-center">
          Join {meetingName || "Project Meeting"}
        </h1>

        {/* Date range */}
        {dateRange && (
          <p className="mt-3 text-base text-black font-poppins text-center">
            {dateRange}
          </p>
        )}

      {/* Enter participant name */}
      <div className="mt-8 w-full space-y-4 flex flex-col items-center">
          <input
            type="text"
            placeholder="Name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="w-72 h-10 px-4 rounded-2xl bg-[#EEF1F5] text-sm font-poppins text-[#6F7C8E] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] outline-none placeholder:text-[#6F7C8E]"
          />
        </div>

        {/* Enter button */}
        <button
  
          onClick={handleJoinMeeting}
          className="mt-8 px-14 py-2 rounded-full bg-[#DCA414] hover:bg-[#E3A23A] text-white text-sm font-poppins border-none"
        >
          Enter
        </button>
    </div>

    </div>

      

  );
};

export default LinkPage;
