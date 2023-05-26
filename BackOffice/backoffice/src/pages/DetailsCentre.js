import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Container, Typography,Grid } from '@mui/material';
// components
// sections
import { AppNewsUpdate} from '../sections/@dashboard/app';
// ----------------------------------------------------------------------

export default function DetailsCentre() {
    const location=useLocation()
    const IdSalon=location.pathname.split('/')[2]
    console.log(IdSalon);
    const [id,setId]=useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [rows,setCentre]=useState([]);

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/getIdEtab/${IdSalon}`)
    .then(res=>setId(res.data)
    ); },[]);
    
  const newsList = id.map(row => ({
    id: row.reference,
    title: row.nom,
    description: row.type,
    postedAt: new Date().toISOString()
  }));
  
  return (
    <>
      <Helmet>
        <title> CLASSY | INFOS</title>
      </Helmet>

      <Container>
        
        <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate list={newsList} />
         </Grid>
      </Container>
    </>
  );
}
