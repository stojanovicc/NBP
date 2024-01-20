import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Box, Typography, Card, CardContent, CardActions, CircularProgress, Grid, Divider, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Tabs, Tab,} from '@mui/material';

const Obavestenja = () => {
  const { naziv } = useParams();
  const [openFormDodaj, setOpenFormDodaj] = useState(false);
  const [novoObavestenje, setNovoObavestenje] = useState({
    naslov: '',
    sadrzaj: '',
    datumObjave: '',
    status: '',
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
    setNovoObavestenje({
      naslov: '',
      sadrzaj: '',
      datumObjave: '',
      status: '',
      skijaliste: {
        naziv: naziv,
        lokacija: '', 
      },
    });
  };
  
  const handleDodajObavestenje = async () => {
    try {
      const lokacijaSkijalista = await getLokacijaSkijalista(naziv);
      console.log('Lokacija skijališta:', lokacijaSkijalista);
  
      const novoObavestenjeSaLokacijom = {
        ...novoObavestenje,
        skijaliste: {
          naziv: naziv,
          lokacija: lokacijaSkijalista,
        },
      };
      console.log('Novo obavestenje sa lokacijom:', novoObavestenjeSaLokacijom);
  
      const response = await fetch('http://localhost:5030/api/Obavestenja/DodajObavestenje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoObavestenjeSaLokacijom),
      });
  
      if (!response.ok) {
        throw new Error('Greška prilikom dodavanja nove aktivnosti.');
      }
  
      fetchObavestenja();
      handleCloseFormDodaj();
    } catch (error) {
      console.error(error);
    }
  };
  
  const [editObavestenje, setEditObavestenje] = useState(null);
  const [openFormIzmeni, setOpenFormIzmeni] = useState(false);
  
  const handleOpenFormIzmeni = (obavestenje) => {
    setEditObavestenje({
      naslov: obavestenje.naslov,
      sadrzaj: obavestenje.sadrzaj,
      datumObjave: obavestenje.datumObjave,
      status: obavestenje.status
    });
    setOpenFormIzmeni(true);
  };
  
  const handleCloseFormIzmeni = () => {
    setOpenFormIzmeni(false);
    setEditObavestenje(null);
  };
  
  const handleIzmeniObavestenje = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Obavestenja/AzurirajObavestenje?naslov=${editObavestenje.naslov}&skijaliste=${naziv}&sadrzaj=${editObavestenje.sadrzaj}&datumObjave=${editObavestenje.datumObjave}&status=${editObavestenje.status}`,
        {
          method: 'PUT',
        }
      );
  
      if (!response.ok) {
        throw new Error('Greška prilikom ažuriranja obavestenja.');
      }
  
      fetchObavestenja();
      handleCloseFormIzmeni();
    } catch (error) {
      console.error(error);
    }
  };

  const [obavestenja, setObavestenja] = useState([]);
  const [loadingObavestenja, setLoadingObavestenja] = useState(true);

  const fetchObavestenja = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Obavestenja/PreuzmiObavestenjaNaSkijalistu?skijaliste_naziv=${naziv}`
      );

      if (!response.ok) {
        throw new Error('Greška prilikom preuzimanja obavestenja.');
      }

      const data = await response.json();
      setObavestenja(data);
      setLoadingObavestenja(false);
    } catch (error) {
      console.error(error);
      setLoadingObavestenja(false);
    }
  };

  useEffect(() => {
    fetchObavestenja();
  }, [naziv]);

  const handleObrisiObavestenje = async (naslovObavestenja) => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Obavestenja/ObrisiObavestenje?naslov=${naslovObavestenja}&skijaliste_naziv=${naziv}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Greška prilikom brisanja obavestenja.');
      }
      fetchObavestenja();
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
        <Divider>Dodajte obaveštenje na skijaliste: {naziv}</Divider>
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpenFormDodaj}
          sx={{ mb: 2 }}
        >
          Dodaj obaveštenje
        </Button>
      </Box>
      <Divider variant="fullWidth" sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Obaveštenja na skijalištu: {naziv}</Divider>
      </Typography>

      {loadingObavestenja ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {obavestenja.map((obavestenje) => (
            <Grid item key={obavestenje.id} xs={12} sm={6} md={4} lg={3}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {obavestenje.naslov}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Sadržaj: {obavestenje.sadrzaj}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Datum objave: {obavestenje.datumObjave}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Status: {obavestenje.status}
                  </Typography>                 
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleObrisiObavestenje(obavestenje.naslov);
                      setObavestenja((prevObavestenja) =>
                        prevObavestenja.filter((a) => a.naslov !== obavestenje.naslov)
                      );
                    }}
                  >
                    Obriši
                  </Button>
                  <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenFormIzmeni(obavestenje)}
                  >
                  Izmeni
                </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openFormDodaj} onClose={handleCloseFormDodaj}>
      <DialogTitle>Dodaj novo obaveštenje</DialogTitle>
      <DialogContent>
        <TextField
          label="Naslov"
          value={novoObavestenje.naslov}
          onChange={(e) => setNovoObavestenje({ ...novoObavestenje, naslov: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Sadržaj"
          value={novoObavestenje.sadrzaj}
          onChange={(e) => setNovoObavestenje({ ...novoObavestenje, sadrzaj: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Datum objave"
          value={novoObavestenje.datumObjave}
          onChange={(e) => setNovoObavestenje({ ...novoObavestenje, datumObjave: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Status"
          value={novoObavestenje.status}
          onChange={(e) => setNovoObavestenje({ ...novoObavestenje, status: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFormDodaj} color="secondary">
          Odustani
        </Button>
        <Button onClick={handleDodajObavestenje} color="primary">
          Dodaj obaveštenje
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openFormIzmeni} onClose={handleCloseFormIzmeni}>
    <DialogTitle>Izmeni obaveštenje</DialogTitle>
    <DialogContent>
      <TextField
        label="Naslov obaveštenja"
        value={editObavestenje ? editObavestenje.naslov : ''}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Sadržaj"
        value={editObavestenje ? editObavestenje.sadrzaj : ''}
        onChange={(e) => setEditObavestenje({ ...editObavestenje, sadrzaj: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Datum objave"
        value={editObavestenje ? editObavestenje.datumObjave : 0}
        onChange={(e) => setEditObavestenje({ ...editObavestenje, datumObjave: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Status"
        value={editObavestenje ? editObavestenje.status : 0}
        onChange={(e) => setEditObavestenje({ ...editObavestenje, status: e.target.value })}
        fullWidth
        margin="normal"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseFormIzmeni} color="secondary">
        Odustani
      </Button>
      <Button onClick={handleIzmeniObavestenje} color="primary">
        Izmeni aktivnost
      </Button>
    </DialogActions>
  </Dialog>
    </div>
  );
};

export default Obavestenja;