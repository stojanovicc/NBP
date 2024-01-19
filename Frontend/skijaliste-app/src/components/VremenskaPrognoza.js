import React, { useState } from 'react';
import {TextField, Button, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper} from '@mui/material';
import { styled } from '@mui/system';

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const VremenskaPrognoza = () => {
  const [openForm, setOpenForm] = useState(false);
  const [noviPodaci, setNoviPodaci] = useState({
    datum: '',
    skijaliste: '',
    temperatura: 0,
    uvindex: 0,
    brzinavetra: 0,
    vlaznostvazduha: 0,
    padavine: '',
    pritisak: 0,
  });

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoviPodaci((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const dodajVremenskuPrognozu = async () => {
    try {
      const response = await fetch('http://localhost:5030/api/VremenskaPrognoza/DodajVremenskuPrognozu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...noviPodaci,
        }),
      });

      if (response.ok) {
        console.log('Vremenska prognoza uspešno dodata');
        setOpenForm(false);
      } else {
        console.error('Greška pri dodavanju vremenske prognoze');
      }
    } catch (error) {
      console.error('Greška pri komunikaciji sa serverom', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Vremenska Prognoza</Typography>

      <Button variant="contained" style={{ backgroundColor: '#164863', color: 'white' }} onClick={handleOpenForm}>
        Dodaj vremensku prognozu
      </Button>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Dodaj vremensku prognozu</DialogTitle>
        <DialogContent>
          <StyledForm>
            <TextField
              label="Skijalište"
              fullWidth
              variant="outlined"
              name="skijaliste"
              value={noviPodaci.skijaliste}
              onChange={handleInputChange}
            />
            <TextField
              label="Datum"
              fullWidth
              variant="outlined"
              name="datum"
              value={noviPodaci.datum}
              onChange={handleInputChange}
            />
            <TextField
              label="Temperatura (°C)"
              type="number"
              fullWidth
              variant="outlined"
              name="temperatura"
              value={noviPodaci.temperatura}
              onChange={handleInputChange}
            />
            <TextField
              label="UV Index"
              type="number"
              fullWidth
              variant="outlined"
              name="uvindex"
              value={noviPodaci.uvindex}
              onChange={handleInputChange}
            />
            <TextField
              label="Brzina Vetra (m/s)"
              type="number"
              fullWidth
              variant="outlined"
              name="brzinavetra"
              value={noviPodaci.brzinavetra}
              onChange={handleInputChange}
            />
            <TextField
              label="Vlažnost Vazduha (%)"
              type="number"
              fullWidth
              variant="outlined"
              name="vlaznostvazduha"
              value={noviPodaci.vlaznostvazduha}
              onChange={handleInputChange}
            />
            <TextField
              label="Padavine"
              fullWidth
              variant="outlined"
              name="padavine"
              value={noviPodaci.padavine}
              onChange={handleInputChange}
            />
            <TextField
              label="Pritisak (hPa)"
              type="number"
              fullWidth
              variant="outlined"
              name="pritisak"
              value={noviPodaci.pritisak}
              onChange={handleInputChange}
            />
          </StyledForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Otkaži</Button>
          <Button onClick={dodajVremenskuPrognozu}>Dodaj</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VremenskaPrognoza;
