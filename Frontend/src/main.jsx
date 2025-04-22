import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CentralStorageContext from './context/CentralStorageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CentralStorageContext>
    <App />
    </CentralStorageContext>
  </StrictMode>,
)
