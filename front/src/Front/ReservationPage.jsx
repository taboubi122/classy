import {useState, useEffect,React } from 'react';
import axios from 'axios';
import { useNavigate ,useLocation} from "react-router-dom";
import {CiLocationOn,CiStar} from 'react-icons/ci';
import {
    Card,
    FormControl,
    FormControlLabel,
    FormLabel,Radio,RadioGroup
  } from '@mui/material';
import Footer from "./Footer";
import Navbar from './Navbar/navbar';
import Calendrier from './Calendrier';


const ReservationPage= () =>{
    const location=useLocation()
    const nomSalon =location.pathname.split('/')[2].split('%20').join(' ')
    const service =location.pathname.split('/')[3].split('%20').join(' ')
const [services, setServices] = useState([]);
const [Perso, setPerso] = useState([]);
const [name,setName]=useState([]);
const [adresse,setAdresse]=useState([]);
const [selectedPerso, setSelectedPerso] = useState('');

const handlePersoChange = (event) => {
    setSelectedPerso(event.target.value);
  };
  
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
         

         const Insert = async (dateTime) => {
            try {
              await axios.post(`http://localhost:5000/api/addResvPerso`,
              {cinPersonnel:selectedPerso,nomSalon,nomService:service,selectedTime:dateTime });
              console.log("reserv Registration success");
            } catch (err) {
              console.log(err);
              console.log("resv Registration failed");
            }
          };
          const handleReservation = (dateTime) => {
            console.log(dateTime)
          Insert(dateTime);
          };
          
const scrollThreshold = "header scroll";
    return(
        <>
         <Navbar change={scrollThreshold} />
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
                   </span>
                   <h3>1.Prestation sélectionnée</h3>
                   <Card>
                   {service}
                   <br/>
                   {services.map((donne) => (
                      <div key={donne.reference}>
                           <h5>{donne.duree}</h5>
                           <h5>{donne.prix}D</h5>
                           </div>
                   ))}
                   <br/>
                   Avec qui ? 
                   <RadioGroup
  aria-label="personnel"
  name="personnel"
  variant="outlined"
  value={selectedPerso}
  onChange={handlePersoChange}
>
  <FormControlLabel value="Sans preferance" control={<Radio />} label="Sans preferance" />

  {Perso.map((donne) => (
    <FormControlLabel
      key={donne.CIN}
      value={donne.CIN}
      control={<Radio />}
      label={donne.persoName}
    />
  ))}
</RadioGroup>

                   </Card>
                   <div><br/><p/><br/></div>
                   <h3>2.Choix de la date & heure</h3>
                   <Card>
                   {name.map((donne) => (
                    
                    <Calendrier refCentre={donne.reference} onReservation={handleReservation} />
                    ))}
              </Card>
              <div><br/><p/><br/></div>
            </div>
        </section>
        <Footer/>
        </>
    )
}

export default ReservationPage