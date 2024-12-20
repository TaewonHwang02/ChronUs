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

  const validateInputs = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (password !== confirmPassword) {
      newErrors.passwordMatch = "Passwords do not match.";
    }

    if (password.length < 8) {
      newErrors.passwordLength = "Password must be at least 8 characters long.";
    }

    return newErrors;
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  

      const idToken = await userCredential.user.getIdToken();
      console.log("Generated Firebase ID Token:", idToken);
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
      navigate("/dashboard", { state: { user: data, idToken:idToken} });
    } catch (error) {
      console.error("Error registering user:", error.message);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="absolute top-0 left-0 w-full min-h-screen bg-grey_background z-[-2]"></div>

      {/* Yellow Background */}
      <div className="invisible tb:visible absolute bottom-0 left-0 w-[58%] h-full bg-selective_yellow flex justify-center tb:items-center z-[-1]">
        <h3 className="absolute font-poppins font-normal font-semibold text-[5vw] text-white tracking-wider bottom-0 tb:bottom-auto mb-[40px] tb:mb-0 tb:translate-x-[-20%] tb:translate-y-[40%]">
          Time for Us <br  />to Start!
        </h3>
      </div>

      {/* right side rectangle */}
      <div className="flex flex-col justify-center tb:absolute tb:right-0 tb:w-[42%] min-h-screen h-auto w-auto">
        {/* Logo + Register Heading */}
        <div>
          {/* Logo */}
          <div className="flex justify-center ">
            <img src={registerLogo} alt="ChronUs Logo" className="mb-3 h-auto w-24" />
          </div>
          {/* Register Heading */}
          <h1 className="font-kulim font-semibold text-[30px] tb:text-[2vw] text-[#032B43] text-center">
            Register Here
          </h1>
          {/* All Labels */}
        <div className="mt-[20px] ph:mt-[60px] tb:mt-8 flex flex-col items-center justify-center space-y-4 pt-6">
          {/* Full Name */}
          <div className="flex flex-col items-start justify-center space-y-[3px] ">
            <label
              htmlFor="name"
              className="font-poppins font-normal text-[15px] tb:text-[0.95vw] text-[#0D2D7F]"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#FBFBFB] font-poppins shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md w-[275px] tb:w-72 h-[30px] tb:h-8"
            />
          </div>
          
          <div className="flex flex-col items-start justify-center space-y-[3px]">
            {/* Email Address */}
            <label
              htmlFor="email"
              className="font-poppins font-normal text-[15px] tb:text-[0.95vw] text-[#0D2D7F]"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#FBFBFB] font-poppins shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md w-[275px] tb:w-72 h-[30px] tb:h-8"
            />
          </div>
          
          <div className="flex flex-col items-start justify-center space-y-[3px]">
            {/* Password */}
            <label
              htmlFor="password"
              className="font-poppins font-normal text-[15px] tb:text-[0.95vw] text-[#0D2D7F]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#FBFBFB] font-poppins shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md w-[275px] tb:w-72 h-[30px] tb:h-8"
            />
          </div>

          <div className="flex flex-col items-start justify-center space-y-[3px]">
            {/* Re-enter Password */}
            <label
              htmlFor="confirmPassword"
              className="font-poppins font-normal text-[15px] tb:text-[0.95vw] text-[#0D2D7F]"
            >
              Re-Enter Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#FBFBFB] font-poppins shadow-[inset_0_2px_4px_0px_rgba(0,0,0,0.3)] rounded-md w-[275px] tb:w-72 h-[30px] tb:h-8"
            />
          </div>

          {error && (
            <p className="text-red-500 font-poppins text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center space-y-[20px] tb:space-y-[3%] mt-[40px] tb:mt-[8%]">
          {/* Register Button */}
          <button
            className="justify-center p-1 w-[125px] tb:w-28 bg-steel_blue shadow rounded-2xl ph:text-[vw] tb:text-[1.15vw] font-poppins font-normal text-white"
            onClick={handleRegister}
          >
            Join Now
          </button>
        </div>

          
          {/* <div className="invisible flex row">
            <hr className="block h-[10px] border-t-black w-[110px] tb:w-36 mr-16"/>
            <hr className="block h-[10px] border-t-black w-[110px] tb:w-36"/>
          </div>  
          
          <div className="invisible flex justify-center items-center w-48 h-6 bg-white shadow rounded-2xl">
            <img src={googleLogo} alt="ChronUs Logo" className="h-auto w-5 pr-[3%]" />
            <span className="text-[12px] tb:text-[1.15vw] font-poppins font-normal text-black">Sign up with Google</span>
          </div> */}
        </div>
      </div>
      
    </div>
  );
};

export default RegisterPage;
