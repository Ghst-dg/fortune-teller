import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/yatra-one'
import '@fontsource-variable/space-grotesk'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
