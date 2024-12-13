import React, { useState } from "react";
import registerLogo from "../assets/YellowLogo.svg"; // Header logo
import googleLogo from "../assets/GoogleLogo.svg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  

      const idToken = await userCredential.user.getIdToken();
      const response = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync user with MongoDB");
      }

      const data = await response.json();
      console.log("User registered successfully:", data);
      navigate("/dashboard", { state: { user: data.user } });
    } catch (error) {
      console.error("Error registering user:", error.message);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="absolute w-full h-screen bg-grey_background overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 left-0 w-[58%] h-full bg-selective_yellow flex justify-center items-center">
        <h3 className="font-poppins font-normal font-semibold text-[5vw] text-white tracking-wider translate-x-[-20%] translate-y-[40%]">
          Time for Us <br  />to Start!
        </h3>
      </div>

      {/* right side rectangle */}
      <div className="absolute bottom-0 right-0 h-full w-[42%]">
        {/* Logo + Register Heading */}
        <div>
          {/* Logo */}
          <div className="flex justify-center pt-8">
            <img src={registerLogo} alt="ChronUs Logo" className="h-auto w-28" />
          </div>
          {/* Register Heading */}
          <h1 className="font-kulim font-semibold text-[1.65vw] text-[#032B43] text-center">
            Register Here
          </h1>
        </div>
        
        {/* All Labels */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-6">
          {/* Full Name */}
          <div className="flex flex-col items-start justify-center ">
            <label
              htmlFor="name"
              className="font-poppins font-normal text-[0.95vw] text-[#0D2D7F]"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#FBFBFB] shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md p-2 w-72 h-8"
            />
          </div>
          
          <div className="flex flex-col items-start justify-center">
            {/* Email Address */}
            <label
              htmlFor="email"
              className="font-poppins font-normal text-[0.95vw] text-[#0D2D7F]"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#FBFBFB] shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md p-2 w-72 h-8"
            />
          </div>
          
          <div className="flex flex-col items-start justify-center">
            {/* Password */}
            <label
              htmlFor="password"
              className="font-poppins font-normal text-[0.95vw] text-[#0D2D7F]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#FBFBFB] shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md p-2 w-72 h-8"
            />
          </div>

          <div className="flex flex-col items-start justify-center">
            {/* Re-enter Password */}
            <label
              htmlFor="confirmPassword"
              className="font-poppins font-normal text-[0.95vw] text-[#0D2D7F]"
            >
              Re-Enter Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#FBFBFB] shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md p-2 w-72 h-8"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center space-y-[3%] mt-[8%]">
          {/* Register Button */}
          <button
            className="justify-center w-28 bg-steel_blue shadow rounded-2xl text-[1.15vw] font-poppins font-normal text-white"
            onClick={handleRegister}
          >
            Join Now
          </button>

          {/* Lines */}
          <div className="flex row">
            <hr className="block h-[10px] border-t-black w-36 mr-16"/>
            <hr className="block h-[10px] border-t-black w-36"/>
          </div>  
          
          {/* Google Button */}
          <div className="flex justify-center items-center w-48 h-6 bg-white shadow rounded-2xl">
            <img src={googleLogo} alt="ChronUs Logo" className="h-auto w-5 pr-[3%]" />
            <span className="text-[1.15vw] font-poppins font-normal text-black">Sign up with Google</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default RegisterPage;
