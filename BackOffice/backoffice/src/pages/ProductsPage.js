import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {useState, useEffect } from 'react';
import { Buffer } from 'buffer';
// @mui
import { Container, Typography,Grid } from '@mui/material';
// components
// sections
import AppNewsUpdateCopy from '../sections/@dashboard/app/AppNewsUpdateCopy';
// ----------------------------------------------------------------------

export default function ProductsPage() {


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
        <title> CLASSY | CENTRES </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
         Centres |
        </Typography>

        <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdateCopy list={newsList} />
         </Grid>


      </Container>
    </>
  );
}
