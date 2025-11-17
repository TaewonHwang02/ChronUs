import React from "react";
import TimeSelector from "../components/TimeSelector";
import SchedulingLogo from "../assets/BlueLogo.svg";
import landingLogo from "../assets/logo.svg";

const SchedulingPage = () =>{

    // Test meeting data
    const meeting = {
    id: "demo-meeting",
    title: "Select your availabilities",
    timezone: "America/Toronto",
    slotMinutes: 30,
    dayStart: "06:00",
    dayEnd: "20:00",
    startDate: "2025-11-01",
    endDate: "2025-11-07",
  };

  const handleSubmit = (payload) => {
    console.log("Submitted schedule: ", payload);
  };

  return (
      
      <div className = "fixed inset-0 bg-white overflow-hidden flex items-center justify-center">
        {/* CU Letter background image*/}
        <img src={SchedulingLogo}  className="
          pointer-events-none
          absolute
          left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[220vmin] h-[202vmin]  
          object-cover
          "/>

        {/* Blue box */}

        <div className="absolute top-16 left-1/2 top-12 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[200%] bg-[#3B7AAF] z-20"/>

        <img src={landingLogo} className="w-[54px] absolute top-12 -translate-x-1/2  z-30"/>
        <div className="relative z-30 w-full flex items-start justify-center">
        {/* White card that contains the selector */}
        <div className="mt-36 w-[72%] max-w-5xl bg-white text-black rounded-2xl shadow-xl p-6">
          <TimeSelector meeting={meeting} onSubmit={handleSubmit} />
        </div>
      </div>

        

       
      
      </div>
  

  )
};

export default SchedulingPage;