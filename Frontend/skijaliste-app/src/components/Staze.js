import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';

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
  const [openFormDodaj, setOpenFormDodaj] = useState(false);
  const [novaAktivnost, setNovaAktivnost] = useState({
    naziv: '',
    opis: '',
    cena: 0,
    skijaliste: {
      naziv: naziv,
      lokacija: '', 
    },
  });

  const handleOpenFormDodaj = () => {
    setOpenFormDodaj(true);
  };
  
  const handleCloseFormDodaj = () => {
    setOpenFormDodaj(false);
    setNovaAktivnost({
      naziv: '',
      opis: '',
      cena: 0,
      skijaliste: {
        naziv: naziv,
        lokacija: '', 
      },
    });
  };
  
  // const handleDodajAktivnost = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5030/api/Aktivnosti/DodajAktivnost', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(novaAktivnost),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Greška prilikom dodavanja nove aktivnosti.');
  //     }
  
  //     fetchAktivnosti();
  //     handleCloseFormDodaj();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleDodajAktivnost = async () => {
    try {
      const lokacijaSkijalista = await getLokacijaSkijalista(naziv);
      console.log('Lokacija skijališta:', lokacijaSkijalista);
  
      const novaAktivnostSaLokacijom = {
        ...novaAktivnost,
        skijaliste: {
          naziv: naziv,
          lokacija: lokacijaSkijalista,
        },
      };
      console.log('Nova aktivnost sa lokacijom:', novaAktivnostSaLokacijom);
  
      const response = await fetch('http://localhost:5030/api/Aktivnosti/DodajAktivnost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaAktivnostSaLokacijom),
      });
  
      if (!response.ok) {
        throw new Error('Greška prilikom dodavanja nove aktivnosti.');
      }
  
      fetchAktivnosti();
      handleCloseFormDodaj();
    } catch (error) {
      console.error(error);
    }
  };
  
  const [editAktivnost, setEditAktivnost] = useState(null);
  const [openFormIzmeni, setOpenFormIzmeni] = useState(false);
  
  const handleOpenFormIzmeni = (aktivnost) => {
    setEditAktivnost({
      naziv: aktivnost.naziv,
      opis: aktivnost.opis,
      cena: aktivnost.cena,
    });
    setOpenFormIzmeni(true);
  };
  
  const handleCloseFormIzmeni = () => {
    setOpenFormIzmeni(false);
    setEditAktivnost(null);
  };
  
  const handleIzmeniAktivnost = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Aktivnosti/AzurirajAktivnost?naziv=${editAktivnost.naziv}&skijaliste=${naziv}&opis=${editAktivnost.opis}&cena=${editAktivnost.cena}`,
        {
          method: 'PUT',
        }
      );
  
      if (!response.ok) {
        throw new Error('Greška prilikom ažuriranja aktivnosti.');
      }
  
      fetchAktivnosti();
      handleCloseFormIzmeni();
    } catch (error) {
      console.error(error);
    }
  };

  const [aktivnosti, setAktivnosti] = useState([]);
  const [loadingAktivnosti, setLoadingAktivnosti] = useState(true);

  // Funkcija za preuzimanje aktivnosti na skijalištu
  const fetchAktivnosti = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Aktivnosti/PreuzmiAktivnostiNaSkijalistu?skijaliste_naziv=${naziv}`
      );
      if (!response.ok) {
        throw new Error('Greška prilikom preuzimanja aktivnosti.');
      }

      const data = await response.json();
      setAktivnosti(data);
      setLoadingAktivnosti(false);
    } catch (error) {
      console.error(error);
      setLoadingAktivnosti(false);
    }
  };

  useEffect(() => {
    fetchAktivnosti();
  }, [naziv]);


  const navigate = useNavigate();

  const handleVremenskaPrognozaClick = () => {
    navigate(`/Skijaliste/${naziv}/VremenskaPrognoza`);
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
      setSelectedTabIndex(0); // Reset selected tab index
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

  const handleObrisiAktivnost = async (nazivAktivnosti) => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Aktivnosti/ObrisiAktivnost?naziv=${nazivAktivnosti}&skijaliste_naziv=${naziv}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Greška prilikom brisanja aktivnosti.');
      }
      fetchAktivnosti();
    } catch (error) {
      console.error(error);
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
        lokacija: '', // Ako imate informaciju o lokaciji, popunite je ovde
      },
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditStaza(null); // Clear editStaza state when closing the form
  };

  // const handleDodajStazu = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5030/api/Staza/DodajStazu', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(novaStaza),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Greška prilikom dodavanja nove staze.');
  //     }

  //     fetchStaze();
  //     handleCloseForm();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
      <Divider variant="fullWidth" sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Staze za skijalište: {naziv}</Divider>
      </Typography>

      

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
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleObrisiStazu(staza.properties.naziv)}
                    sx={{ mt: 2, mr: 2 }}
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
                    sx={{ mt: 2 }}
                  >
                    Izmeni
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Button variant="outlined" color="primary" onClick={handleOpenForm} sx={{ mb: 2, marginTop: '30px', marginRight: '20px' }}>
        Dodaj stazu
      </Button>
      <Button variant="outlined" color="primary" onClick={handleOpenRecommendationForm} sx={{ mb: 2 , marginTop: '30px', marginRight: '20px' }}>
        Preporuka staza
      </Button>
      <Button variant="outlined" color="primary" onClick={handleVremenskaPrognozaClick} sx={{ mb: 2, marginTop: '30px', marginRight: '20px' }}>
        Vremenska prognoza
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpenFormDodaj}
        sx={{ mb: 2, marginTop: '30px', marginRight: '20px' }}
      >
        Dodaj aktivnost
      </Button>
     
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
      
      
      <Divider variant="fullWidth" sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Aktivnosti na skijalištu: {naziv}</Divider>
      </Typography>

      {loadingAktivnosti ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {aktivnosti.map((aktivnost) => (
            <Grid item key={aktivnost.id} xs={12} sm={6} md={4} lg={3}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {aktivnost.naziv}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Opis aktivnsoti: {aktivnost.opis}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Cena aktivnsoti: {aktivnost.cena}
                  </Typography>
                  
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleObrisiAktivnost(aktivnost.naziv);
                      setAktivnosti((prevAktivnosti) =>
                        prevAktivnosti.filter((a) => a.naziv !== aktivnost.naziv)
                      );
                    }}
                  >
                    Obriši
                  </Button>

                  <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenFormIzmeni(aktivnost)}
                >
                 
                  Izmeni
                </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/*  */}

      <Dialog open={openFormDodaj} onClose={handleCloseFormDodaj}>
      <DialogTitle>Dodaj novu aktivnost</DialogTitle>
      <DialogContent>
        <TextField
          label="Naziv aktivnosti"
          value={novaAktivnost.naziv}
          onChange={(e) => setNovaAktivnost({ ...novaAktivnost, naziv: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Opis aktivnosti"
          value={novaAktivnost.opis}
          onChange={(e) => setNovaAktivnost({ ...novaAktivnost, opis: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cena"
          type="number"
          value={novaAktivnost.cena}
          onChange={(e) => setNovaAktivnost({ ...novaAktivnost, cena: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFormDodaj} color="secondary">
          Odustani
        </Button>
        <Button onClick={handleDodajAktivnost} color="primary">
          Dodaj aktivnost
        </Button>
      </DialogActions>
    </Dialog>

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
            disabled={editStaza !== null} // Disable if editing an existing staza
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

   

    <Dialog open={openFormIzmeni} onClose={handleCloseFormIzmeni}>
    <DialogTitle>Izmeni podatke o aktivnosti</DialogTitle>
    <DialogContent>
      <TextField
        label="Naziv aktivnosti"
        value={editAktivnost ? editAktivnost.naziv : ''}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Opis aktivnosti"
        value={editAktivnost ? editAktivnost.opis : ''}
        onChange={(e) => setEditAktivnost({ ...editAktivnost, opis: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cena"
        type="number"
        value={editAktivnost ? editAktivnost.cena : 0}
        onChange={(e) => setEditAktivnost({ ...editAktivnost, cena: e.target.value })}
        fullWidth
        margin="normal"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseFormIzmeni} color="secondary">
        Odustani
      </Button>
      <Button onClick={handleIzmeniAktivnost} color="primary">
        Izmeni aktivnost
      </Button>
    </DialogActions>
  </Dialog>
    </div>
  );
};

export default Staze;
