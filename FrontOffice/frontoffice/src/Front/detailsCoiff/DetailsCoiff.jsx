import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './detailsCoiff.css';
import axios from 'axios';
import ImageSlider from "../../hooks/ImageSlider";

import { Grid,Card,
  TableBody,
  TableCell,
  TableRow,
  Container,} from '@mui/material';
  
import {CiLocationOn,CiStar} from 'react-icons/ci';
import {AiTwotoneStar} from 'react-icons/ai';
import { AppTrafficBySite } from '../../sections/@dashboard/app';
import ServiceChoix from '../../hooks/ServiceChoix'
import Footer from '../Footer';
import Navbar from '../Navbar/navbar';
import Maps from '../../hooks/maps';
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
    const [avis,setAvis]=useState([]);
    const [showFullImages, setShowFullImages] = useState(false);

         
       
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
                     console.log("adrese:",adresse)
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
                         useEffect(() => {
    
                          axios.get(`http://localhost:5000/api/getAvisCentre/${nomEtab}`)
                            .then(res => {
                              setAvis(res.data);
                            });
                      }, []);
                         const scrollThreshold = "header scroll";
                        const containerStyles = {
                          width: "100%",
                          height: "500px",
                          margin: "0 auto",
                        };
                        console.log( 'img: ' ,PremImage)
                           
  const newsList = Perso.map(row => ({
  
    name: row.nom,
    value:row.prenom
   
  }));
  function currentTime(d) {
		let duree = "";
		const [hours, minutes] = d.split(":");
		const date = new Date();
		date.setHours(parseInt(hours, 10));
		date.setMinutes(parseInt(minutes, 10));
			duree = `${hours}:${minutes} `;
		return duree;
	}
  function getDate(d) {
		const date = new Date(d);
		const day = date.getDate();
		const month = date.getMonth() + 1; // Janvier est 0
		const year = date.getFullYear();
		return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
	}
  function getAvis() {
    var s=0
    if(avis.length===0){
      return 0
    }
		for(let i=0 ;i<avis.length;i++){
      s=s+avis[i].note
    }
    s=s/avis.length
    return s.toFixed(1)
	}
  
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
                    <CiStar className='iconStar' /> {getAvis()} ({avis.length} avis)
                   </span>
                   <div style={containerStyles}>
                      <ImageSlider slides={nomEtab} />
                    </div>

                </div>  
                <br/>
              <h3 className='resvTitre'> Réserver en ligne pour un RDV Chez {nomEtab}</h3>
              <p>24h24 - Confirmation immédiate</p>
              <h3 className='resvTitre'>Choix de la prestation</h3>
              <div className='servChoix'>
              <Container>
             <ServiceChoix service={service} nomCentre={nomEtab}/>
             </Container>
             <div className='justify-content-center'>
              
             <Container>
              <div style={{ textAlign: 'center' }}>
                <h3 className='resvTitre'>Avis</h3>
                <br/>
              </div>
              <Card style={{  maxHeight: '670px', overflowY: 'auto' , borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                {avis.length===0?
                <table style={{ borderRadius: '10px' }}>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">
                      <Container>
                        <strong>Aucun avis sur cette centre</strong> 
                      </Container>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </table>:''
                }
              </Card>
            </Container><br/>
              <Container>
              <div style={{ textAlign: 'center' }}>
             <h3 className='resvTitre'>Horaires d'ouverture</h3><br/>
             </div>
             <Card style={{maxWidth: '450px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
              {Horaire.map((donne, index) => (
                <table style={{ margin: '0 auto', borderRadius: '10px'}}>
                  <TableBody>
                    <TableRow key={index}>
                        <TableCell align="left">{donne.jour} :</TableCell>
                        <TableCell padding="text">
                          </TableCell>
                          <TableCell padding="text">
                          </TableCell>
                          <TableCell padding="text">
                          </TableCell>
                          <TableCell padding="text">
                          </TableCell>
                          <TableCell padding="text">
                          </TableCell>
                          <TableCell padding="text">
                          </TableCell>
                        <TableCell align="right" className='trc'>{donne.ouverture ? `${currentTime(donne.ouverture)} - ${currentTime(donne.fermeture)}` : 'Fermé'}</TableCell>
                    </TableRow>
                  </TableBody>
                </table>
              ))}
            </Card>
            </Container><br/>
            </div>
             </div>
                 <p/>
    <h3 className='resvTitre'>Où se situe le salon ?</h3>
    {adresse.map(donne => 
                <div key={donne.reference} style={{width:"70%", height:'700px'}}>
                 <h4><CiLocationOn className='iconCoiff'/>{donne.adresse}</h4> <br/>
                 
                <Maps pointx={donne.localisation.x} pointy={donne.localisation.y}/> 
                <br/>
                </div>  
                )} 
                <br/><br/><br/>
        <h3 className='resvTitre'>Personnels</h3><br/>
        <div>
          <Card style={{maxWidth: '70%', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
            <AppTrafficBySite list={newsList}/>
         </Card>
         <br/>
         </div>
    
    
        </section> 
        <Footer/>
        </>
    )
}

export default DetailsCoiff;