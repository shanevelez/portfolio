import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PizzaCalculator from './Pizza.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Your main single-page portfolio */}
        <Route path="/" element={<App />} />
        
        {/* Your new pizza calculator page */}
        <Route path="/pizza" element={<PizzaCalculator />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)