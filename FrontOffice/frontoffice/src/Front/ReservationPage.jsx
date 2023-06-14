import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import axios from 'axios';
import { Buffer } from 'buffer';
import { useNavigate ,useLocation, useParams} from "react-router-dom";
import {CiLocationOn,CiStar} from 'react-icons/ci';
import {BiLockAlt} from 'react-icons/bi'
import {BsPlusLg} from "react-icons/bs"
import {BsStars}from "react-icons/bs"
import {MdOutlineAccessTime}from "react-icons/md"
import {FaMoneyBillWave} from 'react-icons/fa'
import {
  Typography,
    Card,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,Radio,RadioGroup
  } from '@mui/material';
import Footer from "./Footer";
import Navbar from './Navbar/navbar';
import Calendrier from './Calendrier';
import ServiceChoix from '../hooks/ServiceChoix';
import AjouterPres from '../hooks/AjouterPres';

const ReservationPage= ({ isLoggedIn}) =>{
  
    const location=useLocation()
    const nomSalon =location.pathname.split('/')[2].split('%20').join(' ')
    const service =location.pathname.split('/')[3].split('%20').join(' ')
    let refUpdate = null;
    if (location.pathname.split('/').length > 4) {
      refUpdate = location.pathname.split('/')[4];
    }
   const  Navigate= useNavigate();
    const [services, setServices] = useState([]);
    const [Perso, setPerso] = useState([]);
    const [name,setName]=useState([]);
    const [avis,setAvis]=useState([]);
    const [adresse,setAdresse]=useState([]);
    const [selectedPerso, setSelectedPerso] = useState(0);
    const [horairesDisponibles, setHorairesDisponibles] = useState([]);
    const [email, setEmail] = useState('');
    const [client, setClient] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [confirmer, setConfirmer] = useState(false);
    const [newPres, setNewPres] = useState(false);
    const [leSservices,setLesServices]=useState([]);
    const [addService, setaddService] = useState(null);
    const [addDuree, setaddDuree] = useState(null);
    const [addselectPerso, setaddselectPerso] = useState(null);

    const handlePersoChange = (event) => {
      const selectedValue = event.target.value;
      setSelectedPerso(selectedValue);
      setHorairesDisponibles([]);
    };
  
  const formatDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
  
    if (hours > 0) {
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}min`;
      }
    } else {
      return `${minutes}min`;
    }
  };

  const checkPersonnelAvailability = async (CIN, heure) => {
    try {
      const response = await axios.post('http://localhost:5000/api/isPersonnelDisponible', { CIN, heure });
  
      const available = response.data.available;
      return available;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);
  useEffect(()=>{
    axios.get(`http://localhost:5000/api/servicesNomCentre/${nomSalon}`)
    .then(res=>setLesServices(res.data)
    );
    
     },[]);
  
