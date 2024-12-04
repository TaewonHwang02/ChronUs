import React,{useState} from 'react';
import registerLogo from '../assets/YellowLogo.svg'; // Header logo
import Button from '../components/Button';
import {Link} from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom'; 

const RegisterPage = () => {
const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setError("password does not match");
        return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth,email,password);
        console.log("User registered", userCredential.user)
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        navigate('/login');
    }
    catch (error) {
        console.log("Error registering user:", error.message);
        setError(error.message)
    }
  };


    
  return (
    <div className="relative w-full h-screen bg-grey_background overflow-hidden">
      {/* Background */}
      <div class="absolute bottom-0 left-0 w-[58%] h-full bg-selective_yellow "></div>
      {/* Logo */}
      <div className="absolute top-32 right-[17.5%]">
        <img src={registerLogo} alt="ChronUs Logo" className="w-20 h-20" />
      </div>
       {/* Register Heading */}
        <h1 className="absolute w-[14.6%] h-[6.1%] top-[25.4%] right-[13%] font-kulim font-semibold text-[3.65vw] leading-[5.6vw] text-[#032B43] text-center">
        Register 
        </h1>

        
        
        {/* Full name */}
        
        <label
        htmlFor="email"
        className="absolute top-[39.4%] right-[26.5%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
        >
        Full name
        </label>
        <input
        type="email"
        id="email"
        
        className="absolute w-[23.6%] h-[4.9%] top-[43.1%] right-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
        />

        {/* Email Address */}
        <label
        htmlFor="email"
        className="absolute top-[50%] right-[24%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
        >
        Email Address
        </label>
        <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        
        className="absolute w-[23.6%] h-[4.9%] top-[53%] right-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
        />


        {/* Password */}
        <label
        htmlFor="email"
        className="absolute top-[60%] right-[26.5%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
        >
        Password
        </label>
        <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        
        className="absolute w-[23.6%] h-[4.9%] top-[65%] right-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
        />

        {/* Re-enter password */}
        <label
        htmlFor="email"
        className="absolute top-[73%] right-[21.5%] font-poppins font-normal text-[1.15vw] text-[#0D2D7F]"
        >
        Re-Enter Password
        </label>
        <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}

        
        className="absolute w-[23.6%] h-[4.9%] top-[78%] right-[8.6%] bg-[#FBFBFB] shadow-inner rounded-[1.5%] p-2"
        />
         {/* Sign In Button */}
         <button className="absolute w-[12.4%] h-[5%] bottom-[10%] right-[13.5%] bg-[#FFBA08] shadow rounded-[2.7%] text-[1.46vw] font-poppins font-normal leading-[2vw] text-[#000000]"
                 onClick={handleRegister}
            >
        Join Now
        </button>
       

      




        
      </div>

  );
};

export default RegisterPage;