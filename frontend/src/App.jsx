import { useState } from 'react'
import reactLogo from './assets/logo.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={reactLogo} className="logo" alt="Vite logo" />
        </a>
      
      </div>

      
    </>
  )
}

export default App
