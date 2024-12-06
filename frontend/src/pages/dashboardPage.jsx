import React from 'react';
import { Link } from 'react-router-dom';
const DashboardPage = () => {
    return (
        <div className="relative w-full h-screen  bg-steel_blue">
            <svg
                className="absolute bottom-0 w-full" 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 500"
                preserveAspectRatio="none"
                style={{ height: '200px' }} 


            >
                <path
                    fill="#f5f5f5" 
                    fillOpacity="1"
                    d="M0,192L48,186.7C96,181,192,171,288,144C384,117,480,75,576,85.3C672,96,768,160,864,181.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,500L0,500Z"
                ></path>
            </svg>
        </div>
    );
};


export default DashboardPage;
