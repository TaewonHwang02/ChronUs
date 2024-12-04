import React from 'react';
import { Link,useLocation } from 'react-router-dom';

const DashboardPage = () => {
    const location = useLocation();
    const user = location.state?.user || {};  
    return (
        <div className="relative w-full h-screen bg-grey_background overflow-hidden">
            {/* Ellipse */}
            <div class="absolute w-full h-[422.6px] bg-steel_blue"></div>
            <h1>Welcome {user.name || "User"} to ChronUs!</h1>


        </div>
    );
};
export default DashboardPage;