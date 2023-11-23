import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './css/main.css'
import './css/tailwind.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
