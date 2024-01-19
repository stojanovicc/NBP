import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Pocetna from './components/Pocetna';
import Staze from './components/Staze';
import SkijalistaList from './components/SkijalistaList';
import VremenskaPrognoza from './components/VremenskaPrognoza';

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/Skijalista" element={<SkijalistaList />} />
        <Route path="/Skijaliste/:naziv" element={<Staze />} />
        <Route path="/VremenskaPrognoza" element={<VremenskaPrognoza />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
