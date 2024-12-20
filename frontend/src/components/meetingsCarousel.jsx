import React, {useEffect, useState} from 'react';
import axios from "axios";

const MeetingsCarousel = ({meeting}) => {
    //{meetings.meetingName} {meeting}
    console.log("In meetingsCarousel, tis the meeting", meeting);
    console.log("is meeting null", (meeting==null));
    //const [meetingName, setMeetingName] = useState([]);
    if (meeting) {
        const [dateRange, setDateRange] = useState([]);
        const [hourRange, setHourRange] = useState([]);
        const [startAMPM, setStartAMPM] = useState([]);
        const [endAMPM, setEndAMPM] = useState([]);
        const [timeSlot, setTimeSlot] = useState([]);
        const [meetingLink, setMeetingLink] = useState([]);
        
        useEffect(() => {
            const processMeetingsData = async () => {
                try {
                    // process timeSlot
                    const timeSlotStart = meeting.begTimeFrame/60;
                    const timeSlotEnd = meeting.endTimeFrame/60;
                    if (timeSlotStart < 12) {
                        setStartAMPM('am');
                    } else {
                        setStartAMPM('pm')
                    };
                    if (timeSlotEnd < 12) {
                        setEndAMPM('am');
                    } else {
                        setEndAMPM('pm');
                    };

                    setTimeSlot(`${timeSlotStart} ${startAMPM} to ${timeSlotEnd%12} ${endAMPM}`);

                    // process DateRange
                    const newStartDate = (meeting.startdate).split('T')[0];
                    const newEndDate = (meeting.enddate).split('T')[0];
                    console.log("newStartDate is", newStartDate);
                    setDateRange(`${newStartDate} to ${newEndDate}`);

                    //meetingLink
                    setMeetingLink(`http://localhost:5174/schedulingmain/${meeting.meetingLink}`);

                } catch (error) {
                    console.error('Error fetching user meetings:', error.response?.data || error.message);
                }

            };

            processMeetingsData();

        });
        /* 
        setTimeSlot(`${timeSlotStart} ${startAMPM} to `);
        const timeSlotStr = '${timeSlotStart}'
        console.log("In meetingsCarousel, tis the begTimeFrame", timeSlotEnd);*/
        /*
        useEffect(() => {
            const fetchMeetingData = async () => {
                try {
                    console.log("The Carousel's dealing with meeting:", meeting.id);
                    const response = await axios.get(`http://localhost:5001/api/meetings/${meeting.id}`);
                    const currMeeting = response.data.meeting;
                    console.log("I fetched this meeting:", currMeeting);
                    const begTimeFrame = '';
                    const endTimeFrame = '';
                    const startDate = '';
                    const endDate = '';
                } catch (error) {
                    console.error('Error fetching meeting data:', error.response?.data || error.message);
                }
            };
            fetchMeetingData(); //this is safe, because carousel won't be executed unless user has meetings
        });
        */


        return(
            <a href = {meetingLink}>
            <div className='relative h-[21vh] w-[200px] tb:w-[40vw] bg-white rounded p-[13px] tb:p-[3.5vh]' onclick=''>
                {/* Meeting 1 */}
                {/* Title + Date */}
                <div className='relative flex flex-col tb:flex-row tb:items-end'>
                    <h1 className='font-poppins font-semibold text-[15px] tb:text-[2.75vh] text-black'>{meeting.meetingName}</h1>
                    <p className='mt-[15px] tb:mt-auto tb:absolute tb:inset-y-0 tb:right-0 font-poppins font-semibold text-[11px] tb:text-[2.25vh] text-[#B3B3B3]'>{dateRange}</p>
                </div>
                {/* Time Slot + Min Time Slot */}
                <div className='absolute tb:pb-[3.5vh] pl-[13px] tb:pl-[3.5vh] inset-x-0 bottom-0 mt-[30px] tb:mt-auto'>
                    <h1 className='font-poppins text-[12px] tb:text-[2vh] text-black'>Time Slot: {timeSlot}</h1>
                    <h1 className='invisible font-poppins text-[2vh] text-black mt-[0.25vh]'>Minimum Time Slot: 120 Minutes</h1>
                </div>
                {/* 'Reuse this schedule' button */}
                <button
                    className="invisible absolute bottom-0 translate-x-[50%] translate-y-[50%] w-[15vw] bg-selective_yellow shadow rounded-2xl text-[1.15vw] font-poppins font-normal text-white"
                    onClick=''
                >
                    Reuse this Schedule
                </button>
            </div>
            </a>
        );
    } else {
        <p>No meetings scheduled.</p>
    }
    
};
export default MeetingsCarousel;