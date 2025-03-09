// Wendy Kuang 261111975 
import React, {useEffect, useState} from 'react';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import axios from "axios";
import MeetingsCarousel from '../components/meetingsCarousel';
import meetingSchema from '../../../backend/models/meetingSchema';

const DashboardPage = () => {

    const navigate = useNavigate();
    const [meetings, setMeeting] = useState([]);
    //For Testing
    const [meetingCarouselKey, setMeetingCarouselKey] = useState([]);
    const location = useLocation();
    const user = location.state?.user || {};  
    const idToken = location.state?.idToken || {};
    
    useEffect(() => {
        const fetchUserMeetings = async () => {
            try {
                if (!idToken) {
                    console.error("Token is missing");
                    return;
                }             
                const response = await axios.get(`http://chronus.onrender.com/api/meetings/user-meetings/${user.user.uid}`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Use Firebase token for authentication
                    },
                });
                
                setMeeting(response.data.meetings);
                setMeetingCarouselKey(user.user.uid);
                console.log("Meeting IDs:", meetings);
                console.log("Is key for carousel:", user.user.uid);
                //for testing
            } catch (error) {
                console.error('Error fetching user meetings:', error.response?.data || error.message);
            }
        };

        if (user!={}) {
            fetchUserMeetings();
        }
    }, [user.uid, user.token]);

    
    return (
        <div>
            {/* Bottom grey wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg className="h-[225px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-grey_background"></path>
                </svg>
            </div>

        
            {/* On top of grey wave */}
            <div className=''>
                {/* Logout button */}
                <div className='tb:absolute ml-[30px] tb:ml-[5%] tb:mt-[2%] mt-[30px]'>
                    <Link to="/" className='flex items-center space-x-[0.75vw]'>
                    <svg width="25" height="auto" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.9779 27.6754V31.2629C15.9779 32.2144 16.3591 33.1268 17.0375 33.7996C17.716 34.4724 18.6361 34.8504 19.5956 34.8504L32.2574 34.8504C33.2168 34.8504 34.137 34.4724 34.8154 33.7996C35.4939 33.1268 35.875 32.2144 35.875 31.2629L35.875 9.73789C35.875 8.78643 35.4939 7.87393 34.8154 7.20115C34.137 6.52836 33.2168 6.15039 32.2574 6.15039L19.5956 6.15039C18.6361 6.15039 17.716 6.52836 17.0375 7.20115C16.3591 7.87393 15.9779 8.78643 15.9779 9.73789V13.3254M26.8309 20.5004L5.125 20.5004M5.125 20.5004L10.5515 25.8816M5.125 20.5004L10.5515 15.1191" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span className="tb:text-[1.15vw] font-poppins font-normal text-white">Logout</span>
                    </Link>
                </div>

                {/* Logo + Register Heading */}
                <div className='mt-[15px] tb:mt-[3%]'>
                    {/* Logo */}
                    <div className="flex justify-center pt-8">
                        <svg width="15vh" height="auto" viewBox="0 0 155 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M63.8281 25.8376C78.8272 36.103 82.7775 56.463 72.6514 71.3131C62.5253 86.1631 42.1573 89.8797 27.1583 79.6144C12.1592 69.349 8.20883 48.989 18.3349 34.139C28.461 19.2889 48.829 15.5723 63.8281 25.8376ZM34.7888 68.4241C43.5456 74.4172 55.437 72.2474 61.3488 63.5776C67.2607 54.9078 64.9544 43.0211 56.1975 37.028C47.4407 31.0348 35.5494 33.2047 29.6376 41.8745C23.7257 50.5443 26.032 62.4309 34.7888 68.4241Z" fill="steel_blue"/>
                        <path d="M68.0692 49.4198C71.1455 31.5065 88.004 19.4265 105.724 22.4384C123.444 25.4503 135.314 42.4135 132.238 60.3268C129.162 78.2401 112.303 90.3201 94.5835 87.3082C76.8637 84.2963 64.9929 67.3331 68.0692 49.4198ZM118.885 58.0572C120.681 47.599 113.751 37.6955 103.406 35.937C93.0604 34.1786 83.218 41.2312 81.422 51.6894C79.626 62.1476 86.5565 72.0511 96.9017 73.8095C107.247 75.5679 117.089 68.5154 118.885 58.0572Z" fill="#steel_blue"/>
                        <path d="M70.6096 32.0096C66.2992 26.8311 60.5133 23.0803 54.034 21.2643C47.5547 19.4482 40.6946 19.6546 34.381 21.8554C28.0674 24.0562 22.6049 28.1453 18.732 33.57C14.8591 38.9946 12.7625 45.4931 12.7257 52.1869C12.6889 58.8808 14.7137 65.4471 18.5264 70.9982C22.339 76.5493 27.7556 80.8174 34.0438 83.2255C40.3321 85.6336 47.1887 86.0656 53.6868 84.4631C60.1849 82.8606 66.0109 79.3008 70.3774 74.265L60.0212 65.301C57.4719 68.241 54.0705 70.3193 50.2768 71.2548C46.4831 72.1904 42.48 71.9382 38.8088 70.5323C35.1376 69.1264 31.9752 66.6346 29.7493 63.3937C27.5234 60.1529 26.3413 56.3193 26.3628 52.4113C26.3842 48.5033 27.6083 44.7093 29.8694 41.5423C32.1305 38.3752 35.3196 35.9879 39.0056 34.703C42.6917 33.4181 46.6968 33.2977 50.4795 34.3579C54.2623 35.4182 57.6402 37.608 60.1567 40.6313L70.6096 32.0096Z" fill="white"/>
                        <path d="M73.5571 36.706C70.2712 41.6845 68.3833 47.4632 68.0957 53.4231C67.808 59.3829 69.1314 65.2994 71.9241 70.5389C74.7168 75.7783 78.8736 80.1433 83.9492 83.1662C89.0248 86.1892 94.8281 87.7562 100.737 87.6995C106.647 87.6428 112.439 85.9645 117.495 82.8443C122.551 79.7242 126.679 75.2797 129.437 69.987C132.195 64.6943 133.48 58.7528 133.154 52.7988C132.827 46.8448 130.902 41.1027 127.584 36.1876L116.366 43.9418C118.303 46.8114 119.428 50.1637 119.618 53.6398C119.809 57.1159 119.059 60.5847 117.448 63.6747C115.838 66.7647 113.428 69.3595 110.476 71.1811C107.525 73.0027 104.143 73.9825 100.693 74.0156C97.2428 74.0487 93.8547 73.1339 90.8915 71.369C87.9282 69.6041 85.5014 67.0558 83.8709 63.9969C82.2405 60.938 81.4679 57.4838 81.6358 54.0043C81.8038 50.5248 82.906 47.151 84.8243 44.2445L73.5571 36.706Z" fill="white"/>
                        </svg>
                    </div>
                    {/* Register Heading */}
                    <h1 className="font-poppins font-semibold text-[25px] tb:text-[3vw] text-white text-center">
                        Welcome {user.user.name || "User"} to ChronUs!
                    </h1>
                </div>

                {/* Meeting Carousel */}
                
                <h1 className="ml-[8.5%] mt-[65px] tb:mt-[7.5vh] font-poppins font-semibold text-[4vh] text-white">Recently Scheduled</h1>
                <div className='h-[28vh] ml-[8.5%] flex flex-col items-start overflow-x-auto '>
                    <div className='mt-[2vh] flex space-x-5 '>
                    {meetings.length > 0 ? (
                    meetings.map((meetings) => (
                        <MeetingsCarousel key={meetingCarouselKey} meeting={meetings}/>
                    ))
                    ) : (
                        <p>No meetings scheduled.</p>
                    )}

                    
                        
                        
                    </div>
                </div>

                {/* Add Meeting Button */}
                <div className='relative mt-[5vh] mx-auto flex flex-col justify-center items-center py-[4vh] h-[150px] tb:h-[19vh] w-[200px] ph:w-1/3 tb:w-[25vw] bg-white rounded-2xl border-dashed border-[#B3B3B3] border-4'
                onClick={() => navigate("/createMeeting")}
                >
                    <svg width="40" height="auto" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40.9997 17.084V64.9173M17.083 41.0006H64.9163" stroke="#B3B3B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span className="text-[15px] tb:text-[1.65vw] font-poppins font-semibold text-[#B3B3B3] ">Create New Meeting</span>
                </div>
            </div>

            {/* blue bg */}
            <div className='absolute top-0 left-0 w-full h-screen bg-steel_blue overflow-hidden z-[-1]'></div>
        </div>

        
    );
};
export default DashboardPage;