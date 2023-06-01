import {useState, useEffect,React } from 'react';
import axios from 'axios';
import { useNavigate ,useLocation} from "react-router-dom";
import {CiLocationOn,CiStar} from 'react-icons/ci';
import {
    Card,
    Container,
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
const [avis,setAvis]=useState([]);


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
  console.log(Perso)
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
          
const scrollThreshold = "header scroll";
    return(
        <>
         <Navbar change={scrollThreshold} />
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
                    <CiStar className='iconStar' /> {getAvis()} ({avis.length} avis)
                   </span>
                   <h3>1.Prestation sélectionnée</h3>
                   <Card>
                    <Container style={{paddingTop:"20px", paddingBottom:"20px"}}>
                   {service}
                   <br/>
                   {services.map((donne) => (
                      <div key={donne.reference}>
                           <h5>{currentTime(donne.duree)}</h5>
                           <h5>{donne.prix} Dinar</h5>
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
                  </Container>
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