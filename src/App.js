import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Flights from './pages/Flights/Flights';
import Ongoing from './pages/Ongoing/Ongoing';

const App = () => {
  return (
    // <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/flights" element={<Flights />} />
          <Route path="/ongoing" element={<Ongoing />} />
        </Routes>
      </Router>
    // </React.StrictMode>
  );
};

export default App;
