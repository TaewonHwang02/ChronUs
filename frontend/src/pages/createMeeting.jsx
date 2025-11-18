import React, { useState, useEffect } from "react";
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

const convertToUTC = (dateStr, timeZone) => {
  const localDate = new Date(dateStr);
  // Interpret local date in the given time
  const tzDate = new Date(
    new Date(localDate.toLocaleString("en-US", { timeZone })).getTime()
  );
  return tzDate;
};

const CreateMeeting = () => {
  const location = useLocation();

  const [copied, setCopied] = useState(false);

  const meetingName = location.state?.meetingName || "Untitled Meeting";

  const [meetingLink, setMeetingLink] = useState(null);
  const [meetingId, setMeetingId] = useState(null); // store MongoDB _id

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
  });
  const [email, setEmail] = useState("");
  const [emailDateRaw, setEmailDateRaw] = useState(""); // input str
  const [emailDate, setEmailDate] = useState(null); // UTC date conv

  const [timeRange, setTimeRange] = useState({ start: 480, end: 1020 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [minimumTimeSlots, setMinimumTimeSlots] = useState(0);
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

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

  const handleDeadlineChange = (e) => {
    setEmailDateRaw(e.target.value); // store string
  };

  const handleTimezoneChange = (e) => {
    setTimeZone(e.target.value);
  };

  const handleGenerateSchedule = async () => {
    try {
      let utcDeadline;
      if (emailDateRaw) {
        utcDeadline = convertToUTC(emailDateRaw, timeZone);
      } else {
        utcDeadline = new Date();
      }

      const meetingData = {
        scheduleMode: activeIndex === 0 ? "common_time" : "common_date",
        timeZone,
        begTimeFrame: timeRange.start,
        endTimeFrame: timeRange.end,
        startdate: dateRange.startDate,
        enddate: dateRange.endDate,
        deadline: utcDeadline.toISOString(),
        meetingName,
        minimumTimeSlots: activeIndex === 1 ? minimumTimeSlots : 0,
        email,
      };

      let response;
      if (meetingId) {
        // Update existing meeting
        response = await axios.put(
          `${API_BASE_URL}/api/meetings/${meetingId}`,
          meetingData
        );
      } else {
        // Create new meeting
        response = await axios.post(
          `${API_BASE_URL}/api/meetings/create-meeting`,
          meetingData
        );
        setMeetingId(response.data.meeting._id); // store the _id for future updates
      }

      setMeetingLink(response.data.meetingLink);
      console.log("Meeting saved/updated:", response.data);
    } catch (error) {
      console.error(
        "Error creating/updating meeting:",
        error.response?.data || error.message
      );
      alert("Failed to save the meeting. Please try again.");
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
    lg:py-0
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

        <div className=" w-full left-1/2 space-y-2">
          <label className="flex items-center space-x-1 text-primary_letter">
            <span className="text-[12px] lg:text-base font-poppins">
              Deadline:
            </span>

            <input
              type="datetime-local"
              id="email-date"
              name="email-date"
              className="font-poppins bg-primary w-[110px] lg:w-[140px] h-8 text-sm lg:text-base text-white rounded-md px-2 py-1 focus:outline-none focus:ring-0 focus:border-transparent"
              onChange={handleDeadlineChange}
            />

            <select
              value={timeZone}
              onChange={handleTimezoneChange}
              className="ml-2 w-16 lg:w-28 bg-primary rounded-md font-poppins text-xs focus:outline-none text-white border-gray-300"
            >
              <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                {`${Intl.DateTimeFormat().resolvedOptions().timeZone}`}
              </option>

              <option value="America/Toronto">America/Toronto (EST)</option>
              <option value="America/Chicago">America/Chicago (CST)</option>
              <option value="America/Denver">America/Denver (MST)</option>
              <option value="America/Vancouver">America/Vancouver (PST)</option>
              <option value="Asia/Seoul">Korea Standard Time (KST)</option>
              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>

              {/* <optgroup label="🇬🇧 Europe">
                <option value="Europe/London">United Kingdom (GMT/BST)</option>
                <option value="Europe/Paris">Central Europe (CET)</option>
                <option value="Europe/Moscow">Moscow (MSK)</option>
              </optgroup>

              <optgroup label="🇦🇺 Australia / 🇳🇿 New Zealand">
                <option value="Australia/Sydney">Sydney (AEST)</option>
                <option value="Pacific/Auckland">Auckland (NZST)</option>
              </optgroup> */}

              <option value="UTC">UTC</option>
            </select>
          </label>

          <div className="flex justify-left items-center">
            <span className="text-[12px] lg:text-base font-poppins text-white mr-2">
              Email address
            </span>
            <input
              type="email"
              className="bg-secondary rounded-md px-2 py-1 font-poppins text-xs"
              placeholder="Enter Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="snap-start flex flex-col justify-center p-[25px] lg:p-0 w-full lg:w-2/5 min-h-screen lg:min-h-0 space-y-4">
        <div>
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
            <div className="flex flex-row  items-center mt-4 py-2 space-x-2 text-xs">
              <input
                type="text"
                readOnly
                // Changed chronus to window.location.origin to test in localhost.
                // 
                value={`${window.location.origin}/join/${meetingLink}`}
                className="font-poppins bg-secondary text-secondary_letter opacity-70 w-3/4 p-2 rounded-md text-center"
              />
              <button
                className="bg-tertiary !border-none text-white font-poppins py-1 px-6 rounded-full shadow-lg transition"
                onClick={() => {
                  const url = `${window.location.origin}/join/${meetingLink}`;
                  navigator.clipboard.writeText(url);
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
