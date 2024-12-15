import React, { useEffect,useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import {auth,googleProvider} from "../firebase"
import LoginLogo from '../assets/GreenLogo.svg'; // Login logo
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom'; // For navigation


const LoginPage = () => {

 
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState();
    const [error,setError] = useState("")
    const navigate = useNavigate();
    
    //email login
    const handleEmailLogin = async(e) => {
        e.preventDefault();
        try {
            
            //testing
            console.log("Attempting to log in...");
            const userCredential = await signInWithEmailAndPassword(auth,email,password);
            console.log("User logged in:", userCredential.user);
            // testing
            const idToken = await userCredential.user.getIdToken();
            console.log("Firebase ID Token:", idToken); 
            const response = await fetch("http://localhost:5001/api/users/login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${idToken}` 
                },
                body: JSON.stringify({ email }),
            });
              // Debug response
            console.log("Response status:", response.status);
            console.log("Response text:", await response.text());
            const data = await response.json();
            navigate("/dashboard", { state: { user: data.user } });
        }
        catch (error){
            console.error("Error logging in: ", error.message);
            setError("Invalid email or password")
        }
    }

    //google login
    const handleGoogleLogin = async () => {
        try{
            console.log("Attempting to log in...");
            const userCredential = await signInWithPopup(auth,googleProvider);
            console.log("Signed in with Google",userCredential.user);
            // testing
            const idToken = await userCredential.user.getIdToken();
            console.log("Firebase ID Token:", idToken); 
            await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
                body: JSON.stringify({ email }),
            });
            navigate("/dashboard");
        }
        catch (error) {
            console.error("Error attemping to sign using Google", error.message)
        }
    }
   


    return (
        <div className="relative w-full h-screen bg-[#F5F5F5] overflow-hidden">
        {/* Background Rectangle */}
        <div className="absolute bottom-0 right-0 w-[60%] h-full bg-pine_green rounded-bl-[432px]"></div>

        {/* Log In Heading */}
        <h1 className="absolute w-[14.6%] h-[6.1%] top-[25.4%] left-[14.1%] font-kulim font-semibold text-[3.65vw] leading-[5.6vw] text-[#032B43] text-center">
        Log In
        </h1>

        {/* Email Address */}
        <label
        htmlFor="email"
        className="absolute top-[39.4%] left-[8.64%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
        >
        Email Address
        </label>
        <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="absolute w-[23.6%] h-[4.9%] top-[43.1%] left-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
        />

        {/* Password */}
        <label
        htmlFor="password"
        className="absolute top-[49.2%] left-[8.7%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
        >
        Password
        </label>
        <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="absolute w-[23.6%] h-[4.9%] top-[52.7%] left-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
        />

        {/* Sign In Button */}
        <button className="absolute w-[12.4%] h-[5%] top-[64.6%] left-[14.2%] bg-[#FFBA08] shadow rounded-[2.7%] text-[1.46vw] font-poppins font-normal leading-[2vw] text-[#000000]"
                onClick={handleEmailLogin}
            >
        Sign In
        </button>

        {/* 'Or' Text */}
        <p className="absolute top-[75.6%] left-[20%] font-poppins text-[1.15vw] text-[#0D2D7F]">
        or
        </p>

        {/* Lines Around 'Or' */}
        <div className="absolute top-[77.2%] left-[7.03%] w-[11.1%] border border-black"></div>
        <div className="absolute top-[77.2%] left-[23.2%] w-[11.1%] border border-black"></div>

 
       
         {/* Google's Sign In Button. Code for google sign-in button proivded by Google */}
         <div>
            <button
                className="gsi-material-button absolute top-[80%] left-[14.2%]"
                onClick={handleGoogleLogin}
            >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                    <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{ display: "block" }}
                    >
                    <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </div>
                <span className="gsi-material-button-contents">Sign in with Google</span>
                </div>
            </button>
        </div>

        {/* Register Link */}
        <p className="absolute top-[91.4%] left-[78.6%] w-[26.7%] font-poppins text-[0.93vw] font-light leading-[5.6vw] text-[#FFFFFF] text-center">
            Not registered yet?{' '}
            <a href="/register" className="underline">
            Register Now
            </a>
        </p>

        {/* Placeholder Shapes */}
        <div className="absolute top-[8.4%] left-[15.7%]">
        <img src={LoginLogo} alt="ChronUs Logo" className="w-20 h-20" />
        </div>
    </div>

        

    );
};
export default LoginPage