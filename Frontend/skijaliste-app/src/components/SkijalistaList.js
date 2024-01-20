import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Paper, Button, TextField, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SkijalistaList = () => {
  const [skijalista, setSkijalista] = useState([]);
  const [formData, setFormData] = useState({ naziv: '', lokacija: '' });
  const [editFormData, setEditFormData] = useState({ naziv: '', lokacija: '' });
  const [isEditing, setIsEditing] = useState(false);
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
    if (isEditing) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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
        fetchData();
        setFormData({ naziv: '', lokacija: '' });
      } else {
        console.error('Error adding skijalište:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding skijalište:', error);
    }
  };

  const handleObrisiClick = async (skijalisteNaziv) => {
    try {
      const response = await fetch(`http://localhost:5030/api/Skijaliste/ObrisiSkijaliste?skijalisteNaziv=${skijalisteNaziv}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error('Error deleting skijalište:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting skijalište:', error);
    }
  };

  const handleIzmeniClick = (skijalisteNaziv, skijalisteLokacija) => {
    setEditFormData({ naziv: skijalisteNaziv, lokacija: skijalisteLokacija });
    setIsEditing(true);
  };

  const handleSacuvajIzmene = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/Skijaliste/AzurirajSkijaliste?naziv=${editFormData.naziv}&lokacija=${editFormData.lokacija}`,
        {
          method: 'PUT',
        }
      );

      if (response.ok) {
        fetchData();
        setEditFormData({ naziv: '', lokacija: '' });
        setIsEditing(false);
      } else {
        console.error('Error updating skijalište:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating skijalište:', error);
    }
  };
   
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {isEditing ? 'Izmeni skijalište' : 'Dodaj skijalište'}
            </Typography>
            <form>
              <TextField
                label="Naziv"
                name="naziv"
                value={isEditing ? editFormData.naziv : formData.naziv}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={isEditing}
              />
              <TextField
                label="Lokacija"
                name="lokacija"
                value={isEditing ? editFormData.lokacija : formData.lokacija}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                sx={{backgroundColor:'#427D9D'}}
                onClick={isEditing ? handleSacuvajIzmene : handleDodajClick}
              >
                {isEditing ? 'Sačuvaj izmene' : 'Dodaj'}
              </Button>
              <Typography variant="h4" sx={{ marginTop: '25px' }}>
              <Divider>Lista skijališta:</Divider>
            </Typography>
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
                  color="error"
                  onClick={() => handleObrisiClick(skijaliste.properties.naziv)}
                  sx={{ marginRight: '10px' }}
                >
                  Obriši
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleIzmeniClick(skijaliste.properties.naziv, skijaliste.properties.lokacija)}
                  sx={{ marginRight: '10px' }}
                >
                  Izmeni
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => navigate(`/Skijaliste/${skijaliste.properties.naziv}`)}
                >
                  Pregled skijališta
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