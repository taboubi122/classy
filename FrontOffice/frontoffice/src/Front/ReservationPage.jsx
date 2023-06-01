import {useState, useEffect,React } from 'react';
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
    FormControl,
    FormControlLabel,
    FormLabel,Radio,RadioGroup
  } from '@mui/material';
import Footer from "./Footer";
import Navbar from './Navbar/navbar';
import Calendrier from './Calendrier';
import ServiceChoix from '../hooks/ServiceChoix';

const ReservationPage= ({ isLoggedIn}) =>{
  
    const location=useLocation()
    const nomSalon =location.pathname.split('/')[2].split('%20').join(' ')
    const service =location.pathname.split('/')[3].split('%20').join(' ')
    let refUpdate = null;
    if (location.pathname.split('/').length > 4) {
      refUpdate = location.pathname.split('/')[4];
    }
const [services, setServices] = useState([]);
const [Perso, setPerso] = useState([]);
const [name,setName]=useState([]);
const [adresse,setAdresse]=useState([]);
const [selectedPerso, setSelectedPerso] = useState(0);
const [horairesDisponibles, setHorairesDisponibles] = useState([]);
const [email, setEmail] = useState('');
const [client, setClient] = useState([]);
const [selectedDateTime, setSelectedDateTime] = useState(null);
const [confirmer, setConfirmer] = useState(false);
const [newPres, setNewPres] = useState(false);
const [leSservices,setLesServices]=useState([]);
const handlePersoChange = (event) => {
    setSelectedPerso(event.target.value);
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
              await axios.post(`http://localhost:5000/api/addResvPerso`,
              {cinPersonnel:selectedPerso,cinClient:client[0].CIN,nomSalon,nomService:service,selectedTime:dateTime });
              console.log("reserv Registration success");
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
         const handleReservation = (dateTime) => {
            setConfirmer(true);
            setSelectedDateTime(dateTime);
          };
          const sendNotification = () => {
            const data = { userId: '123' }; // Les données que vous souhaitez envoyer avec la notification
          
            axios.post('http://localhost:5000/sendNotification', data)
              .then(response => {
                console.log(response.data); // Traitez la réponse de la requête
              })
              .catch(error => {
                console.error(error); // Gérez les erreurs éventuelles
              });
          };
          
          const ConfirmerResv = () => {
            if (selectedDateTime) {
              if (location.pathname.split('/').length > 4) {
                update(selectedDateTime);
                sendNotification();
                console.log("updatee");
              } else {
                Insert(selectedDateTime);
                sendNotification();
              }
            }
          };
          const AddNewPres=()=>{
           setNewPres(true);
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
         <Navbar change={scrollThreshold}isLoggedIn={isLoggedIn} />
        <div className='navBarLinks'/>
        <div><br/><p/><br/></div>
        <section className='reservationPage'  >
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
                <button className='btnBlack' onClick={AddNewPres}>  <BsPlusLg/> Ajouter une prestation à la suite</button><br/> </>
                ):
                (
                <Card><br/><div className='infosResv'>
              
                {services.map((donne) => (
                   <div key={donne.reference}>
                       <Typography variant="body1"><BsStars/> {donne.nomService}</Typography>
                      <Typography variant="body1"><MdOutlineAccessTime/> {formatDuration(donne.duree)} <span/> <FaMoneyBillWave/> {donne.prix}D</Typography>
            </div>
                ))}</div><br/></Card>
                )}
                   <br/>
                   {newPres ? (
                    !confirmer ? (
                      <ServiceChoix service={leSservices} nomCentre={nomSalon}/>
                    ) : (
                      <Card><br/> <div className='infosResv'>hi</div></Card>
                    )
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
<div><br/><p/><br/></div>
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