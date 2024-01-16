import React from 'react';
import SkijalistaList from './components/SkijalistaList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Staze from './components/Staze';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Skijalista" element={<SkijalistaList />} />
        <Route path="/Skijaliste/:id" element={<Staze />} /> 
      </Routes>
    </Router>
  );
};

export default App;
