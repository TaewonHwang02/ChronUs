import { useState } from 'react'
import './App.css'
import LandingPage from './pages/landingPage'
import LoginPage from './pages/loginPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/dashboardPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
      </Routes>
    </Router>
  );
}


export default App
