import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./pages/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SchedulingMainPage from "./pages/SchedulingMain";
import CreateMeeting from "./pages/createMeeting";
import LinkPage from "./pages/linkPage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // 🌙 Load saved theme from localStorage on startup
  useEffect(() => {
    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      
        <Route
          path="/schedulingmain/:meetingLink"
          element={<SchedulingMainPage />}
        />
        <Route path="/createMeeting" element={<CreateMeeting />} />
        <Route path="/join/:meetingLink" element={<LinkPage />} />
      </Routes>
    </Router>
  );
}

export default App;
