// Wendy Kuang 261111975
import React, {useEffect, useState} from 'react';
import { API_BASE_URL } from "../config";

const MeetingsCarousel = ({meeting}) => {
    console.log("current meeting is:", meeting);
    if (meeting) {
        const [dateRange, setDateRange] = useState([]);
        const [hourRange, setHourRange] = useState([]);
        const [startAMPM, setStartAMPM] = useState([]);
        const [endAMPM, setEndAMPM] = useState([]);
        const [timeSlot, setTimeSlot] = useState([]);
        const [meetingRealLink, setMeetingLink] = useState([]);
        
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
                    setDateRange(`${newStartDate} to ${newEndDate}`);

                    //meetingLink
                    setMeetingLink(`${API_BASE_URL}/join/${meeting.meetingLink}`);

                } catch (error) {
                    console.error('Error fetching user meetings:', error.response?.data || error.message);
                }

            };
            processMeetingsData();

        });
        
        return(
            <a href = {meetingRealLink}>
            <div className='relative h-[21vh] w-[200px] tb:w-auto bg-white rounded p-[13px] tb:p-[3.5vh] ' onclick=''>
                {/* Meeting 1 */}
                {/* Title + Date */}
                <div className='relative flex flex-col tb:flex-row tb:space-x-[5%] '>
                    <h1 className='font-poppins font-semibold text-[17px] tb:text-[2.75vh] text-black tb:text-nowrap'>{meeting.meetingName}</h1>
                    <p className='mt-[10px] tb:mt-auto tb:pr-[3.5vh] font-poppins font-semibold text-[13px] tb:text-[2vh] text-[#B3B3B3] tb:text-nowrap'>{dateRange}</p>
                </div>
                {/* Time Slot + Min Time Slot */}
                <div className='absolute pb-[13px] tb:pb-[3.5vh] pl-[13px] tb:pl-[3.5vh] inset-x-0 bottom-0 mt-[30px] tb:mt-auto'>
                    <h1 className='font-poppins text-[14px] tb:text-[2vh] text-black'>Time Slot: {timeSlot}</h1>
                    <h1 className='font-poppins text-[15px] tb:text-[2vh] text-black mt-[0.25vh]'>Minimum Time Slot: {meeting.minimumTimeSlots} Minutes</h1>
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