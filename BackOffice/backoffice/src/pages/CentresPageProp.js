import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {useState, useEffect } from 'react';
import { Buffer } from 'buffer';
// @mui
import { useParams } from "react-router-dom";
import { Container, Typography,Grid,Button,Stack } from '@mui/material';
// components
// sections
import { AppNewsUpdate} from '../sections/@dashboard/app';
import Iconify from "../components/iconify";
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function CentresPageProp() {

    const params = useParams();
    const idProp = params.id;
    const navigate = useNavigate();

  const [rows,setCentre]=useState([]);

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/getCentresProp/${idProp}`)
    .then(res=>setCentre(res.data)
    );
     },[]);
    
  
  const newsList = rows.map(row => ({
    id: row.reference,
    title: row.nom,
    description: row.type,
    image: row.src && `data:image/png;base64,${Buffer.from(row.src.data).toString('base64')}`,

  }));
  function onClick(){
    if(newsList.length===0){
      navigate(`/dashboardProp/${idProp}/addCentre`);
    }else{
      navigate(`/dashboardProp/${idProp}/payer`);
    }
  }
  return (
    <>
      <Helmet>
        <title> CLASSY | CENTRES </title>
      </Helmet>

      <Container>
      <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" sx={{ mb: 5 }}>
         Mes Centres |
        </Typography>
          <br />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={()=>onClick()}
          >
            Centre
          </Button>

        </Stack>
        
 
        <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate list={newsList} />
         </Grid>


      </Container>
    </>
  );
}