useEffect(() => {
    axios.get(`http://localhost:5000/api/getNamesEtab/${nomSalon}`)
      .then(res => setName(res.data)
        );
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/api/getAllpersonnelResv", {
      params: {
        nomService: service,
        nomCentre: nomSalon,
      }
    })
    .then(res => {
      setPerso(res.data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);
useEffect(()=>{
    axios.get(`http://localhost:5000/api/getAdresse/${nomSalon}`)
    .then(res=>setAdresse(res.data)
    );
    
     },[]);
     useEffect(()=>{
        axios.get(`http://localhost:5000/api/getService/${service}`)
        .then(res=>setServices(res.data)
        );
        
         },[]);
         useEffect(() => {
    
          axios.get(`http://localhost:5000/api/getAvisCentre/${nomSalon}`)
            .then(res => {
              setAvis(res.data);
            });
      }, []);

         
         useEffect(() => {
          axios.get(`http://localhost:5000/api/getInfosClient/${email}`)
            .then(res => {
              setClient(res.data);
            })
            .catch(error => {
              console.error(error);
            });
        }, [email]);
         const Insert = async (dateTime) => {
            try {
              const confirmText = "Confirmez-vous la reservation ?";
            
              Swal.fire({
                title: 'Confirmation',
                text: confirmText,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirmer',
                cancelButtonText: 'Annuler',
              }).then(async (result) => {
                if (result.isConfirmed) {
              await axios.post(`http://localhost:5000/api/addResvPerso`,
              {cinPersonnel:selectedPerso,cinClient:client[0].CIN,nomSalon,nomService:service,selectedTime:dateTime });
              console.log("reserv Registration success");
              Navigate('/');
            }
          });
        } catch (err) {
          console.log(err);
          console.log("resv Registration failed");
        }
      };
          const Insert2 = async (dateTime, addService, addDuree, addselectPerso) => {
            try {
              const confirmText = "Confirmez-vous la reservation ?";
            
              Swal.fire({
                title: 'Confirmation',
                text: confirmText,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirmer',
                cancelButtonText: 'Annuler',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await axios.post(`http://localhost:5000/api/addResvPerso2`, {
                    cinPersonnel: selectedPerso,
                    cinPersonnel2: addselectPerso,
                    cinClient: client[0].CIN, 
                    nomSalon: nomSalon, 
                    nomService: service,
                    nomService2: addService,
                    selectedTime: dateTime,
                    addDuree: addDuree
                  });
              
                  console.log("reserv Registration success");
                  Navigate('/');
                }
              });
            } catch (err) {
              console.log(err);
              console.log("resv Registration failed");
            }
          };
          
          const update = async (dateTime) => {
              try {
                await axios.put(`http://localhost:5000/api/updateResv/${refUpdate}`,
                {startDate:dateTime});
                console.log("reserv update success");
              } catch (err) {
                console.log(err);
                console.log("resv update failed");
              }
            };
            const dispoPerso = async (dateTime) => {
              const personnelDisponible = [];
              
    
              for (const person of Perso) {
                console.log('Person:', person);
                console.log(dateTime);
                
                const isAvailable = await checkPersonnelAvailability(person.CIN, dateTime);
                console.log(isAvailable);
            
                personnelDisponible.push({ CIN: person.CIN, disponibilite: isAvailable });
              }
            
              console.log('Personnel Disponible:', personnelDisponible);
            
              const availablePersonnel = personnelDisponible.filter(person => person.disponibilite === true);
            
              if (availablePersonnel.length > 0) {
                  if (selectedPerso === 0) {
                    console.log(handlePersoChange)
                const randomIndex = Math.floor(Math.random() * availablePersonnel.length);
                const selectedPersons = availablePersonnel[randomIndex];
                setSelectedPerso(selectedPersons.CIN);
                console.log('Selected Personnel:', selectedPersons.CIN);
                setConfirmer(true);
                setSelectedDateTime(dateTime);
              }else {
                setConfirmer(true);
                setSelectedDateTime(dateTime);
              }    
            
            } else {
                setConfirmer(false);
                console.log('Aucun personnel disponible.');
              }
            }
            const handleReservation = async (dateTime,CIN) => {
              console.log(dateTime)
              if (!isLoggedIn) {
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: 'btn btn-dark',
                    cancelButton: 'btn btn-dark'
                  },
                  buttonsStyling: false
                })
                swalWithBootstrapButtons.fire({
                  title: "Veuillez vous connecter",
                  text: "Vous devez être connecté pour effectuer une réservation.",
                  icon: "warning",
                 
                  confirmButtonText: "Se connecter",
                  cancelButtonText: "Annuler",
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Rediriger vers la page de connexion
                    Navigate("/auth");
                  }
                });
                return;
              }
              if(CIN !== 0) {

            }else{
              if(Perso.length>0){
                dispoPerso(dateTime); 
              }else{
                setSelectedPerso(0);
                console.log('Selected Personnel:',0);
                setConfirmer(true);
                setSelectedDateTime(dateTime);
              }
           
            };
          }
            const handleAjout=(addService,addDuree,addPrix,addselectPerso)=>{
              console.log("frommmmm Page Resv")
                console.log("Service choisi :", addService);
                console.log("Durée :",addDuree);
                console.log("Prix :", addPrix);
                console.log("Personnel choisi :",addselectPerso);
                setaddService(addService);
                setaddDuree(addDuree);
                setaddselectPerso(addselectPerso);
              };
            
          function currentTime(d) {
            let duree = "";
            const [hours, minutes] = d.split(":");
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            if (hours === "00") {
              duree = `${minutes} min`;
            } else if (minutes === "00") {
              duree = `${hours} h`;
            } else {
              duree = `${hours} h ${minutes} min`;
            }
            return duree;
          }
          function getAvis() {
            if(avis.length===0){
              return 0
            }
            var s=0
            for(let i=0 ;i<avis.length;i++){
              s=s+avis[i].note
            }
            s=s/avis.length
            return s.toFixed(1)
          }
          const currentDates = new Date();
currentDates.setHours(currentDates.getHours() + 1);

          const sendNotification = async () => {
            try {
              await axios.post('http://localhost:5000/api/sendNotif', {
                type:"confirmation",contenu:"votre réservation a été confirmé avec succès",
                etat:0,confirmDate:currentDates,email:email});
              console.log('Notification sent successfully');
            } catch (error) {
              console.error('Failed to send notification:', error);
            }
          };
        
          const handleSendNotification = () => {
            const notification = {
              app_id: "b6f5946a-9d60-4612-baea-251b590b1aec",
              contents: { "en": "Hello" },
              headings: { "en": "Votre reservation a été confirmé" },
              included_segments: ["All"]
            };
            
            
            sendNotification(notification);
          };
          const ConfirmerResv = () => {
            if (selectedDateTime) {
              if (location.pathname.split('/').length > 4) {
                update(selectedDateTime);
                console.log("updatee");
              } else {
                if(addService && addDuree && addselectPerso){
                  
                  Insert2(selectedDateTime,addService,addDuree,addselectPerso);
              
                }else{
                Insert(selectedDateTime);
               
                  }
              }
             handleSendNotification();
            } 
          };
          const AddNewPres=()=>{
           setNewPres(true);
          }
          const SuppNewPres=()=>{
            setNewPres(false);
           }
        
          const moment = require('moment');
          require('moment/locale/fr'); 
          const transformDate = (dateString) => {
            const date = moment(dateString);
            const transformedDate = date.locale('fr').format('dddd DD MMMM YYYY à HH:mm');
            return transformedDate;
          };
