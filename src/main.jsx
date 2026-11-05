import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fdfdfd",
            color: "#1D2937",
            border: "1px solid #53657a",
            borderRadius: "8px",
            fontSize: "16px",
            padding: "16px 20px",
            minWidth: "300px",
            maxWidth: "450px",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
