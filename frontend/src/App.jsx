import { useState } from 'react'
import reactLogo from './assets/logo.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/landingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <LandingPage />
    </div>
    </>
  )
}

export default App
