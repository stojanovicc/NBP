import React from 'react';
import SkijalistaList from './components/SkijalistaList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Pocetna from './components/Pocetna';
import Staze from './components/Staze';
import VremenskaPrognoza from './components/VremenskaPrognoza';

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/Skijalista" element={<SkijalistaList />} />
        <Route path="/Skijaliste/:naziv" element={<Staze />} /> 
        <Route path="//Skijaliste/:naziv/VremenskaPrognoza" element={<VremenskaPrognoza />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
