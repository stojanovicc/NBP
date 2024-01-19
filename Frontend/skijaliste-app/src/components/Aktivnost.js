import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CardActions,
} from '@mui/material';

const Aktivnost = () => {
  const [aktivnosti, setAktivnosti] = useState([]);
  const [skijalisteNaziv, setSkijalisteNaziv] = useState('');

  useEffect(() => {
    if (skijalisteNaziv) {
      const encodedSkijalisteNaziv = encodeURIComponent(skijalisteNaziv);
      const url = `http://localhost:5030/api/Aktivnosti/PreuzmiAktivnostiNaSkijalistu?skijaliste_naziv=${encodedSkijalisteNaziv}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setAktivnosti(data))
        .catch(error => console.error('Došlo je do greške pri preuzimanju aktivnosti:', error));
    }
  }, [skijalisteNaziv]);

  return (
    <div>
      <TextField
        label="Unesite naziv skijališta"
        variant="outlined"
        margin="normal"
        fullWidth
        value={skijalisteNaziv}
        onChange={(e) => setSkijalisteNaziv(e.target.value)}
      />

      <Grid container spacing={2}>
        {aktivnosti.map((aktivnost, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {aktivnost.naziv}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {aktivnost.opis}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {aktivnost.cena}
                </Typography>
              </CardContent>
              <CardActions>
                
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Aktivnost;
