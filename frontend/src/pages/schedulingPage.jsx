import React, { useState, useEffect } from "react";
import TimeSelector from "../components/TimeSelector";
import SchedulingLogo from "../assets/BlueLogo.svg";
import landingLogo from "../assets/logo.svg";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

// convert minutes → "HH:MM"
const minutesToTime = (m) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(
    2,
    "0"
  )}`;

const SchedulingPage = () => {
  const { meetingLink } = useParams();
  const location = useLocation();
  const participantName = location.state?.participantName;

  const [meeting, setMeeting] = useState(null);
  const [groupSlots, setGroupSlots] = useState([]);      // all participants
  const [initialSelected, setInitialSelected] = useState([]); // this participant

  // ---- fetchMeeting defined ONCE, used by both useEffect & handleSubmit ----
  const fetchMeeting = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/meetings/${meetingLink}`
      );
      const data = res.data.meeting;

      // config for TimeSelector
      const slotMinutes = 30; // or data.slotMinutes if you store it
      setMeeting({
        id: data._id,
        title: data.meetingName || "Select Your Availabilities",
        timezone: data.timeZone || "America/Toronto",
        slotMinutes,
        dayStart: minutesToTime(data.begTimeFrame),
        dayEnd: minutesToTime(data.endTimeFrame),
        startDate: data.startdate,
        endDate: data.enddate,
      });

      // build groupSlots + initialSelected from participants.slots
      const allSlots = [];
      let mySlots = [];

      (data.participants || []).forEach((p) => {
        const slotsForP = p.slots || [];
        allSlots.push(...slotsForP);

        if (p.name === participantName) {
          mySlots = slotsForP;
        }
      });

      setGroupSlots(allSlots);
      setInitialSelected(mySlots);
    } catch (err) {
      console.error("Failed to load meeting:", err);
    }
  };

  // load meeting when page mounts / meetingLink changes
  useEffect(() => {
    fetchMeeting();
  }, [meetingLink, participantName]);

  // ---- submit handler called by TimeSelector ----
  const handleSubmit = async ({ meetingId, timezone, slots }) => {
    console.log("Submitted schedule:", { meetingId, timezone, slots });

    try {
      await axios.post(
        `${API_BASE_URL}/api/meetings/${meetingLink}/select-time`,
        {
          participantName,
          slots,             // ISO strings from TimeSelector
          slotMinutes: meeting?.slotMinutes || 30,
        }
      );

      // refresh to pull latest participants.slots (for left grid)
      await fetchMeeting();
    } catch (err) {
      console.error("Error submitting schedule:", err.response?.data || err);
    }
  };

  if (!meeting) return <div>Loading...</div>;

  return (
  <div
  className="relative w-full min-h-screen flex tb:flex-row items-center justify-center tb:justify-start overflow-hidden
  bg-center bg-[length:200%_auto] "
>

    {/* Background */}
    <img
      src={SchedulingLogo}
      className="pointer-events-none absolute left-1/2 top-1/2 
        -translate-x-1/2 -translate-y-1/2 w-[220vmin] h-[202vmin] object-cover"
    />

    {/* Blue box */}
    <div
      className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 
      w-[70%] h-[200%] bg-[#3B7AAF] z-20"
    />

    {/* Logo */}
        <img
      src={landingLogo}
      className="w-[54px] absolute top-12 left-1/2 -translate-x-1/2 z-30"
    />

    {/* Time Selector   */}
    <div className="relative z-30 w-full flex items-start justify-center">
      <div className="mt-36 w-full max-w-none p-0">
        <TimeSelector
          meeting={meeting}
          groupSlots={groupSlots}
          initialSelected={initialSelected}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  </div>
);

};

export default SchedulingPage;
