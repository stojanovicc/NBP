import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import {
  Event,
  WbSunny,
  Opacity,
  Cloud,
  Speed,
  Air,
  Delete,
} from '@mui/icons-material';

const VremenskaPrognoza = () => {
  const [vremenskaPrognoza, setVremenskaPrognoza] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [prethodnePrognoze, setPrethodnePrognoze] = useState(() => {
    const storedPrognoze = localStorage.getItem('prethodnePrognoze');
    return storedPrognoze ? JSON.parse(storedPrognoze) : [];
  });

  //dodavnaje
  const [novaVremenska, setnovaVremenska] = useState({
    datum: '',
    temperatura: 0,
    uvIndex: 0,
    brzinaVetra: 0,
    vlaznostVazduha: 0,
    padavine: '',
    pritisak: 0,
    skijaliste: {
      naziv: '',
      lokacija: '',
    },
  });

  const handleOpenForm = () => {
    setnovaVremenska({
      ...novaVremenska,
      skijaliste: {
        naziv: '',
        lokacija: '', 
      },
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleDodajVremensku = async () => {
    try {
      const response = await fetch('http://localhost:5030/api/VremenskaPrognoza/DodajVremenskuPrognozu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaVremenska),
      });

      if (!response.ok) {
        throw new Error('Greška prilikom dodavanja nove staze.');
      }

      handleCloseForm();
    } catch (error) {
      console.error(error);
    }
  };

  const [skijaliste, setSkijaliste] = useState('');
  const [datum, setDatum] = useState('');

  useEffect(() => {
    localStorage.setItem('prethodnePrognoze', JSON.stringify(prethodnePrognoze));
  }, [prethodnePrognoze]);

  const handlePrikaziClick = () => {
    setPrikaziFormu(true);
  };

  const handlePreuzmiPrognozuClick = () => {
    if (skijaliste && datum) {
      const url = `http://localhost:5030/api/VremenskaPrognoza/PreuzmiVremenskuPrognozuNaSkijalistu?skijaliste=${skijaliste}&datum=${datum}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setPrethodnePrognoze(prevPrognoze => [...prevPrognoze, data]);
          setVremenskaPrognoza(data);
          setPrikaziFormu(false);
        })
        .catch(error => {
          console.error('Došlo je do greške pri preuzimanju vremenske prognoze:', error);
        });
    } else {
      alert('Molimo unesite skijalište i datum.');
    }
  };

  const handleObrisiClick = (skiResort, date) => {
    const deleteUrl = `http://localhost:5030/api/VremenskaPrognoza/ObrisiVremenskuPrognozu?skijaliste=${skiResort}&datum=${date}`;

    fetch(deleteUrl, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setPrethodnePrognoze(prevPrognoze =>
          prevPrognoze.filter(prognoza => !(prognoza.skijaliste === skiResort && prognoza.datum === date))
        );
      })
      .catch(error => {
        console.error('Došlo je do greške pri brisanju vremenske prognoze:', error);
      });
  };

  return (
    <>
      <Card style={{ maxWidth: 600, margin: 'auto', marginTop: 20 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Vremenska Prognoza
          </Typography>

          {!prikaziFormu && (
            <Button variant="contained" onClick={handlePrikaziClick} fullWidth>
              PRIKAŽI VREMENSKU PROGNOZU
            </Button>
          )}

          {prikaziFormu && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Skijalište"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={skijaliste}
                  onChange={(e) => setSkijaliste(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Datum"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handlePreuzmiPrognozuClick} fullWidth>
                  Preuzmi prognozu
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => setPrikaziFormu(false)} fullWidth>
                  Zatvori formu
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "10px"}}>
      {!openForm && (
        
        <Button color="error" variant="outlined" onClick={handleOpenForm}>
          <Divider>DODAJ VREMENSKU PROGNOZU</Divider>
        </Button>
        
        
      )}
    </div>


      {openForm && (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Datum"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.datum}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, datum: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Temperatura"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.temperatura}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, temperatura: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="UV Index"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.uvIndex}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, uvIndex: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Brzina Vetra"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.brzinaVetra}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, brzinaVetra: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vlažnost Vazduha"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.vlaznostVazduha}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, vlaznostVazduha: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Padavine"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.padavine}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, padavine: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pritisak"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.pritisak}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, pritisak: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Skijalište Naziv"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.skijaliste.naziv}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, skijaliste: { ...novaVremenska.skijaliste, naziv: e.target.value } })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Skijalište Lokacija"
              variant="outlined"
              fullWidth
              margin="normal"
              value={novaVremenska.skijaliste.lokacija}
              onChange={(e) => setnovaVremenska({ ...novaVremenska, skijaliste: { ...novaVremenska.skijaliste, lokacija: e.target.value } })}
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleDodajVremensku} fullWidth>
          DODAJ VREMENSKU PROGNOZU
        </Button>
      </>
    )}


      {prethodnePrognoze.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Typography variant="body1" gutterBottom>
            <Divider>Vremenske prognoze</Divider>
          </Typography>
          <Grid container spacing={2}>
            {prethodnePrognoze.map((prognoza, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <Card style={{ marginBottom: 10 }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      <Event fontSize="small" /> Datum: {prognoza.datum}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <WbSunny fontSize="small" /> UV Index: {prognoza.uvIndex}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <Opacity fontSize="small" /> Vlažnost vazduha: {prognoza.vlaznostVazduha}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <AcUnitIcon  fontSize="small" /> Temperatura: {prognoza.temperatura}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <Cloud fontSize="small" /> Padavine: {prognoza.padavine}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <Speed fontSize="small" /> Brzina vetra: {prognoza.brzinaVetra}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <Air fontSize="small" /> Pritisak: {prognoza.pritisak}
                    </Typography>
                    <IconButton
                      color="secondary"
                      onClick={() => handleObrisiClick(prognoza.skijaliste, prognoza.datum)}
                    >
                      <Delete />
                    </IconButton>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      
    </>

    
  );
};

export default VremenskaPrognoza;
