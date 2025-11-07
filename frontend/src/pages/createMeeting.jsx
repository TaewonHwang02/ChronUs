import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays } from "date-fns";
import { getAuth } from "firebase/auth";
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
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not authenticated");
      }

      //Firebase token to authenticate
      const token = await user.getIdToken();
      console.log("Firebase Token:", token);

      // Prepare meeting data to post to our schema
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
        meetingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Raw response from backend:", response.data);
      const { meeting, meetingLink } = response.data;
      console.log("State being passed to navigate:", {
        meetingID: meeting,
        meetingLink,
      });

      // Once all of the Posting complete, move to the link retrieval page
      navigate("/linkretrieval", {
        state: { meetingID: meeting, meetingLink },
      });
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
    overflow-y-scroll 
    snap-y 
    snap-mandatory 
    lg:overflow-hidden 
    lg:snap-none
    scroll-smooth
  "
    >
      {/* left panel */}
      <div className="snap-start flex flex-col justify-center space-y-4 lg:space-y-4 px-[25px] lg:px-0 w-full lg:w-2/5 h-screen lg:h-4/5">
        <img src={LoginLogo} alt="ChronUs Logo" className="w-12" />
        <h1 className="py-2 font-poppins text-[40px] lg:text-[3vw] font-medium text-primary_letter">
          Set Your Dates
        </h1>
        <div className="flex items-center">
          <DatePicker onChange={handleDateChange} />
        </div>

        <div className="px-3 w-full left-1/2 space-y-2">
          <label className="flex items-center space-x-2 text-primary_letter">
            <input
              type="checkbox"
              className="form-checkbox accent-selective_yellow"
              checked={emailOption}
              onChange={(e) => setEmailOption(e.target.checked)}
            />
            <span className="px-2 text-[15px] lg:text-sm font-poppins">
              Receive an E-mail of curated dates/times
            </span>
          </label>

          {emailOption && (
            <div className="mt-2">
              <label className="flex items-center space-x-2 text-primary_letter font-poppins text-xs">
                <h2>Select date and time:</h2>
                <input
                  type="datetime-local"
                  id="email-date"
                  name="email-date"
                  min="2024-12-19T08:30"
                  className="font-poppins text-blue-950 w-3/5 rounded-md px-2 py-1 focus:outline-none focus:ring-0 focus:border-transparent"
                  onChange={(e) => setEmailDate(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="snap-start flex flex-col justify-center p-[25px] lg:p-0 w-full lg:w-2/5 h-screen lg:h-4/5 space-y-6">
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

        <div className="flex justify-center pt-4">
          <button
            className="bg-selective_yellow text-white font-poppins py-2 px-12 rounded-full shadow-lg w-auto cursor-pointer hover:opacity-90 transition"
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
