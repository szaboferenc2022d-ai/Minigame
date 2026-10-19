import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Amőba</h1>
    <h3>X bal, O jobb kattintás</h3>
    <p>3 x 3</p>
    <App />
  </StrictMode>,
)