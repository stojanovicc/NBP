// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import {
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Paper,
//   Button,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
// } from '@mui/material';

// const Staze = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [staze, setStaze] = useState([]);
//   const [aktivnosti, setAktivnosti] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openAktivnostDialog, setOpenAktivnostDialog] = useState(false);
//   const [novaStaza, setNovaStaza] = useState({ naziv: '', tezina: '', duzina: '' });
//   const [novaAktivnost, setNovaAktivnost] = useState({ naziv: '', opis: '' });
//   const [trenutnoSkijaliste, setTrenutnoSkijaliste] = useState({ naziv: 'N/A', lokacija: 'N/A' });
//   const [nazivSkijalista, setNazivSkijalista] = useState('');
//   //
//   const [showRecommendationForm, setShowRecommendationForm] = useState(false);
//   const [skiingLevel, setSkiingLevel] = useState('');
//   const [recommendedStaza, setRecommendedStaza] = useState(null);


// const handleOpenRecommendationForm = () => {
//   setShowRecommendationForm(true);
//   setRecommendedStaza(null); // Clear previous recommendation when opening the form
// };

// const handleCloseRecommendationForm = () => {
//   setShowRecommendationForm(false);
//   setSkiingLevel('');
// };

// const handleSkiingLevelChange = (e) => {
//   setSkiingLevel(e.target.value);
// };

// const handleRecommendStaza = async () => {
//   try {
//     const response = await fetch(
//       `http://localhost:5030/api/Skijaliste/PreporukaStaza?skijalisteId=${id}&skiingLevel=${skiingLevel}`
//     );

//     if (response.ok) {
//       const data = await response.json();
//       setRecommendedStaza(data[0]?.properties || null);
//       setShowRecommendationForm(false); // Hide the form after successful recommendation
//     } else {
//       console.error('Error fetching recommendation:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error fetching recommendation:', error);
//   }
// };


//   useEffect(() => {
//     fetchData();
//     fetchSkijalisteData();
//     fetchAktivnostiData();
//   }, [id]);

//   const fetchData = async () => {
//     try {
//       const response = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiStazeSkijalista?skijalisteId=${id}`);
//       if (!response.ok) {
//         throw new Error(`Error fetching data. Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setStaze(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const fetchSkijalisteData = async () => {
//     try {
//       const response = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiSkijaliste?skijalisteId=${id}`);
//       if (!response.ok) {
//         throw new Error(`Error fetching skijaliste data. Status: ${response.status}`);
//       }

//       const skijalisteData = await response.json();
//       const skijaliste = skijalisteData.find((sk) => sk.id === parseInt(id));

//       if (skijaliste) {
//         setTrenutnoSkijaliste({
//           naziv: skijaliste.properties.naziv || 'N/A',
//           lokacija: skijaliste.properties.lokacija || 'N/A',
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching skijaliste data:', error);
//     }
//   };

//   const fetchAktivnostiData = async () => {
//     try {
//       const response = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiAktivnostiSkijalista?skijalisteId=${id}`);
//       if (!response.ok) {
//         throw new Error(`Error fetching aktivnosti data. Status: ${response.status}`);
//       }

//       const aktivnostiData = await response.json();
//       setAktivnosti(aktivnostiData);
//     } catch (error) {
//       console.error('Error fetching aktivnosti data:', error);
//     }
//   };
// //

