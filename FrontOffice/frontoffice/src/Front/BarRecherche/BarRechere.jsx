
import React,{useState, useEffect} from "react";
import './barRecherche.css';
import {GrLocation} from'react-icons/gr';
import axios from 'axios';
import { Buffer } from 'buffer';
import {GoSearch} from 'react-icons/go';
import Aos from 'aos';
import video from "../../Assets/vi.mp4";
import img from "../../Assets/Photos/5.png";
import 'aos/dist/aos.css'
import { Card,Grid, CardMedia, CardContent, Typography,makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'left',
    width: '250px', // Ajustez la largeur de la carte selon vos besoins
  },
  media: {
    width: '80px', // Ajustez la taille de l'image selon vos besoins
    marginRight: '10px',
     // Ajustez la marge entre l'image et le titre selon vos besoins
  },
});

const BarRecherche= ({isLoggedIn}) =>{
  
const[resv,setResv]=useState([]);
const [email, setEmail] = useState('');
  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getResvClient/${email}`)
      .then(res => {
        setResv(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [email]); 
  // pour l'annimation 
  useEffect(()=>{
    Aos.init({duration:20000})
  },[])
  const classes = useStyles();
    return(
      <section className='BarRecherche'>
        <div className='overlay'/>
        <video src={video} type='video/mp4' muted autoPlay loop/>
        <div className="BarRechercheContent container">
            <div className="textDiv">
            <h1 className="BarRechercheTitle" data-aos="fade-up" >
                Vos rendez-vous de beauté en ligne
            </h1>
            <span data-aos="fade-up" className="smallText">
                 Simple • Immédiat • 24h/24
            </span>
            </div>
            <div className="cardDiv grid" data-aos="fade-up" >
               <div className="salonInput">
                <label  className="labelRech" htmlFor="salon">
                Que chercher-vous ?
                </label>
                 <div className="input1 flex">
                    <input className="inputRech" type="text" placeholder='Nom du salon, prestations (coupe...)'/>
                 </div>
               </div>
               <div className="CityInput">
                <label htmlFor="city"  className="labelRech">
                 Où ?
                </label>
                 <div className="input1 flex">
                    <input  className="inputRech" type="text" placeholder='Adresse, ville...'/>
                 <GrLocation className='icon'/>
                 </div>
               </div>
               
                <div className="searchOption1 flex">
                <a href="/recherche" className='navLink'> <span>Rechercher</span></a>
                
                    <GoSearch className="icon"/>
                    </div>           
            </div>
            {isLoggedIn ? (
               <> 
             
             <Grid container spacing={2}> 
             {resv.map((row) => (
               <Grid item key={row.startDateResv}>
                 <Card className={classes.root}>
                 <img  className={classes.media}
            alt='1'
            src={`data:image/png;base64,${Buffer.from(row.src.data).toString('base64')}`}
          /><CardContent>
                     <Typography variant="subtitle2">{row.nom}</Typography>
                   </CardContent>
                 </Card>
               </Grid>
             ))}
           </Grid>                              
           </>
               ):(  
          <div/>
           )}
        </div>
      </section> 
    )
}

export default BarRecherche