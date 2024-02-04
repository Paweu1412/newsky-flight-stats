import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Flights from './pages/Flights/Flights';

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="*" element={<Flights />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

export default App;
