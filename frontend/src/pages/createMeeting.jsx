import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { addDays } from "date-fns";
import axios from "axios";
import LoginLogo from "../assets/logo.svg";
import minimum from "../assets/defaultOp.svg";
import defaultimg from "../assets/minTime.svg";
import TimeRangePicker from "../components/timeRangePicker";
import Accordion from "../components/accordionOptions";
import MinRangeSlider from "../components/minTimeRange";
import DatePicker from "../components/datePicker";
import { API_BASE_URL } from "../config";

const CreateMeeting = () => {
  const location = useLocation();

  const [copied, setCopied] = useState(false);

  const meetingName = location.state?.meetingName || "Untitled Meeting";

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
  });

  const [emailDate, setEmailDate] = useState(null);
  const [timeRange, setTimeRange] = useState({ start: 480, end: 1020 });
  const [activeIndex, setActiveIndex] = useState(null);
  const [minimumTimeSlots, setMinimumTimeSlots] = useState(0);
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [meetingLink, setMeetingLink] = useState(null);

  const handleDateChange = (selectedDates) => {
    setDateRange({
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
    });
  };

  const handleTimeRangeChange = (range) => {
    const convertedRange = {
      start: range.min * 60, // Hours to minutes
      end: range.max * 60,
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
      // Prepare meeting data to post to our schema
      const meetingData = {
        scheduleMode: activeIndex === 0 ? "common_time" : "common_date",
        timeZone,
        begTimeFrame: timeRange.start,
        endTimeFrame: timeRange.end,
        startdate: dateRange.startDate,
        enddate: dateRange.endDate,
        deadline: emailDate ? new Date(emailDate) : new Date(),
        meetingName,
        minimumTimeSlots: activeIndex === 1 ? minimumTimeSlots : 0,
      };
      console.log("ActiveIndex before sending:", activeIndex);
      console.log("Current minimumTimeSlots value:", minimumTimeSlots);

      if (activeIndex === 1) {
        meetingData.minimumTimeSlots = minimumTimeSlots;
      }
      console.log(
        "MinimumTimeSlots before sending:",
        meetingData.minimumTimeSlots
      );

      // Make POST request to load our meeting schema data onto mongoDB
      const response = await axios.post(
        `${API_BASE_URL}/api/meetings/create-meeting`,
        meetingData
      );

      console.log("Raw response from backend:", response.data);
      const { meeting, meetingLink } = response.data;

      setMeetingLink(meetingLink);
    } catch (error) {
      console.error(
        "Error creating meeting:",
        error.response?.data || error.message
      );
      alert("Failed to create the meeting. Please try again.");
    }
  };

  return (
    <div
      className="
    w-full 
    min-h-screen 
    bg-primary 
    flex 
    flex-col 
    lg:flex-row
    lg:items-center 
    lg:justify-center 
    lg:gap-8 
    scroll-smooth
    py-6
  "
    >
      {/* left panel */}
      <div className="snap-start flex flex-col justify-center space-y-4 lg:space-y-4 px-[25px] lg:px-0 w-full lg:w-2/5 min-h-screen lg:min-h-0">
        <img src={LoginLogo} alt="ChronUs Logo" className="w-11 py-4" />
        <h1 className="py-1 font-poppins text-[30px] lg:text-[3vw] font-medium text-primary_letter">
          Set Your Dates
        </h1>
        <div className="flex items-center p-0 m-0">
          <DatePicker onChange={handleDateChange} />
        </div>

        <div className="px-3 w-full left-1/2 space-y-2">
          <label className="flex items-center space-x-2 text-primary_letter">
            <span className="px-0 text-[15px] lg:text-sm font-poppins ">
              E-mail of curated sessions
            </span>
            {/* Time zone selector */}
            <div className="py-3">
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className=" w-40px rounded-md font-poppins text-xs focus:outline-none  text-black border-gray-300"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">EST</option>
                <option value="America/Chicago">CST</option>
                <option value="America/Denver">MST</option>
                <option value="America/Los_Angeles">PST</option>
              </select>
            </div>
          </label>
          <div className="mt-2">
            <label className="flex items-center space-x-2 text-primary_letter font-poppins text-xs">
              <h2>Select date and time:</h2>
              <input
                type="datetime-local"
                id="email-date"
                name="email-date"
                className="font-poppins text-blue-950 w-3/5 rounded-md px-2 py-1 focus:outline-none focus:ring-0 focus:border-transparent"
                onChange={(e) => setEmailDate(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="snap-start flex flex-col justify-center p-[25px] lg:p-0 w-full lg:w-2/5 min-h-screen lg:min-h-0 space-y-6">
        <div>
          <h3 className="py-1 font-poppins text-[15px] lg:text-[1.3vw] font-normal text-[#98BCDA]">
            Advanced Options
          </h3>
          <h2 className="font-poppins text-[18px] lg:text-2xl font-normal text-primary_letter">
            Select Your Time Frame
          </h2>
        </div>

        <div className="mb-5">
          <TimeRangePicker onChange={handleTimeRangeChange} />
        </div>

        <div className="py-3 space-y-3">
          <h2 className="font-poppins text-[15px] lg:text-2xl font-normal text-primary_letter">
            Select Your Scheduling Options
          </h2>
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

        <div className="flex justify-center pt-2 flex-col">
          <button
            className="bg-tertiary !border-none text-white font-poppins py-2 px-10 rounded-full shadow-lg w-auto cursor-pointer transition"
            onClick={handleGenerateSchedule}
          >
            Generate Schedule
          </button>

          {meetingLink && (
            <div className="flex flex-row items-center mt-4 py-2 space-x-2 text-xs">
              <input
                type="text"
                readOnly
                value={`https://chronus.blog/linkPage/${meetingLink}`}
                className="font-poppins w-3/4 p-2 rounded-md text-center"
              />
              <button
                className="bg-tertiary !border-none text-white font-poppins py-1 px-6 rounded-full shadow-lg transition"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://chronus.blog/linkPage/${meetingLink}`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 10000); // revert back after 10 seconds
                }}
              >
                {copied ? "Link Copied!" : "Copy Link"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMeeting;
