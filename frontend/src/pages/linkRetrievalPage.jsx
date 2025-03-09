// Wendy Kuang 261111975 (responsive design)
// Taewon Hwang 261013091
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonBlue from '../components/ButtonBlue';
import { DraggableSelector } from 'react-draggable-selector';
import axios from "axios"
import {getAuth} from "firebase/auth"

const LinkRetrievalPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve state from navigation
    const { meetingID, meetingLink } = location.state || {};
    const [dates, setDates] = useState([new Date()]);
    const [times, setTimes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputMeetingName, setInputMeetingName] = useState("");
    const [error, setError] = useState("");

    // Validate state
    useEffect(() => {
        if (!meetingID || !meetingLink) {
            setError("Meeting details are missing. Please return to the previous page.");
        }
    }, [meetingID, meetingLink]);
    useEffect(() => {
        console.log("Selected time slots:", times);
    }, [times]);



    
    const handleFinalizeMeeting = async () => {
        if (!inputMeetingName) {
          alert("Please provide a meeting name.");
          return;
        }
      
        try {
          // Fetch Firebase token
          const auth = getAuth();
          const user = auth.currentUser;
      
          if (!user) {
            throw new Error("User is not authenticated");
          }
      
          const userToken = await user.getIdToken();
          const uniqueLink = `http://localhost:5173/join/${meetingLink}`;

      
          // Make the PUT request to update the meeting name
          const response = await axios.put(
            `http://chronus.onrender.com/api/meetings/update-meeting/${meetingID}`,
            { meetingName: inputMeetingName },
            {
              headers: { Authorization: `Bearer ${userToken}` }, // Pass token here
            }
          );
      
          console.log("Meeting name updated:", response.data);
          navigator.clipboard.writeText(uniqueLink);
          
          navigate(`/join/${meetingLink}`);
        } catch (error) {
          console.error("Error updating meeting:", error.response?.data || error.message);
        }
      };
    

    //
    return (
        <div className=''>
          <div className='absolute w-full h-full bg-grey_background z-[-2]'></div>
          {/* Background Ellipse */}
          <div className="absolute w-full h-[84%] bg-selective_yellow rounded-br-[600px] z-[-1]"></div>
        <div className="p-0 tb:p-0 relative w-screen h-screen overflow-y-auto overflow-x-hidden">
          {/* ChronUs Text */}
          <div className="px-[10px] tb:px-auto text-white text-center mt-[7%]">
              <h4 className="text-4xl font-poppins font-semibold mb-2">Thank you for choosing</h4>
              <h3 className="text-6xl font-kulim font-semibold">
                  <span className="text-white">Chron</span>
                  <span className="text-steel_blue text-7xl">u</span>
                  <span className="text-steel_blue">s</span>
              </h3>
          </div>

          {/* Bottom Box */}
          <div className='flex flex-col tb:flex-row justify-center tb:items-start tb:space-x-[9%] mt-[40px] tb:mt-[5%] px-[25px] ph:px-[90px] tb:px-auto w-screen tb:w-auto'>
            {/* Time Selector */}
            <div className="bg-white m-[10px] p-4 rounded-lg shadow-md tb:w-[33%] h-auto flex items-center justify-center">
              <DraggableSelector
                minTime={8}
                maxTime={19}
                dates={dates}
                timeSlots={times}
                setTimeSlots={setTimes}
                slotHeight={15}
                slotWidth={50}
                slotsMarginTop={5}
                slotsMarginLeft={5}
              />
            </div>
            
            {/* Text + box */}
            <div>
              {/* Deadline and Information */}
              <div className="mt-[50px] text-steel_blue tb:text-white">
                  <h3 className="text-[20px] tb:text-3xl font-poppins mb-2">You will be notified of the most</h3>
                  <h3 className="text-[20px] tb:text-3xl font-poppins mb-8">optimal time slots upon deadline</h3>
              </div>

              {/* Meeting Link Section */}
              <div className="flex flex-col tb:flex-row items-center tb:space-x-4 h-16">
                  {/* Meeting Name Input */}
                  <input
                      type="text"
                  
                      value={inputMeetingName}
                      onChange={(e) => setInputMeetingName(e.target.value)}
                      className="font-poppins mb-[10px] tb:mb-0 flex-grow w-[300px] tb:w-[15vw] p-1 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-steel_blue"
                  />
                  {/* Blue Button Finalizes Meeting */}
                  <ButtonBlue className='' text="Retrieve Link" onClick={handleFinalizeMeeting} />
              </div>
            </div>
          </div>
        </div>
        </div>

    );
};

export default LinkRetrievalPage;
