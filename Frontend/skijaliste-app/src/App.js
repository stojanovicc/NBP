import React from 'react';
import SkijalistaList from './components/SkijalistaList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Pocetna from './components/Pocetna';
import Staze from './components/Staze';
import VremenskaPrognoza from './components/VremenskaPrognoza';
import Recenzije from './components/Recenzije';

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/Skijalista" element={<SkijalistaList />} />
        <Route path="/Skijaliste/:naziv" element={<Staze />} /> 
        <Route path="//Skijaliste/:naziv/VremenskaPrognoza" element={<VremenskaPrognoza />} />
        <Route path="/Skijaliste/:naziv/:nazivStaze/Recenzije" element={<Recenzije />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