const scrollThreshold = "header scroll";
    return(
        <>
         <Navbar change={scrollThreshold} isLoggedIn={isLoggedIn} />
        <div className='navBarLinks'/>
        <div style={{backgroundColor:"#F1F1F1"}} ><br/><p/><br/></div>
        <section className='reservationPage' style={{backgroundColor:"#F1F1F1"}} >
            <div className='container'>
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
                    <br/>
                   </span>
                   <br/>
                   
                   <h3 className="titreResv">1. Prestation sélectionnée</h3>
                {!confirmer ?(   <>
                <Card>
                  <br/>
                  <div className='infos2Resv'>
                   {services.map((donne) => (
                      <div key={donne.reference}> 
                       <Typography variant="body1"><BsStars/> {donne.nomService}</Typography>
                      <Typography variant="body1"><MdOutlineAccessTime/> {formatDuration(donne.duree)} <span/> <FaMoneyBillWave/> {donne.prix}D</Typography>
            
                           </div>
                   ))}
                <br/> Avec qui ? 
                <RadioGroup
  aria-label="personnel"
  name="personnel"
  variant="outlined"
  value={selectedPerso}
  onChange={handlePersoChange}
  row
>
  <div className="radioGroupItem">
    <div className="radioGroupLabel">
      Sans préférence
    </div>
    <div className="radioGroupLabel">
    <FormControlLabel value={0} control={<Radio />} />
  </div>
</div>
  {Perso.map((donne) => (
    <div className="radioGroupItem" key={donne.CIN}>
      <div className="radioGroupLabel">
        <img className="resvPhoto" alt={1} src={`${Buffer.from(donne.photo.data)}`} />
      </div>
    
        {donne.persoName}
      
        <div className="radioGroupLabel">
      <FormControlLabel
        value={donne.CIN}
        control={<Radio />}
      /></div>
    </div>
  ))}
</RadioGroup>

                </div><br/> </Card>
                   
                <div><br/></div>
                {
                !newPres ? (
                  <>
                   <button className='btnBlack' onClick={AddNewPres}> 
                 <BsPlusLg/> Ajouter une prestation à la suite</button>
                 <br/>
                 </>
                 ):
                 (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                 <h3 className="titreResv">Choix de la prestation à ajouter</h3>
 
   <span onClick={SuppNewPres} className='SuppNewPres'>Supprimer</span> 
  </div>

                 )}

                  </>
                ):
                (
                <Card><br/><div className='infosResv'>
              
                {services.map((donne) => (
                   <div key={donne.reference}>
                       <Typography variant="body1"><BsStars/> {donne.nomService}</Typography>
                      <Typography variant="body1"><MdOutlineAccessTime/> {formatDuration(donne.duree)} <span/> <FaMoneyBillWave/> {donne.prix}D</Typography>
            </div>
                ))}
                </div><br/></Card>
                )}
                   <br/>
{newPres ? (
    <AjouterPres
      service={leSservices}
      nomCentre={nomSalon}
      nomService={service}
      confirmer={confirmer}
      onAjout={handleAjout}
    />
  
 
) : (
  <div></div>
)}



{!confirmer ? (<>
 <h3 className="titreResv">2. Choix de la date & heure</h3>
<Card>
  {name.map((donne) => (
    <Calendrier key={donne.reference} refCentre={donne.reference} cinPersonnel={selectedPerso} onReservation={handleReservation} />
  ))}
</Card>
      </>
      ):
      (
        <>
        <h3 className="titreResv">2. Date et heure sélectionnées</h3>
      <Card> <br/> <div className='infosResv'>{transformDate(selectedDateTime)}</div>
     <br/></Card>
      </>
      )}
<div><p/></div>
{confirmer ?(
   <>   
<h3 className="titreResv">3. Identification</h3>
<Card>
  <br/>
  {client.map((donne)=>
  <div className='infosResv'>
   {donne.prenom}  {donne.nom}             {donne.tel} </div>
)}<br/>
</Card>
 <div><br/><p/><br/></div>
 <button className='btnBlack' style={{ display: 'block', width: '100%', textAlign: 'center' }} onClick={ConfirmerResv}>
  <BiLockAlt/> Confirmer
</button>

 <div><br/><p/><br/></div>
 </>
):(
<div/>)}
            </div>
        </section>
        <Footer/>
        </>
    )
}

export default ReservationPage