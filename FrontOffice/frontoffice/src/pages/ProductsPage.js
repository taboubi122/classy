import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {useState, useEffect } from 'react';
import { Buffer } from 'buffer';
// @mui
import { Container, Typography,Grid } from '@mui/material';
// components
// sections
import { AppNewsUpdate} from '../sections/@dashboard/app';
// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [rows,setCentre]=useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5000/api/getNamesEtab')
    .then(res=>setCentre(res.data)
    );
     },[]);
    
  
  const newsList = rows.map(row => ({
    id: row.reference,
    title: row.nom,
    description: row.type,
    image: row.src && `data:image/png;base64,${Buffer.from(row.src.data).toString('base64')}`,

  }));
  
  return (
    <>
      <Helmet>
        <title> Dashboard: Centres | </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
         Centres
        </Typography>

        <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate list={newsList} />
         </Grid>


      </Container>
    </>
  );
}
