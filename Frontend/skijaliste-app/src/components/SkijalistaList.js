import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Paper, Button, TextField, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const SkijalistaList = () => {
  const [skijalista, setSkijalista] = useState([]);
  const [formData, setFormData] = useState({ naziv: '', lokacija: '' });
  const navigate = useNavigate(); 


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5030/api/Skijaliste/PreuzmiSkijalista');
      const data = await response.json();
      setSkijalista(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDodajClick = async () => {
    try {
      const response = await fetch('http://localhost:5030/api/Skijaliste/DodajSkijaliste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Ako je dodavanje uspešno, osveži listu skijališta
        fetchData();
        // Resetuj formu
        setFormData({ naziv: '', lokacija: '' });
      } else {
        console.error('Error adding skijalište:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding skijalište:', error);
    }
  };

  const handleObrisiClick = async (skijalisteId) => {
    try {
      const response = await fetch(`http://localhost:5030/api/Skijaliste/ObrisiSkijaliste?skijalisteId=${skijalisteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Ako je brisanje uspešno, osveži listu skijališta
        fetchData();
      } else {
        console.error('Error deleting skijalište:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting skijalište:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dodaj skijalište
            </Typography>
            <form>
              <TextField
                label="Naziv"
                name="naziv"
                value={formData.naziv}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Lokacija"
                name="lokacija"
                value={formData.lokacija}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleDodajClick}>
                Dodaj
              </Button>
            </form>
          </CardContent>
        </Paper>
      </Grid>

      {skijalista.length === 0 ? (
        <Grid item xs={12}>
          <Paper>
            <CardContent>
              <Typography variant="h6">Nema dostupnih skijališta.</Typography>
            </CardContent>
          </Paper>
        </Grid>
      ) : (
        skijalista.map((skijaliste, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {skijaliste.properties.naziv}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Lokacija: {skijaliste.properties.lokacija}
                </Typography>
                <Divider />

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleObrisiClick(skijaliste.id)}
                >
                  Obriši
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/Skijaliste/${skijaliste.id}`)}
                >
                  PREGLED SKIJALISTA
                </Button>


              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default SkijalistaList;


