import { useState } from 'react'
import './App.css'
import LandingPage from './pages/landingPage'
import LoginPage from './pages/loginPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/dashboardPage';
import RegisterPage from './pages/registerPage';
import SchedulingMainPage from './pages/SchedulingMain';
import LinkRetrievalPage from './pages/linkRetrievalPage';
import CreateMeeting from './pages/createMeeting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/schedulingmain" element={<SchedulingMainPage />} />
        <Route path="/linkretrieval" element={<LinkRetrievalPage />} />
        <Route path='/createMeeting' element={<CreateMeeting />} />
     
       
        
      </Routes>
    </Router>
  );
}


export default App
