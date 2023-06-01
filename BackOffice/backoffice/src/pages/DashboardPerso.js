import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {useState, useEffect, React} from 'react';
import { Buffer } from 'buffer';
import Swal from "sweetalert2";
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
    const [client, setClient] = useState([]);
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
        axios.get(`http://localhost:5000/api/getClient`)
        .then(res=>setClient(res.data)
        );
         },[]);
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
              refClient:reservation.CINClient,
              client:client.filter((ele)=>ele.CIN===reservation.CINClient)[0].nom+" "+ client.filter((ele)=>ele.CIN===reservation.CINClient)[0].prenom,
              end: reservation.endDateResv,
              centre:reservation.refCentre,
              ref:reservation.reference,
              allDay: false,
            };
          }
          
          const [newEvent, setNewEvent] = useState({ title:"", start: new Date(), end:new Date() });
         
          const events = Resv.map((reservation) => createEvent(reservation));
         console.log(events)
         function currentTime(d) {
          let duree = "";
          const [hours, minutes] = d.split(":");
          const date = new Date();
          date.setHours(parseInt(hours, 10));
          date.setMinutes(parseInt(minutes, 10));
            duree = `${hours} : ${minutes} `;
            const [x, t] = duree.split(',')
            const trimmedTime = t.trim();
          return trimmedTime;
         }
         function testDate(d){
          const dateObject = new Date();
          const day = dateObject.getDate();
          const month = dateObject.getMonth() + 1;
          const year = dateObject.getFullYear();
          const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
          let duree = "";
          const [hours, minutes] = d.split(":");
          const date = new Date();
          date.setHours(parseInt(hours, 10));
          date.setMinutes(parseInt(minutes, 10));
            duree = `${hours} : ${minutes} `;
            const [x, t] = duree.split(',')
            const trimmedTime = x.trim();
            const [m, dd, y] = trimmedTime.split('/');
            const formattedDate2 = `${m.padStart(2, '0')}/${dd.padStart(2, '0')}/${y}`;
          if(formattedDate2===formattedDate){
            return true
          }
          return false
         }
          const [allEvents,setAllEvents]=useState(events)
          const handleSelectClick = (event,e)=>{
            const v=testDate(event.start.toLocaleString());
            if(v){
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success'
              },
              buttonsStyling: false
            , });
            swalWithBootstrapButtons
              .fire({
                title: event.title
                , text: `
                De ${currentTime(event.start.toLocaleString())}
                Jusqu'à ${currentTime(event.end.toLocaleString())}
                Avec ${event.client}
              `
                , showCancelButton: false
                , confirmButtonText: "Service terminé"
                , reverseButtons: true
              , })
              .then((result) => {
                if (result.isConfirmed) {
                  axios
                    .post(`http://localhost:5000/api/confirmerPresence/${event.refClient}/${event.centre}`)
                    axios
                    .put(`http://localhost:5000/api/updateResv/${event.ref}`)
                    window.location.reload();
                  swalWithBootstrapButtons.fire(
                    "Service terminé"
                    , "success"
                  );
                 
                }
              });
            }else{
              const popover = new bootstrap.Popover(e.target, {
                title: event.title,
                content: `<p>De ${currentTime(event.start.toLocaleString())}</p>
                <p>Jusqu'à ${currentTime(event.end.toLocaleString())}</p>
                <p>Avec ${event.client}</p>
                `,
                trigger: "hover",
                placement: "auto",
                html: true,
                customClass: "popoverStyle",
            });
            popover.show();
            }
        }
  
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
                onSelectEvent={handleSelectClick}
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
    
 
  
