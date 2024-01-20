import React from 'react';
import SkijalistaList from './components/SkijalistaList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Pocetna from './components/Pocetna';
import Staze from './components/Staze';
import VremenskaPrognoza from './components/VremenskaPrognoza';
import Aktivnosti from './components/Aktivnost'
import Obavestenja from './components/Obavestenje';
import Recenzije from './components/Recenzije';
import Pretraga from './components/Pretraga';

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/Skijalista" element={<SkijalistaList />} />
        <Route path="/Skijaliste/:naziv" element={<Staze />} /> 
        <Route path="//Skijaliste/:naziv/VremenskaPrognoza" element={<VremenskaPrognoza />} />
        <Route path="//Skijaliste/:naziv/Aktivnosti" element={<Aktivnosti />} />
        <Route path="//Skijaliste/:naziv/Obavestenja" element={<Obavestenja />} />
        <Route path="/Skijaliste/:naziv/:nazivStaze/Recenzije" element={<Recenzije />} />
        <Route path="/Pretraga" element={<Pretraga />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
