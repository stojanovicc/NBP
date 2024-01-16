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
//   const [novaStaza, setNovaStaza] = useState({ naziv: '', tezina: '', duzina: '' });
//   const [trenutnoSkijaliste, setTrenutnoSkijaliste] = useState({ naziv: 'N/A', lokacija: 'N/A' });

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
//       <Link to="/Skijalista">
//         <Button variant="contained" color="primary" style={{ marginTop: '10px', marginLeft: '10px' }}>
//           Nazad na listu skijališta
//         </Button>
//       </Link>

//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Dodaj novu stazu</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Naziv skijališta"
//             value={trenutnoSkijaliste.naziv}
//             disabled
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Lokacija skijališta"
//             value={trenutnoSkijaliste.lokacija}
//             disabled
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Naziv staze"
//             name="naziv"
//             value={novaStaza.naziv}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Težina"
//             name="tezina"
//             value={novaStaza.tezina}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Dužina"
//             name="duzina"
//             value={novaStaza.duzina}
//             onChange={handleInputChange}
//             fullWidth
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Otkaži
//           </Button>
//           <Button onClick={handleDodajStazu} color="primary">
//             Dodaj
//           </Button>
//         </DialogActions>
//       </Dialog>

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

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';

const Staze = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staze, setStaze] = useState([]);
  const [aktivnosti, setAktivnosti] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAktivnostDialog, setOpenAktivnostDialog] = useState(false);
  const [novaStaza, setNovaStaza] = useState({ naziv: '', tezina: '', duzina: '' });
  const [novaAktivnost, setNovaAktivnost] = useState({ naziv: '', opis: '' });
  const [trenutnoSkijaliste, setTrenutnoSkijaliste] = useState({ naziv: 'N/A', lokacija: 'N/A' });

  useEffect(() => {
    fetchData();
    fetchSkijalisteData();
    fetchAktivnostiData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiStazeSkijalista?skijalisteId=${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching data. Status: ${response.status}`);
      }

      const data = await response.json();
      setStaze(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSkijalisteData = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiSkijaliste?skijalisteId=${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching skijaliste data. Status: ${response.status}`);
      }

      const skijalisteData = await response.json();
      const skijaliste = skijalisteData.find((sk) => sk.id === parseInt(id));

      if (skijaliste) {
        setTrenutnoSkijaliste({
          naziv: skijaliste.properties.naziv || 'N/A',
          lokacija: skijaliste.properties.lokacija || 'N/A',
        });
      }
    } catch (error) {
      console.error('Error fetching skijaliste data:', error);
    }
  };

  const fetchAktivnostiData = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/Skijaliste/PreuzmiAktivnostiSkijalista?skijalisteId=${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching aktivnosti data. Status: ${response.status}`);
      }

      const aktivnostiData = await response.json();
      setAktivnosti(aktivnostiData);
    } catch (error) {
      console.error('Error fetching aktivnosti data:', error);
    }
  };

  const handleOpenDialog = () => {
    fetchSkijalisteData();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    setNovaStaza({ ...novaStaza, [e.target.name]: e.target.value });
  };

  const handleDodajStazu = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/Staza/DodajStazu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novaStaza,
          skijaliste: {
            naziv: trenutnoSkijaliste.naziv,
            lokacija: trenutnoSkijaliste.lokacija,
          },
        }),
      });

      if (response.ok) {
        console.log('Staza uspešno dodata');
        fetchData();
        handleCloseDialog();
        setNovaStaza({ naziv: '', tezina: '', duzina: '' });
      } else {
        console.error('Error adding staza:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding staza:', error);
    }
  };

  const handleObrisiStazu = async (stazaId) => {
    try {
      const response = await fetch(`http://localhost:5030/api/Staza/ObrisiStazu?stazaId=${stazaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Staza uspešno obrisana');
        fetchData();
      } else {
        console.error('Error deleting staza:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting staza:', error);
    }
  };

  const handlePregledStaze = (stazaId) => {
    navigate(`/Staza/${stazaId}`);
  };

  const handleObrisiAktivnost = async (aktivnostId) => {
    try {
      const response = await fetch(`http://localhost:5030/api/Aktivnosti/ObrisiAktivnost?aktivnostId=${aktivnostId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Aktivnost uspešno obrisana');
        fetchAktivnostiData();
      } else {
        console.error('Error deleting aktivnost:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting aktivnost:', error);
    }
  };

  const handleOpenAktivnostDialog = () => {
    setOpenAktivnostDialog(true);
  };

  const handleCloseAktivnostDialog = () => {
    setOpenAktivnostDialog(false);
  };

  const handleAktivnostInputChange = (e) => {
    setNovaAktivnost({ ...novaAktivnost, [e.target.name]: e.target.value });
  };

  const handleDodajAktivnost = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/Aktivnosti/DodajAktivnost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novaAktivnost,
          skijaliste: {
            naziv: trenutnoSkijaliste.naziv,
            lokacija: trenutnoSkijaliste.lokacija,
          },
        }),
      });

      if (response.ok) {
        console.log('Aktivnost uspešno dodata');
        fetchAktivnostiData();
        handleCloseAktivnostDialog();
        setNovaAktivnost({ naziv: '', opis: '' });
      } else {
        console.error('Error adding aktivnost:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding aktivnost:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Lista staza</Divider>
      </Typography>
      <Divider />
      <List>
        {staze.map((staza) => (
          <Paper key={staza.id} elevation={3} style={{ margin: '10px 0', padding: '10px' }}>
            <ListItem>
              <ListItemText
                primary={staza.properties.naziv || 'N/A'}
                secondary={`Težina: ${staza.properties.tezina || 'N/A'}, Dužina: ${staza.properties.duzina || 'N/A'}`}
              />
              <Button variant="contained" color="secondary" onClick={() => handleObrisiStazu(staza.id)}>
                Obriši
              </Button>
              <Button variant="contained" color="primary" onClick={() => handlePregledStaze(staza.id)} style={{ marginLeft: '10px' }}>
                Pregled staze
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>

      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginTop: '10px' }}>
        Dodaj stazu
      </Button>

      <Button variant="contained" color="primary" onClick={handleOpenAktivnostDialog} style={{ marginTop: '10px', marginLeft: '10px' }}>
        Dodaj aktivnost
      </Button>

      <Link to="/Skijalista">
        <Button variant="contained" color="primary" style={{ marginTop: '10px', marginLeft: '10px' }}>
          Nazad na listu skijališta
        </Button>
      </Link>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {/* ... (existing staza dialog code) */}
      </Dialog>

      <Dialog open={openAktivnostDialog} onClose={handleCloseAktivnostDialog}>
        <DialogTitle>Dodaj novu aktivnost</DialogTitle>
        <DialogContent>
          <TextField
            label="Naziv aktivnosti"
            name="naziv"
            value={novaAktivnost.naziv}
            onChange={handleAktivnostInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Opis"
            name="opis"
            value={novaAktivnost.opis}
            onChange={handleAktivnostInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAktivnostDialog} color="primary">
            Otkaži
          </Button>
          <Button onClick={handleDodajAktivnost} color="primary">
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" sx={{ marginTop: '25px' }} gutterBottom>
        <Divider>Lista aktivnosti</Divider>
      </Typography>
      <Divider />
      <List>
        {aktivnosti.map((aktivnost) => (
          <Paper key={aktivnost.id} elevation={3} style={{ margin: '10px 0', padding: '10px' }}>
            <ListItem>
              <ListItemText
                primary={aktivnost.properties.naziv || 'N/A'}
                secondary={`Opis: ${aktivnost.properties.opis || 'N/A'}`}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleObrisiAktivnost(aktivnost.id)}
                style={{ marginLeft: '10px' }}
              >
                Obriši
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>
    </div>
  );
};

export default Staze;
