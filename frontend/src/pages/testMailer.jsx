import React, { useState } from "react";
import registerLogo from "../assets/YellowLogo.svg"; // Header logo
import googleLogo from "../assets/GoogleLogo.svg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import EmailForm from "../components/emailForm";

const Tester = () => {

  return (
    <div>
      <EmailForm />
    </div>
  );
};

export default Tester;
