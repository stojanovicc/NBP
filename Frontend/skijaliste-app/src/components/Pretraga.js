import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Card, CardContent, CardActions, Divider, useMediaQuery, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';

const Pretraga = () => {
    const { naziv } = useParams();
    const [searchTermAktivnosti, setSearchTermAktivnosti] = useState('');
    const [searchTermSkijalista, setSearchTermSkijalista] = useState('');
    const [searchTermStaze, setSearchTermStaze] = useState('');

    const [searchResultsAktivnosti, setSearchResultsAktivnosti] = useState([]);
    const [searchResultsSkijalista, setSearchResultsSkijalista] = useState([]);
    const [searchResultsStaze, setSearchResultsStaze] = useState([]);

    const handleSearchAktivnosti = async () => {
        try {
        const response = await fetch(`http://localhost:5030/api/Aktivnosti/PretraziAktivnosti?pojam=${searchTermAktivnosti}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error('Greška prilikom pretrage aktivnosti.');
        }
    
        const result = await response.json();
        const resultWithSkijalisteInfo = result.map(aktivnost => ({
            ...aktivnost,
            skijaliste: {
            naziv: aktivnost.skijaliste.naziv,
            lokacija: aktivnost.skijaliste.lokacija,
            },
        }));
    
        setSearchResultsAktivnosti(resultWithSkijalisteInfo);
        } catch (error) {
        console.error(error);
        }
    };
  
    const handleSearchSkijalista = async () => {
        try {
            const response = await fetch(`http://localhost:5030/api/Skijaliste/PretraziSkijalista?pojam=${searchTermSkijalista}`
            );
            if (!response.ok) {
                throw new Error('Greška prilikom pretrage aktivnosti.');
            }
        
            const data = await response.json();
            setSearchResultsSkijalista(data);
        } catch (error) {
        console.error(error);
        }
    };

    const handleSearchStaze = async () => {
        try {
            const response = await fetch(`http://localhost:5030/api/Staza/PretraziStaze?pojam=${searchTermStaze}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            });
        
            if (!response.ok) {
            throw new Error('Greška prilikom pretrage staza.');
            }
        
            const result = await response.json();
            const resultWithSkijalisteInfo = result.map(staza => ({
            ...staza,
            skijaliste: {
                naziv: staza.skijaliste.naziv,
                lokacija: staza.skijaliste.lokacija,
            },
            }));
        
            setSearchResultsStaze(resultWithSkijalisteInfo);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseAktivnosti = () => {
        setSearchResultsAktivnosti([]);
        setSearchTermAktivnosti('');
    };

    const handleCloseSkijalista = () => {
        setSearchResultsSkijalista([]);
        setSearchTermSkijalista('');
    };

    const handleCloseStaze = () => {
        setSearchResultsStaze([]);
        setSearchTermStaze('');
    };

    return (
        <div sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}} >
            <Typography variant="h4" sx={{ marginBottom: '16px', textAlign: 'center'}}>
                <Divider variant="middle" sx={{ width: '100%' }}>Pretraga</Divider>
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ marginBottom: '15px' }}>
                        Pretraga aktivnosti
                    </Typography>
                    <Divider variant="middle" sx={{ width: '90%' }} />
                    <TextField
                        label="Pretraži aktivnosti"
                        value={searchTermAktivnosti}
                        onChange={(e) => setSearchTermAktivnosti(e.target.value)}
                        margin="normal"
                        fullWidth
                        InputProps={{
                        startAdornment: (
                            <SearchIcon />
                        ),
                        }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSearchAktivnosti}
                    >
                        Pretraži
                    </Button>
                    {searchResultsAktivnosti.length > 0 && (
                        <div>
                            <Typography variant="h6" gutterBottom>
                                Rezultati pretrage za aktivnosti:
                            </Typography>
                            {searchResultsAktivnosti.map((aktivnost) => (
                                <Card key={aktivnost.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            Naziv: {aktivnost.naziv}
                                        </Typography>
                                        <Typography variant="body2">
                                            Opis: {aktivnost.opis}
                                        </Typography>
                                        <Typography variant="body2">
                                            Cena: {aktivnost.cena}
                                        </Typography>
                                        <Typography variant="body2">
                                            Skijalište: {aktivnost.skijaliste.naziv}
                                        </Typography>
                                        <Typography variant="body2">
                                            Lokacija: {aktivnost.skijaliste.lokacija}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleCloseAktivnosti}
                                            endIcon={<CloseIcon />}
                                        >
                                            Zatvori
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ marginBottom: '15px' }}>
                        Pretraga skijališta
                    </Typography>
                    <Divider variant="middle" sx={{ width: '90%' }} />
                    <TextField
                        label="Pretraži staze"
                        value={searchTermSkijalista}
                        onChange={(e) => setSearchTermSkijalista(e.target.value)}
                        margin="normal"
                        fullWidth
                        InputProps={{
                        startAdornment: (
                            <SearchIcon />
                        ),
                        }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSearchSkijalista}
                    >
                        Pretraži
                    </Button>
                    {searchResultsSkijalista.length > 0 && (
                        <div>
                            <Typography variant="h6" gutterBottom>
                                Rezultati pretrage za skijalište:
                            </Typography>
                            {searchResultsSkijalista.map((skijaliste) => (
                                <Card key={skijaliste.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            Naziv: {skijaliste.naziv}
                                        </Typography>
                                        <Typography variant="body2">
                                            Lokacija: {skijaliste.lokacija}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleCloseSkijalista}
                                            endIcon={<CloseIcon />}
                                        >
                                            Zatvori
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ marginBottom: '15px' }}>
                        Pretraga staza
                    </Typography>
                    <Divider variant="middle" sx={{ width: '90%' }} />
                    <TextField
                        label="Pretraži staze"
                        value={searchTermStaze}
                        onChange={(e) => setSearchTermStaze(e.target.value)}
                        margin="normal"
                        fullWidth
                        InputProps={{
                        startAdornment: (
                            <SearchIcon />
                        ),
                        }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSearchStaze}
                    >
                        Pretraži
                    </Button>
                    {searchResultsStaze.length > 0 && (
                        <div>
                            <Typography variant="h6" gutterBottom>
                                Rezultati pretrage za staze:
                            </Typography>
                            {searchResultsStaze.map((staza) => (
                                <Card key={staza.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            Naziv: {staza.naziv}
                                        </Typography>
                                        <Typography variant="body2">
                                            Težina: {staza.tezina}
                                        </Typography>
                                        <Typography variant="body2">
                                            Dužina: {staza.duzina}
                                        </Typography>
                                        <Typography variant="body2">
                                            Skijalište: {staza.skijaliste.naziv}
                                        </Typography>
                                        <Typography variant="body2">
                                            Lokacija: {staza.skijaliste.lokacija}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleCloseStaze}
                                            endIcon={<CloseIcon />}
                                        >
                                            Zatvori
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default Pretraga;