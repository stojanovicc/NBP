import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Typography, Card, CardContent, CardActions, CircularProgress, Grid, Divider, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Tabs, Tab,} from '@mui/material';

const Staze = () => {
  const { naziv } = useParams();
  const [staze, setStaze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [novaStaza, setNovaStaza] = useState({
    naziv: '',
    tezina: '',
    duzina: 0,
    skijaliste: {
      naziv: '',
      lokacija: '',
    },
  });
  const navigate = useNavigate();

  const handleVremenskaPrognozaClick = () => {
    navigate(`/Skijaliste/${naziv}/VremenskaPrognoza`);
  };
  const handleAktivnostiClick = () => {
    navigate(`/Skijaliste/${naziv}/Aktivnosti`);
  };
  const handleObavestenjaClick = () => {
    navigate(`/Skijaliste/${naziv}/Obavestenja`);
  };
  const handleRecenzijeClick = (nazivStaze) => {
    const recenzijePath = `/Skijaliste/${naziv}/${nazivStaze}/Recenzije`;
    navigate(recenzijePath);
  };

  const [openRecommendationForm, setOpenRecommendationForm] = useState(false);
  const [skiingLevel, setSkiingLevel] = useState('');
  const [recommendedStaze, setRecommendedStaze] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleOpenRecommendationForm = () => {
    setOpenRecommendationForm(true);
  };

  const handleCloseRecommendationForm = () => {
    setOpenRecommendationForm(false);
    setSkiingLevel('');
  };

  const handleRecommendStaze = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Skijaliste/PreporukaStaza?nazivSkijalista=${naziv}&skiingLevel=${skiingLevel}`
      );

      if (!response.ok) {
        throw new Error('Greška prilikom preporuke staza.');
      }

      const data = await response.json();
      console.log('Recommended Staze:', data);

      setRecommendedStaze(data);
      setSelectedTabIndex(0);
      handleCloseRecommendationForm();
    } catch (error) {
      console.error(error);
    }
  };

  const [editStaza, setEditStaza] = useState(null);

  const fetchStaze = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Skijaliste/PreuzmiStazeSkijalista?nazivSkijalista=${naziv}`
      );
      if (!response.ok) {
        throw new Error('Greška prilikom preuzimanja staza.');
      }

      const data = await response.json();
      setStaze(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaze();
  }, [naziv]);

  const handleObrisiStazu = async (nazivStaze) => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Staza/ObrisiStazu?naziv=${nazivStaze}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Greška prilikom brisanja staze.');
      }

      fetchStaze();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenForm = () => {
    setNovaStaza({
      ...novaStaza,
      skijaliste: {
        naziv: naziv,
        lokacija: '',
      },
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditStaza(null);
  };

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
  
  const handleDodajStazu = async () => {
    try {
      const lokacijaSkijalista = await getLokacijaSkijalista(naziv);
      console.log('Lokacija skijališta:', lokacijaSkijalista);
  
      const novaStazaSaLokacijom = {
        ...novaStaza,
        skijaliste: {
          naziv: naziv,
          lokacija: lokacijaSkijalista,
        },
      };
      console.log('Nova staza sa lokacijom:', novaStazaSaLokacijom);
  
      const response = await fetch('http://localhost:5030/api/Staza/DodajStazu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaStazaSaLokacijom),
      });
  
      if (!response.ok) {
        throw new Error('Greška prilikom dodavanja nove staze.');
      }
  
      fetchStaze();
      handleCloseForm();
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleIzmeniStazu = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Staza/AzurirajStazu?naziv=${editStaza.naziv}&tezina=${editStaza.tezina}&duzina=${editStaza.duzina}`,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        throw new Error('Greška prilikom ažuriranja staze.');
      }

      fetchStaze();
      handleCloseForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Typography variant="h6" sx={{ marginTop: '30px' }} gutterBottom>
        <Divider>Staze za skijalište: {naziv}</Divider>
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '100px' }}>
      <Button variant="outlined" color="primary" onClick={handleOpenForm} sx={{ mb: 2, color:'#164863' }}>
        Dodaj stazu
      </Button>
      <Button variant="outlined" color="primary" onClick={handleOpenRecommendationForm} sx={{ mb: 2, color:'#164863' }}>
        Preporuka staza
      </Button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {staze.map((staza) => (
            <Grid item key={staza.id} xs={12} sm={6} md={4} lg={3}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {staza.properties.naziv}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Težina staze: {staza.properties.tezina}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Dužina staze: {staza.properties.duzina} metara
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleObrisiStazu(staza.properties.naziv)}
                    sx={{ mr: 2 }}
                  >
                    Obriši
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setEditStaza({
                        naziv: staza.properties.naziv,
                        tezina: staza.properties.tezina,
                        duzina: staza.properties.duzina,
                      });
                      setOpenForm(true);
                    }}
                    sx={{ mr: 2 }}
                  >
                    Izmeni
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleRecenzijeClick(staza.properties.naziv)}
                  >
                    Recenzije
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openRecommendationForm} onClose={handleCloseRecommendationForm}>
        <DialogTitle>Preporuka staza</DialogTitle>
        <DialogContent>
          <TextField label="Naziv skijališta" value={naziv} fullWidth margin="normal" disabled />
          <TextField
            label="Nivo skijanja"
            value={skiingLevel}
            onChange={(e) => setSkiingLevel(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecommendationForm} color="secondary">
            Odustani
          </Button>
          <Button onClick={handleRecommendStaze} color="primary">
            Preporuči staze
          </Button>
        </DialogActions>
      </Dialog>
      {recommendedStaze.length > 0 && (
        <div>
          <Divider variant="fullWidth" sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
            <Divider>Preporučene staze</Divider>
          </Typography>

          <Tabs
            value={selectedTabIndex}
            onChange={(event, newValue) => setSelectedTabIndex(newValue)}
            indicatorColor="primary"
            textColor="primary"
            sx={{ marginBottom: 2 }}
          >
            {recommendedStaze.map((staza, index) => (
              <Tab key={index} label={`Staza ${index + 1}`} />
            ))}
          </Tabs>

          {recommendedStaze.map((staza, index) => (
            <div key={index} hidden={selectedTabIndex !== index}>
              <Card elevation={3} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="body2">
                    Naziv staze: {staza.properties.naziv}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Težina staze: {staza.properties.tezina}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Dužina staze: {staza.properties.duzina} metara
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
      
    <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{editStaza ? 'Izmeni stazu' : 'Dodaj novu stazu'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Naziv staze"
            value={editStaza ? editStaza.naziv : novaStaza.naziv}
            onChange={(e) =>
              editStaza
                ? setEditStaza({ ...editStaza, naziv: e.target.value })
                : setNovaStaza({ ...novaStaza, naziv: e.target.value })
            }
            fullWidth
            margin="normal"
            disabled={editStaza !== null}
          />
          <TextField
            label="Težina staze"
            value={editStaza ? editStaza.tezina : novaStaza.tezina}
            onChange={(e) =>
              editStaza
                ? setEditStaza({ ...editStaza, tezina: e.target.value })
                : setNovaStaza({ ...novaStaza, tezina: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Dužina staze"
            type="number"
            value={editStaza ? editStaza.duzina : novaStaza.duzina}
            onChange={(e) =>
              editStaza
                ? setEditStaza({ ...editStaza, duzina: e.target.value })
                : setNovaStaza({ ...novaStaza, duzina: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Odustani
          </Button>
          <Button onClick={editStaza ? handleIzmeniStazu : handleDodajStazu} color="primary">
            {editStaza ? 'Izmeni stazu' : 'Dodaj stazu'}
          </Button>
        </DialogActions>
      </Dialog>
      <Divider variant="fullWidth" sx={{ mb: 5 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', borderRight: '1px solid #ccc' }}>
          <Typography variant="h9" sx={{ marginY: '35px', color: '#164863' }}>
            <Divider  style={{ fontWeight: 'bold', color: '#BF3131' }}>Želite da pratite vremensku prognozu?</Divider>
            <Divider>Kliknite na dugme</Divider>
          </Typography>
          <Button
            variant="contained"
            onClick={handleVremenskaPrognozaClick}
            sx={{ mb: 2, display: 'block', margin: '0 auto', fontSize: '12px', fontWeight: 'bold', backgroundColor:"#427D9D"  }}
          >
            Vremenska prognoza
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', borderRight: '1px solid #ccc' }}>
          <Typography variant="h9" sx={{ marginY: '25px', color: '#164863' }}>
            <Divider style={{ fontWeight: 'bold', color: '#BF3131' }}>Želite da vidite aktuelne aktivnosti?</Divider>
            <Divider>Kliknite na dugme</Divider>
          </Typography>
          <Button
            variant="contained"
            onClick={handleAktivnostiClick}
            sx={{ mb: 2, display: 'block', margin: '0 auto', fontSize: '12px' , backgroundColor:"#427D9D" }}
          >
            Aktivnosti
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h9" sx={{ marginY: '25px', color: '#164863' }}>
            <Divider style={{ fontWeight: 'bold', color: '#BF3131' }}>Želite da čitate obaveštenja?</Divider>
            <Divider>Kliknite na dugme</Divider>
          </Typography>
          <Button
            variant="contained"
            onClick={handleObavestenjaClick}
            sx={{ mb: 2, display: 'block', margin: '0 auto', fontSize: '12px', backgroundColor:"#427D9D" }}
          >
            Obaveštenja
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Staze;