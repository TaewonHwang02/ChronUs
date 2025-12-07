import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./pages/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SchedulingMainPage from "./pages/SchedulingMain";
import CreateMeeting from "./pages/createMeeting";
import LinkPage from "./pages/linkPage";
import OptionPanel from "./components/optionPanel";
import SchedulingPage from "./pages/schedulingPage";

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
      <div className="relative w-full min-h-screen overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          {/* .. */}
          <Route
            path="/schedulingmain/:meetingLink"
            element={
              <SchedulingMainPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
          <Route
            path="/createMeeting"
            element={
              <CreateMeeting darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          <Route
            path="/schedulingpage/:meetingLink"
            element={
              <SchedulingPage darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          <Route
            path="/join/:meetingLink"
            element={<LinkPage darkMode={darkMode} setDarkMode={setDarkMode} />}
          />{" "}
        </Routes>
        <OptionPanel darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </Router>
  );
}

export default App;