//   const handleOpenDialog = () => {
//     fetchSkijalisteData();
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleInputChange = (e) => {
//     setNovaStaza({ ...novaStaza, [e.target.name]: e.target.value });
//   };

//   const handleDodajStazu = async () => {
//     try {
//       const response = await fetch(`http://localhost:5030/api/Staza/DodajStazu`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...novaStaza,
//           skijaliste: {
//             naziv: trenutnoSkijaliste.naziv,
//             lokacija: trenutnoSkijaliste.lokacija,
//           },
//         }),
//       });

//       if (response.ok) {
//         console.log('Staza uspešno dodata');
//         fetchData();
//         handleCloseDialog();
//         setNovaStaza({ naziv: '', tezina: '', duzina: '' });
//       } else {
//         console.error('Error adding staza:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error adding staza:', error);
//     }
//   };

//   const handleObrisiStazu = async (stazaId) => {
//     try {
//       const response = await fetch(`http://localhost:5030/api/Staza/ObrisiStazu?stazaId=${stazaId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         console.log('Staza uspešno obrisana');
//         fetchData();
//       } else {
//         console.error('Error deleting staza:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error deleting staza:', error);
//     }
//   };

//   const handlePregledStaze = (stazaId) => {
//     navigate(`/Staza/${stazaId}`);
//   };

//   const handleObrisiAktivnost = async (aktivnostId) => {
//     try {
//       const response = await fetch(`http://localhost:5030/api/Aktivnosti/ObrisiAktivnost?aktivnostId=${aktivnostId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         console.log('Aktivnost uspešno obrisana');
//         fetchAktivnostiData();
//       } else {
//         console.error('Error deleting aktivnost:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error deleting aktivnost:', error);
//     }
//   };

//   const handleOpenAktivnostDialog = () => {
//     setOpenAktivnostDialog(true);
//   };

//   const handleCloseAktivnostDialog = () => {
//     setOpenAktivnostDialog(false);
//   };

//   const handleAktivnostInputChange = (e) => {
//     setNovaAktivnost({ ...novaAktivnost, [e.target.name]: e.target.value });
//   };

//   const handleDodajAktivnost = async () => {
//     try {
//       const response = await fetch(`http://localhost:5030/api/Aktivnosti/DodajAktivnost`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...novaAktivnost,
//           skijaliste: {
//             naziv: trenutnoSkijaliste.naziv,
//             lokacija: trenutnoSkijaliste.lokacija,
//           },
//         }),
//       });

//       if (response.ok) {
//         console.log('Aktivnost uspešno dodata');
//         fetchAktivnostiData();
//         handleCloseAktivnostDialog();
//         setNovaAktivnost({ naziv: '', opis: '' });
//       } else {
//         console.error('Error adding aktivnost:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error adding aktivnost:', error);
//     }
//   };

//   return (
//     <div>
//       <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
//         <Divider>Lista staza</Divider>
//       </Typography>
//       <Divider />
//       <List>
//         {staze.map((staza) => (
//           <Paper key={staza.id} elevation={3} style={{ margin: '10px 0', padding: '10px' }}>
//             <ListItem>
//               <ListItemText
//                 primary={staza.properties.naziv || 'N/A'}
//                 secondary={`Težina: ${staza.properties.tezina || 'N/A'}, Dužina: ${staza.properties.duzina || 'N/A'}`}
//               />
//               <Button variant="contained" color="secondary" onClick={() => handleObrisiStazu(staza.id)}>
//                 Obriši
//               </Button>
//               <Button variant="contained" color="primary" onClick={() => handlePregledStaze(staza.id)} style={{ marginLeft: '10px' }}>
//                 Pregled staze
//               </Button>
//             </ListItem>
//           </Paper>
//         ))}
//       </List>

//       <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginTop: '10px' }}>
//         Dodaj stazu
//       </Button>

//       <Button variant="contained" color="primary" onClick={handleOpenAktivnostDialog} style={{ marginTop: '10px', marginLeft: '10px' }}>
//         Dodaj aktivnost
//       </Button>

//       <Link to="/Skijalista">
//         <Button variant="contained" color="primary" style={{ marginTop: '10px', marginLeft: '10px' }}>
//           Nazad na listu skijališta
//         </Button>
//       </Link>

//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         {/* ... (existing staza dialog code) */}
//       </Dialog>

//       <Dialog open={openAktivnostDialog} onClose={handleCloseAktivnostDialog}>
//         <DialogTitle>Dodaj novu aktivnost</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Naziv aktivnosti"
//             name="naziv"
//             value={novaAktivnost.naziv}
//             onChange={handleAktivnostInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Opis"
//             name="opis"
//             value={novaAktivnost.opis}
//             onChange={handleAktivnostInputChange}
//             fullWidth
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseAktivnostDialog} color="primary">
//             Otkaži
//           </Button>
//           <Button onClick={handleDodajAktivnost} color="primary">
//             Dodaj
//           </Button>
//         </DialogActions>
//       </Dialog>

      
//     <Button variant="contained" color="primary" onClick={handleOpenRecommendationForm} style={{ marginTop: '10px' }}>
//       Preporuči mi stazu
//     </Button>

