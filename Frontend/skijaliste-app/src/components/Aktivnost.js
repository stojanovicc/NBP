import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Typography, Card, CardContent, CardActions, CircularProgress, Grid, Divider, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Tabs, Tab, Box} from '@mui/material';

const Aktivnosti = () => {
  const { naziv } = useParams();
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

  return (
    <div>
      <Divider variant="fullWidth" sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Dodajte aktivnosti na skijaliste: {naziv}</Divider>
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpenFormDodaj}
          sx={{ mb: 2 }}
        >
          Dodaj aktivnost
        </Button>
      </Box>
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

export default Aktivnosti;