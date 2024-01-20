import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';

const Recenzije = () => {
  const [recenzije, setRecenzije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { nazivStaze, nazivSkijalista } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(null);

  const handleOpenEditForm = (index) => {
    setSelectedReviewIndex(index);
    setFormData({
      ...formData,
      korisnik: recenzije[index]?.recenzija.korisnik || '',
      komentar: recenzije[index]?.recenzija.komentar || '',
      ocena: recenzije[index]?.recenzija.ocena || 0,
    });
    setIsEditFormOpen(true);
  };
  


  const [formData, setFormData] = useState({
    korisnik: '',
    komentar: '',
    ocena: 0,
    staza: {
      naziv: '',
      tezina: '',
      duzina: 0,
      skijaliste: {
        naziv: '',
        lokacija: '',
      },
    },
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchRecenzije = async () => {
      try {
        const response = await fetch(`http://localhost:5030/api/Recenzija/PreuzmiRecenzijeStaze?nazivStaze=${nazivStaze}`);
        
        if (!response.ok) {
          throw new Error(`Greška prilikom preuzimanja recenzija. Status: ${response.status}`);
        }

        const data = await response.json();
        setRecenzije(data);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };

    fetchRecenzije();
  }, [nazivStaze]);

  const fetchRecenzije = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/Recenzija/PreuzmiRecenzijeStaze?nazivStaze=${nazivStaze}`);
      
      if (!response.ok) {
        throw new Error(`Greška prilikom preuzimanja recenzija. Status: ${response.status}`);
      }

      const data = await response.json();
      setRecenzije(data);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStazaInfo = async () => {
      try {
        const stazaResponse = await fetch(`http://localhost:5030/api/Staza/PreuzmiStazu?nazivStaze=${nazivStaze}`);
        const skijalisteResponse = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiSkijaliste?nazivSkijalista=${nazivSkijalista}`);

        if (!stazaResponse.ok || !skijalisteResponse.ok) {
          throw new Error(`Greška prilikom preuzimanja informacija o stazi ili skijalištu.`);
        }

        const stazaData = await stazaResponse.json();
        const skijalisteData = await skijalisteResponse.json();

        setFormData((prevData) => ({
          ...prevData,
          staza: {
            naziv: stazaData[0]?.properties.naziv || '',
            tezina: stazaData[0]?.properties.tezina || '',
            duzina: stazaData[0]?.properties.duzina || 0,
            skijaliste: {
              naziv: skijalisteData[0]?.properties.naziv || '',
              lokacija: skijalisteData[0]?.properties.lokacija || '',
            },
          },
        }));
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchStazaInfo();
  }, [nazivStaze, nazivSkijalista]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteReview = async (korisnik) => {
    try {
      const response = await fetch(`http://localhost:5030/api/Recenzija/ObrisiRecenziju?korisnik=${korisnik}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Greška prilikom brisanja recenzije. Status: ${response.status}`);
      }
      setRecenzije((prevRecenzije) => prevRecenzije.filter((recenzija) => recenzija.recenzija.korisnik !== korisnik));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleUpdateReview = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/Recenzija/AzurirajRecenziju?korisnik=${formData.korisnik}&komentar=${formData.komentar}&ocena=${formData.ocena}`, {
        method: 'PUT',
      });
  
      if (!response.ok) {
        throw new Error(`Greška prilikom ažuriranja recenzije. Status: ${response.status}`);
      }
  
      fetchRecenzije();
      setIsEditFormOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };
  

  const handleAddReview = async () => {
    try {
      const response = await fetch('http://localhost:5030/api/Recenzija/DodajRecenziju', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Greška prilikom dodavanja recenzije. Status: ${response.status}`);
      }
      fetchRecenzije();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <Divider variant="fullWidth" sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Recenzije za stazu: {nazivStaze}</Divider>
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Sve recenzije" />
          </Tabs>

          <Card>
            <CardContent>
              {tabValue === 0 ? (
                <List>
                  {recenzije.map((recenzija, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Grid container spacing={1}>
                            <Grid item xs={5}>
                            <Typography component="span" variant="body2" color="text.primary">
                                <StarIcon color="primary" />
                                Ocena: {recenzija.recenzija.ocena}
                            </Typography>
                            </Grid>
                            <Grid item xs={12}>
                            <Typography component="span" variant="body2" color="text.primary">
                                <CommentIcon color="primary" />
                                Komentar: {recenzija.recenzija.komentar}
                            </Typography>
                            </Grid>
                            <Grid item xs={12}>
                            <Typography component="span" variant="body2" color="text.primary">
                                <PersonIcon color="primary" />
                                Korisnik: {recenzija.recenzija.korisnik}
                            </Typography>
                            </Grid>
                            
                            <div style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '0px' }}>
                            <Button variant="outlined" color="secondary" onClick={() => handleDeleteReview(recenzije[0]?.recenzija.korisnik)}>
                                Obriši
                            </Button>
                            </div>
                            <div style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '0px' }}>
                            <Button variant="outlined" color="primary" onClick={() => handleOpenEditForm(index)}>
                                Izmeni
                            </Button>
                            </div>


                        </Grid>
                        </ListItem>

                      {index < recenzije.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <List>
                </List>
              )}
            </CardContent>
           
          </Card>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Button variant="outlined" color="primary" onClick={handleOpenForm}>
            Dodaj
        </Button>
        </div>

       {/* izmena */}
        <Dialog open={isEditFormOpen} onClose={() => setIsEditFormOpen(false)}>
        <DialogTitle>Izmeni recenziju</DialogTitle>
        <DialogContent>
            <TextField
            label="Komentar"
            name="komentar"
            value={formData.komentar}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            />
            <TextField
            label="Ocena"
            name="ocena"
            type="number"
            value={formData.ocena}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            />
            <Typography variant="body2">Informacije o stazi:</Typography>
            <Typography variant="body2">Naziv: {formData.staza.naziv}</Typography>
            <Typography variant="body2">Težina: {formData.staza.tezina}</Typography>
            <Typography variant="body2">Dužina: {formData.staza.duzina}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsEditFormOpen(false)} color="secondary">
            Otkaži
            </Button>
            <Button onClick={handleUpdateReview} color="primary">
            Sačuvaj izmene
            </Button>
        </DialogActions>
        </Dialog>




          {/* dodavanje */}
          <Dialog open={isFormOpen} onClose={handleCloseForm}>
            <DialogTitle>Dodaj recenziju</DialogTitle>
            <DialogContent>
              <TextField
                label="Korisnik"
                name="korisnik"
                value={formData.korisnik}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Komentar"
                name="komentar"
                value={formData.komentar}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ocena"
                name="ocena"
                type="number"
                value={formData.ocena}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
            <Typography variant="body2">Detalji o stazi:</Typography>
            <Typography variant="body2"><strong>Naziv staze:</strong> {formData.staza.naziv}</Typography>
            <Typography variant="body2"><strong>Težina staze:</strong> {formData.staza.tezina}</Typography>
            <Typography variant="body2"><strong>Dužina staze:</strong> {formData.staza.duzina} metara</Typography>
            

            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">
                Otkaži
              </Button>
              <Button onClick={handleAddReview} color="primary">
                Dodaj recenziju
              </Button>
            </DialogActions>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Recenzije;
