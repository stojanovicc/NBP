import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardContent, Divider, Grid, TextField, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { Event, WbSunny, Opacity, Cloud, Speed, Air, Delete, } from '@mui/icons-material';

const VremenskaPrognoza = () => {
  const { naziv } = useParams();
  const [vremenskaPrognoza, setVremenskaPrognoza] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [prethodnePrognoze, setPrethodnePrognoze] = useState(() => {
    const storedPrognoze = localStorage.getItem('prethodnePrognoze');
    return storedPrognoze ? JSON.parse(storedPrognoze) : [];
  });
  const [skijaliste, setSkijaliste] = useState(naziv);
  const [loadingVremenska, setLoadingVremenska] = useState(true);

  const getLokacijaSkijalista = async (nazivSkijalista) => {
    try {
      const response = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiSkijaliste?nazivSkijalista=${nazivSkijalista}`);
  
      if (!response.ok) {
        throw new Error('Greška prilikom dohvatanja informacija o skijalištu.');
      }
  
      const data = await response.json();
      
      console.log('Odgovor sa servera:', data);
      const prvaLokacija = data[0]?.properties?.lokacija;
  
      if (!prvaLokacija) {
        throw new Error('Lokacija skijališta nije dostupna u odgovoru.');
      }
  
      return prvaLokacija;
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do greške prilikom dohvatanja lokacije skijališta.');
    }
  };

  const [novaVremenska, setnovaVremenska] = useState({
    datum: '',
    temperatura: 0,
    uvIndex: 0,
    brzinaVetra: 0,
    vlaznostVazduha: 0,
    padavine: '',
    pritisak: 0,
    skijaliste: {
      naziv: naziv,
      lokacija: '',
    },
  });

  const handleOpenForm = async () => {
    try {
      const lokacijaSkijalista = await getLokacijaSkijalista(naziv);
      setnovaVremenska({
        ...novaVremenska,
        skijaliste: {
          naziv: naziv,
          lokacija: lokacijaSkijalista,
        },
      });
      setOpenForm(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleDodajVremensku = async () => {
    try {
      const lokacijaSkijalista = await getLokacijaSkijalista(naziv);
      console.log('Lokacija skijališta:', lokacijaSkijalista);
  
      const novaVremenskaSaLokacijom = {
        ...novaVremenska,
        skijaliste: {
          naziv: naziv,
          lokacija: lokacijaSkijalista,
        },
      };
      console.log('Nova vremenska sa lokacijom:', novaVremenskaSaLokacijom);
  
      const response = await fetch('http://localhost:5030/api/VremenskaPrognoza/DodajVremenskuPrognozu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaVremenskaSaLokacijom),
      });
  
      if (!response.ok) {
        throw new Error('Greška prilikom dodavanja nove vremenske.');
      }
  
      
      handleCloseForm();
    } catch (error) {
      console.error(error);
    }
  };

  const [editVremensku, setEditVremensku] = useState(null);
  const [openFormIzmeni, setOpenFormIzmeni] = useState(false);
  
  const handleOpenFormIzmeni = (vremenska) => {
    setEditVremensku({
      datum: vremenska.datum,
      temperatura: vremenska.temperatura,
      uvIndex: vremenska.uvIndex,
      brzinaVetra: vremenska.brzinaVetra,
      vlaznostVazduha: vremenska.vlaznostVazduha,
      padavine: vremenska.padavine,
      pritisak: vremenska.pritisak,
    });
    setOpenFormIzmeni(true);
  };
  
  const handleCloseFormIzmeni = () => {
    setOpenFormIzmeni(false);
    setEditVremensku(null);
  };
  
  const handleIzmeniVremensku = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/VremenskaPrognoza/AzurirajVremenskuPrognozu?skijaliste=${naziv}&datum=${editVremensku.datum}&temperatura=${editVremensku.temperatura}&uvindex=${editVremensku.uvIndex}&brzinavetra=${editVremensku.brzinaVetra}&vlaznostvazduha=${editVremensku.vlaznostVazduha}&padavine=${editVremensku.padavine}&pritisak=${editVremensku.pritisak}`,
        {
          method: 'PUT',
        }
      );
  
      if (!response.ok) {
        throw new Error('Greška prilikom ažuriranja vremenske.');
      }
  
      fetchVremenska();
      handleCloseFormIzmeni();
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchVremenska= async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Aktivnosti/PreuzmiAktivnostiNaSkijalistu?skijaliste_naziv=${naziv}`
      );
      if (!response.ok) {
        throw new Error('Greška prilikom preuzimanja vremenske.');
      }

      const data = await response.json();
      setVremenskaPrognoza(data);
      setLoadingVremenska(false);
    } catch (error) {
      console.error(error);
      setLoadingVremenska(false);
    }
  };

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
      <Card style={{ maxWidth: 600, margin: 'auto', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
        <CardContent>
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
          Vremenska prognoza za: {naziv}
        </Typography>

          {!prikaziFormu && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "10px"}}>
            <Button variant="contained" sx={{backgroundColor: "#427D9D"}} onClick={handlePrikaziClick} >
              PRIKAŽI VREMENSKU PROGNOZU
            </Button>
            </div>
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
                <Button variant="contained" sx={{backgroundColor: "#427D9D"}} onClick={handlePreuzmiPrognozuClick} fullWidth>
                  Preuzmi prognozu
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{backgroundColor: "#427D9D"}} onClick={() => setPrikaziFormu(false)} fullWidth>
                  Zatvori formu
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "10px"}}>
      {!openForm && (
        
        <Button variant="contained" sx={{backgroundColor: "#427D9D"}} onClick={handleOpenForm}>
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
        <Button variant="contained" sx={{backgroundColor: "#427D9D"}} onClick={handleDodajVremensku} fullWidth>
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
                      <Air fontSize="small" /> Brzina vetra: {prognoza.brzinaVetra}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <Speed fontSize="small" /> Pritisak: {prognoza.pritisak}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleObrisiClick(prognoza.skijaliste, prognoza.datum)}
                    >
                      <Delete />
                    </IconButton>

                    <IconButton
                      color="primary"
                      onClick={() => handleOpenFormIzmeni(prognoza)}
                    >
                      <EditIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog open={openFormIzmeni} onClose={handleCloseFormIzmeni}>
          <DialogTitle>Izmeni podatke o vremenskoj prognozi</DialogTitle>
          <DialogContent>
          <TextField
              label="Naziv skijalista"
              value={editVremensku ? editVremensku.naziv : ''}
              onChange={(e) => setEditVremensku({ ...editVremensku, naziv: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Datum"
              value={editVremensku ? editVremensku.datum : ''}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Temperatura"
              type="number"
              value={editVremensku ? editVremensku.temperatura : 0}
              onChange={(e) => setEditVremensku({ ...editVremensku, temperatura: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="UV index"
              type="number"
              value={editVremensku ? editVremensku.uvIndex : 0}
              onChange={(e) => setEditVremensku({ ...editVremensku, uvIndex: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Brzina vetra"
              type="number"
              value={editVremensku ? editVremensku.brzinaVetra : 0}
              onChange={(e) => setEditVremensku({ ...editVremensku, brzinaVetra: e.target.value })}
              fullWidth
              margin="normal"
            />
             <TextField
              label="Vlaznost vazduha"
              type="number"
              value={editVremensku ? editVremensku.vlaznostVazduha : 0}
              onChange={(e) => setEditVremensku({ ...editVremensku, vlaznostVazduha: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Padavine"
              value={editVremensku ? editVremensku.padavine : ''}
              onChange={(e) => setEditVremensku({ ...editVremensku, padavine: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Pritisak"
              type="number"
              value={editVremensku ? editVremensku.pritisak : 0}
              onChange={(e) => setEditVremensku({ ...editVremensku, pritisak: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFormIzmeni} color="secondary">
              Odustani
            </Button>
            <Button onClick={handleIzmeniVremensku} color="primary">
              Izmeni prognozu
            </Button>
          </DialogActions>
        </Dialog>
        </div>
      )}
    </>
  );
};

export default VremenskaPrognoza;