//     <Dialog open={showRecommendationForm} onClose={handleCloseRecommendationForm}>
//       <DialogTitle>Preporuči mi stazu</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Nivo skijanja"
//           name="skiingLevel"
//           value={skiingLevel}
//           onChange={handleSkiingLevelChange}
//           fullWidth
//           margin="normal"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleCloseRecommendationForm} color="primary">
//           Otkaži
//         </Button>
//         <Button onClick={handleRecommendStaza} color="primary">
//           Preporuči
//         </Button>
//       </DialogActions>
//     </Dialog>

//     {recommendedStaza && (
//       <div>
//         <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
//           <Divider>Preporučena staza</Divider>
//         </Typography>
//         <Divider />
//         <Paper elevation={3} style={{ margin: '10px 0', padding: '10px' }}>
//           <ListItemText
//             primary={recommendedStaza.naziv || 'N/A'}
//             secondary={`Težina: ${recommendedStaza.tezina || 'N/A'}, Dužina: ${recommendedStaza.duzina || 'N/A'}`}
//           />
//         </Paper>
//       </div>
//     )}


//       <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
//         <Divider>Lista aktivnosti</Divider>
//       </Typography>
//       <Divider />
//       <List>
//         {aktivnosti.map((aktivnost) => (
//           <Paper key={aktivnost.id} elevation={3} style={{ margin: '10px 0', padding: '10px' }}>
//             <ListItem>
//               <ListItemText
//                 primary={aktivnost.properties.naziv || 'N/A'}
//                 secondary={`Opis: ${aktivnost.properties.opis || 'N/A'}`}
//               />
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={() => handleObrisiAktivnost(aktivnost.id)}
//                 style={{ marginLeft: '10px' }}
//               >
//                 Obriši
//               </Button>
//             </ListItem>
//           </Paper>
//         ))}
//       </List>
//     </div>
//   );
// };

// export default Staze;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
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
        lokacija: '', // Ako imate informaciju o lokaciji, popunite je ovde
      },
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleDodajStazu = async () => {
    try {
      const response = await fetch('http://localhost:5030/api/Staza/DodajStazu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaStaza),
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

  return (
    <div>
      <Divider variant="fullWidth" sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Staze za skijalište: {naziv}</Divider>
      </Typography>

      <Button variant="outlined" color="primary" onClick={handleOpenForm} sx={{ mb: 2 }}>
        Dodaj stazu
      </Button>

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
                    sx={{ mt: 2 }}
                  >
                    Obriši
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Dodaj novu stazu</DialogTitle>
        <DialogContent>
          <TextField
            label="Naziv staze"
            value={novaStaza.naziv}
            onChange={(e) => setNovaStaza({ ...novaStaza, naziv: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Težina staze"
            value={novaStaza.tezina}
            onChange={(e) => setNovaStaza({ ...novaStaza, tezina: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Dužina staze"
            type="number"
            value={novaStaza.duzina}
            onChange={(e) => setNovaStaza({ ...novaStaza, duzina: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Odustani
          </Button>
          <Button onClick={handleDodajStazu} color="primary">
            Dodaj stazu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Staze;




