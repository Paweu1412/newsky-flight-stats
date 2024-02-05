import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Flights from './pages/Flights/Flights';
import Ongoing from './pages/Ongoing/Ongoing';

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/paffsair/flights" element={<Flights />} />
          <Route path="/paffsair/ongoing" element={<Ongoing />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

export default App;
