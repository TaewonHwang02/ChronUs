import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./pages/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SchedulingMainPage from "./pages/SchedulingMain";
import CreateMeeting from "./pages/createMeeting";
import LinkPage from "./pages/linkPage";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />
          }
        />
        <Route
          path="/schedulingmain/:meetingLink"
          element={<SchedulingMainPage darkMode={darkMode} />}
        />
        <Route path="/createMeeting" element={<CreateMeeting />} />
        <Route path="/join/:meetingLink" element={<LinkPage />} />
      </Routes>
    </Router>
  );
}

export default App;
