import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {useState, useEffect, React} from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-datepicker/dist/react-datepicker.css"
import "bootstrap/dist/css/bootstrap.min.css"
import 'moment/locale/fr';
import 'datetime-picker-reactjs/dist/index.css'
import {
    Container, 
    Typography,
    Grid,
    Card,
    Stack
  } from '@mui/material';
  
import { useLocation} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
      minHeight: '100vh',
      backgroundColor: '#9de2ff',
    },
    card: {
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'row',
      margin: '5% auto',
      maxWidth: '600px',
    },
    media: {
      borderRadius: '10px',
      flex: 1,
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      flex: 2,
      padding: theme.spacing(3),
    },
    avatar: {
      backgroundColor: blueGrey[500],
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      margin: 'auto',
      marginBottom: theme.spacing(3),
    },
    stats: {
      backgroundColor: '#efefef',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-around',
      padding: theme.spacing(1),
      margin: theme.spacing(2, 0),
    },
    buttonGroup: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-around',
      margin: theme.spacing(2, 0),
    },
  }));
  
export default function PropProfil() {
const classes = useStyles();
  const location = useLocation();
  const CINPerso= location.pathname.split("/")[2];
  console.log(`cinPersooooo${CINPerso}`);

     useEffect(()=>{
        axios.get(`http://localhost:5000/api/getAllPropriate/${CINPerso}`)
        .then(res=>setSelectedPerso(res.data)
        );
         },[]);
         const [selectedPerso, setSelectedPerso] = useState([]);
                
        const [Resv, setResv] = useState([]);
        
        const createEvent = (reservation) => {
          return {
            title: `${reservation.nomService}`,
            start: reservation.startDateResv,
            end: reservation.endDateResv,
            allDay: false,
          };
        }       
        const events = Resv.map((reservation) => createEvent(reservation));
       console.log(events)

        
    return (
      <>
        <Helmet>
          <title> CLASSY | PROFIL</title>
        </Helmet>
        <Container>
    
     <Stack spacing={3}>
     <Grid container spacing={3}>

{selectedPerso.map((row,index)=>{ 
    return(   
          <Grid item xs={12} md={6} lg={12}>

<Card className={classes.card}>
<div className={classes.details} key={index}>
<Typography variant="h5" component="h2" align="center">
{row.nom} {row.prenom}
</Typography>
<div className={classes.stats}>
<div>
<Typography variant="body2" color="textSecondary">
Telephone
</Typography>
<Typography variant="h6">{row.tel}</Typography>
</div>
<div>
<Typography variant="body2" color="textSecondary">
Email
</Typography>
<Typography variant="h6">{row.email}</Typography>
</div>
<div>
<Typography variant="body2" color="textSecondary">
Sexe
</Typography>
<Typography variant="h6">{row.sexe}</Typography>
</div>
</div>
</div>
</Card>
</Grid> )})}

          </Grid>

 </Stack>

        </Container>
      </>
    );
  }
    
 
  
