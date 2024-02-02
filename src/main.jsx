import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { Flights } from './pages/Flights/Flights';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Flights />
  </React.StrictMode>,
)
