import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {useState, useEffect, React} from 'react';
import { Buffer } from 'buffer';
import { faker } from '@faker-js/faker';
import { Calendar, momentLocalizer  } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-datepicker/dist/react-datepicker.css"
import * as bootstrap from "bootstrap";
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
import Avatar from '@material-ui/core/Avatar';
import { blueGrey } from '@material-ui/core/colors';
import {AppOrderTimeline } from '../sections/@dashboard/app';
import { white } from 'material-ui/styles/colors';

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
  
export default function DashboardPerso() {
  moment.locale('fr');
  const [nomService,setNomservice] = useState("");
  const [fonction, setFonction] = useState("");
  const classes = useStyles();
    const location = useLocation();
    const idCentre= location.pathname.split("/")[2];

    const [services, setServices] = useState([]);
    useEffect(()=>{
      axios.get(`http://localhost:5000/api/getTachePerso/${idCentre}`)
      .then(res=>setTachePerso(res.data)
      );
       },[]);
       useEffect(() => {
        axios
          .get("http://localhost:5000/api/getAllServices")
          .then((res) => setServices(res.data));
      }, []);
       useEffect(()=>{
          axios.get(`http://localhost:5000/api/getOnepersonnel/${idCentre}`)
          .then(res=>setSelectedPerso(res.data)
          );
           },[]);
           const [tachePerso, setTachePerso] = useState([]);
           const [selectedPerso, setSelectedPerso] = useState([]);
                  
          const localizer = momentLocalizer(moment);
          const [Resv, setResv] = useState([]);
           useEffect(() => {
            axios.get(`http://localhost:5000/api/getResvP/${idCentre}`)
              .then(res => {
                const formattedData = res.data.map((reservation) => ({
                  ...reservation,
                  startDateResv: moment(reservation.startDateResv).toDate(),
                  endDateResv: moment(reservation.endDateResv).toDate(),
                }));
                setResv(formattedData);
              })
              .catch(error => console.error(error));
          }, [idCentre]);
          
          const createEvent = (reservation) => {
            console.log(services)
            return {
              title: services.filter((ele)=>ele.reference===reservation.refService)[0].nomService,
              start: reservation.startDateResv,
              end: reservation.endDateResv,
              allDay: false,
            };
          }
          
          const [newEvent, setNewEvent] = useState({ title:"", start: new Date(), end:new Date() });
         
          const events = Resv.map((reservation) => createEvent(reservation));
         console.log(events)
  
          const [allEvents,setAllEvents]=useState(events)
          const handleSelectEvent = (event, e) => {
            const popover = new bootstrap.Popover(e.target, {
                title: event.title,
                content: `
                  <p>Start: ${event.start.toLocaleString()}</p>
                  <p>End: ${event.end.toLocaleString()}</p>
                `,
                trigger: "hover",
                placement: "auto",
                html: true,
                customClass: "popoverStyle",
            });
            popover.show();
          };
  
          const eventStyleGetter = (event, start, end, isSelected) => {
            let backgroundColor = '';
            if (event.title === 'Coupe Coiffage cheveux') {
              backgroundColor = '#7ED957';
            } else if (event.title === 'Bain Kérastase Coupe Coiffage cheveux mi-courtes+ Coloration Sans Ammoniaque Sans Ammoniaque') {
              backgroundColor = '#FF66C4';
            } else if (event.title === 'Coloration Sans Ammoniaque') {
              backgroundColor = '#CB6CE6';
            }
            const style = {
              backgroundColor,
              borderRadius: '0px',
              opacity: 0.8,
              color: 'white',
              border: '0px',
              display: 'block',
              width: '100%'
            };
            return {
              style,
            };
            };
      const deletePersoTache = async (event,row) => {
        console.log(row);
            try {
              await axios.get(`http://localhost:5000/api/deletePersoTache/${idCentre}`,{fonction,nomService});
              console.log("tacheperso Registration success");
             
              window.location.reload()
            } catch (err) {
              console.log(err);
              console.log("tacheperso Registration failed");
            }
          };
          const testDel=(row)=>{
            console.log(`rowwww${row}`);
          }
          const newsList = tachePerso.map((row, index) => ({
            id: row.cin,
            title: row.fonction,
            type: `order${index + 1}`,
            time: row.nomService,
          }));
        
    return (
      <>
        <Helmet>
          <title> CLASSY | RESERVATION</title>
        </Helmet>
        <Container>
    
     <Stack spacing={3}>
        <Grid item xs={12} md={6} lg={12}    >
       <Card>
           <Stack >
              <Calendar localizer={localizer} events={events} 
                startAccessor="start" endAccessor="end" style={{height :500,margin:"50px"}}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                messages={{
                  today: 'Aujourd\'hui',
                  previous: 'Précédent',
                  next: 'Suivant',
                  month: 'Mois',
                  week: 'Semaine',
                  day: 'Jour',
                  agenda: 'Agenda',
                }}
        />
    </Stack>
   </Card>
  </Grid>
</Stack>
</Container>
      </>
    );
  }
    
 
  
