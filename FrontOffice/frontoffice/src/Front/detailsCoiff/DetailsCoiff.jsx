import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './detailsCoiff.css';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Grid,Card,  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow, } from '@mui/material';
  
import {CiLocationOn,CiStar} from 'react-icons/ci';
import maps from '../../hooks/maps';
import { AppTrafficBySite } from '../../sections/@dashboard/app';
import ServiceChoix from '../../hooks/ServiceChoix'
import Footer from '../Footer';
import Navbar from '../Navbar/navbar';

const DetailsCoiff= ({ isLoggedIn}) =>{
    const location=useLocation()
    console.log(location.pathname.split('/')[3].split('%20').join(' '))

     const nomEtab =location.pathname.split('/')[3].split('%20').join(' ')
    const [name,setName]=useState([]);
    const [adresse,setAdresse]=useState([]);
    const [service,setService]=useState([]);
    const [PremImage,setPremImage]=useState([]);
    const [Perso,setPerso]=useState([]);
    const [Horaire,setHoraire]=useState([]);
    const [showFullImages, setShowFullImages] = useState(false);

         useEffect(()=>{
            axios.get(`http://localhost:5000/api/getPremierImage/${nomEtab}`)
            .then(res=>setPremImage(res.data)
            );
             },[]);
       
             useEffect(() => {
              axios.get(`http://localhost:5000/api/getNamesEtab/${nomEtab}`)
                .then(res => setName(res.data)
                  );
            }, []);
            useEffect(()=>{
              axios.get(`http://localhost:5000/api/getPersonnelByNameCentre/${nomEtab}`)
              .then(res=>setPerso(res.data)
              );
               },[]);
            
                 useEffect(()=>{
                    axios.get(`http://localhost:5000/api/getAdresse/${nomEtab}`)
                    .then(res=>setAdresse(res.data)
                    );
                    
                     },[]);
                     useEffect(()=>{
                        axios.get(`http://localhost:5000/api/servicesNomCentre/${nomEtab}`)
                        .then(res=>setService(res.data)
                        );
                        
                         },[]);
                         useEffect(() => {
    
                             axios.get(`http://localhost:5000/api/getHoraireCentre/${nomEtab}`)
                               .then(res => {
                                 setHoraire(res.data);
                               });
                         }, []);

                         const scrollThreshold = "header scroll";
                           
  const newsList = Perso.map(row => ({
  
    name: row.nom,
    value:row.prenom
   
  }));
  
     return (
       <>
       <Navbar change={scrollThreshold} isLoggedIn={isLoggedIn} />
          <div className='navBarLinks' />
              <section className='Coif'>
                 <div>
                  
                  {name.map((donne) => (
                      <div key={donne.reference}>
                           <h2>{donne.nom}</h2>
                             </div>
                   ))}
                  {adresse.map((donne) => (
                      <div key={donne.reference}>
                           <h4> <CiLocationOn className='iconCoiff' /> {donne.adresse} </h4>
                      </div>
                   ))}
                   <span className='h4'>
                    <CiStar className='iconStar' /> 4.5 (185 avis)
                   </span>
 <div className='imageContainer'>
      {PremImage.slice(0, showFullImages ? PremImage.length : 5).map((row, index) => (
        <div key={row.reference} className={`imageItem ${index === 0 ? 'largeImage' : ''}`}>
          <img
            alt='1'
            className='premierImgea'
            src={`data:image/png;base64,${Buffer.from(row.src.data).toString('base64')}`}
          />
        </div>
      ))}
      {PremImage.length > 5 && !showFullImages && (
        <div className='imageItem viewMore'>
        <button onClick={() => setShowFullImages(true)}>
          <p>Voir plus</p>
        </button>
        </div>
      )}
    </div>

    </div>  
                <br/>
              
              <h3 className='resvTitre'> Réserver en ligne votre rendez-vous Chez {nomEtab}</h3>
              <p>Choix de la prestation</p>
              <div className='servChoix'>
             <ServiceChoix service={service} nomCentre={nomEtab}/>
             <Card style={{ width: '50%',height:'fit-content' }}>
  {Horaire.map((donne, index) => (
    <table>
      <TableBody>
        <TableRow key={index}>
          <p>
            <TableCell scope="col">{donne.jour} :</TableCell>
            <TableCell scope="col">
              {donne.ouverture ? `${donne.ouverture} - ${donne.fermeture}` : 'Fermé'}
            </TableCell>
          </p>
        </TableRow>
      </TableBody>
    </table>
  ))}
</Card>

</div>
    <p/>
    <h2 className='resvTitre'>Où se situe le salon ?</h2>
    {adresse.map(donne => 
                <div key={donne.reference} >
                 <h4><CiLocationOn className='iconCoiff'/>{donne.adresse}</h4> 
                </div>   
                )}
               <br/>
                {maps()}   
                <br/>
    <h2 className='resvTitre'>Personnels</h2>
                 <Grid container >
          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite list={newsList} />
         </Grid>
             </Grid>
        </section> 
        <Footer/>
        </>
    )
}

export default DetailsCoiff;