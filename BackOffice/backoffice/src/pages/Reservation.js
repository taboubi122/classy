import { Helmet } from 'react-helmet-async';
import React,{useState,useEffect} from 'react';
import { Calendar, momentLocalizer  } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-datepicker/dist/react-datepicker.css"
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import 'moment/locale/fr';
import 'datetime-picker-reactjs/dist/index.css'
import axios from 'axios';
// @mui
import { Card, Stack, Button, Container, Typography,Input , FormControlLabel, Radio,RadioGroup } from '@mui/material';
import { useLocation} from "react-router-dom";
import Iconify from '../components/iconify';
// sections
export default function Reservation() {
  moment.locale('fr');
const localizer = momentLocalizer(moment);
const [Resv, setResv] = useState([]);
const [PersoCalen, setPersoCalen] = useState([]);
    const location = useLocation();
  const IdSalon= location.pathname.split("/")[2];
  console.log(`${IdSalon}`);


  useEffect(() => {
    axios.get(`http://localhost:5000/api/getReservation/${IdSalon}`)
      .then(res => {
        const formattedData = res.data.map((reservation) => ({
          ...reservation,
          startDateResv: moment(reservation.startDateResv).toDate(),
          endDateResv: moment(reservation.endDateResv).toDate(),
        }));
        setResv(formattedData);
      })
      .catch(error => console.error(error));
  }, [IdSalon]);
  console.log(Resv)
  useEffect(()=>{
    axios.get(`http://localhost:5000/api/getAllPersonnels/${IdSalon}`)
    .then(res=>setPersoCalen(res.data)
    );
     },[]);
    
     const showCalendar=(CIN)=>{
      console.log(CIN)
      axios.get(`http://localhost:5000/api/getResvPerso/${CIN}`)
        .then(res => {
          const formattedData = res.data.map((reservation) => ({
            ...reservation,
            startDateResv: moment(reservation.startDateResv).toDate(),
            endDateResv: moment(reservation.endDateResv).toDate(),
          }));
          setResv(formattedData);
        })
        .catch(error => console.error(error));
    }
    
    const [calendarView, setCalendarView] = useState("global");

    useEffect(() => {
      const storedView = localStorage.getItem("calendarView");
      if (storedView && PersoCalen.some((row) => row.CIN === storedView)) {
        setCalendarView(storedView);
      }
    }, []);
    useEffect(() => {
      localStorage.setItem("calendarView", calendarView);
    }, [calendarView]);
    
    const createEvent = (reservation) => {
      const { nomService, startDateResv, endDateResv, nomPerso, prenomPerso, nom, prenom, titre } = reservation;
      let personnel = '';
      let client = '';
      let service = '';
    
      if (nomPerso && prenomPerso) {
        personnel = `${nomPerso} ${prenomPerso}`;
      }
      if (nom && prenom) {
        client = `${nom} ${prenom}`;
      }
      if (nomService) {
        service = nomService;
      } else {
        service = titre || 'Titre par défaut'; // Ajout d'un titre par défaut si le service et le titre sont tous les deux vides
      }
    
      return {
        title: service,
        start: startDateResv,
        end: endDateResv,
        personnel: personnel,
        client: client,
        allDay: false,
      };
    };
    
    
  const [newEvent, setNewEvent] = useState({ title:"", start: new Date(), end:new Date(),nom:"",prenom:"",nomPerso:"",prenomPerso:"" });
 
  const events = Resv.map((reservation) => createEvent(reservation));
 console.log(events)
  const [allEvents,setAllEvents]=useState(events)

  const handleAddEvent = async () => {
    try {
      await axios.post('http://localhost:5000/api/addResv', {
        refCentre: IdSalon,
        startDate: newEvent.start,
        endDate: newEvent.end,
        titre: newEvent.title
      });
      console.log('Reservation added');
      window.location.reload();
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  
    const { title, start, end, nom, prenom, nomPerso, prenomPerso } = newEvent;
    const startTimestamp = Date.parse(start);
    const endTimestamp = Date.parse(end);
  
    const newEventObject = {
      title,
      start: new Date(startTimestamp),
      end: new Date(endTimestamp),
      nom,
      prenom,
      nomPerso,
      prenomPerso
    };
    setAllEvents([...allEvents, newEventObject]);
    setNewEvent({ title: '', start: new Date(), end: new Date(), nom: '', prenom: '', nomPerso: '', prenomPerso: '' });
  };
  
const handleSelectEvent = (event, e) => {
  const popoverContent = `
    <p>Start: ${event.start.toLocaleString()}</p>
    <p>End: ${event.end.toLocaleString()}</p>
    ${event.client ? `<p>Client: ${event.client}</p>` : ''}
    ${event.personnel ? `<p>Personnel: ${event.personnel}</p>` : ''}
  `;

      console.log('Reservation added');
      window.location.reload();
    }
  
    const { title, start, end, nom, prenom, nomPerso, prenomPerso } = newEvent;
    const startTimestamp = Date.parse(start);
    const endTimestamp = Date.parse(end);
  
    const newEventObject = {
      title,
      start: new Date(startTimestamp),
      end: new Date(endTimestamp),
      nom,
      prenom,
      nomPerso,
      prenomPerso
    };
    setAllEvents([...allEvents, newEventObject]);
    setNewEvent({ title: '', start: new Date(), end: new Date(), nom: '', prenom: '', nomPerso: '', prenomPerso: '' });
  };
  
const handleSelectEvent = (event, e) => {
  const popoverContent = `
    <p>Start: ${event.start.toLocaleString()}</p>
    <p>End: ${event.end.toLocaleString()}</p>
    ${event.client ? `<p>Client: ${event.client}</p>` : ''}
    ${event.personnel ? `<p>Personnel: ${event.personnel}</p>` : ''}
  `;

const handleAddEvent = () => {
  const { title, start, end ,nom,prenom,nomPerso,prenomPerso} = newEvent;
  const startTimestamp = Date.parse(start);
  const endTimestamp = Date.parse(end);

  const newEventObject = { title, start: new Date(startTimestamp), end: new Date(endTimestamp),nom,prenom,nomPerso,prenomPerso};
  setAllEvents([...allEvents, newEventObject]);
  setNewEvent({ title: '', start: new Date(), end: new Date(),nom:"",prenom:"",nomPerso:"",prenomPerso:"" });
};
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
  const handleSelectEvent = (event, e) => {
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
          Personnel ${event.personnel.length===null?'Sans':event.personnel}
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
          content: `
          <h5> Personnel :${event.personnel.length===null?'Sans':event.personnel}</h5>
          <p>De ${currentTime(event.start.toLocaleString())}</p>
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
  const popover = new bootstrap.Popover(e.target, {
    title: event.title,
    content: popoverContent,
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
  const [isOpenPopAdd, setIsOpenPopAdd] = useState(false);
 const togglePopup = () => {
    setIsOpenPopAdd(!isOpenPopAdd);
    document.body.style.overflow = "auto"; // rétablit le défilement de la page lorsque le pop-up est fermé

  }
  return (
    <>
      <Helmet>
        <title> CLASSY | RESERVATION </title>
      </Helmet>

      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
  {isOpenPopAdd ? (
    <Typography variant="h4" gutterBottom>
      &nbsp;
    </Typography>
  ) : (
    <Typography variant="h4" gutterBottom>
      Calendrier
    </Typography>
  )}
  {isOpenPopAdd ? null : (
    <Button
      variant="contained"
      startIcon={<Iconify icon="eva:plus-fill" />}
      onClick={togglePopup}
    >
      New Event
    </Button>
  )}
  {isOpenPopAdd && (
    <div className="popupEvent">
      <Button variant="contained" onClick={togglePopup}>
        X
      </Button>
      <h2>Ajouter un event</h2>
      <DateTimePicker
  placeholder="Select Start Date"
  value={newEvent.start}
  onChange={(start) => setNewEvent({ ...newEvent, start })}
  timePicker
/>
<DateTimePicker
  placeholder="Select End Date"
  value={newEvent.end}
  onChange={(end) => setNewEvent({ ...newEvent, end })}
  timePicker
/>
<Input
  type="text"
  placeholder="Add Title"
  value={newEvent.title}
  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
/>
      <br />
      <br />
      <Button variant="contained" onClick={handleAddEvent}>
        Ajouter
      </Button>
    </div>
  )}
  </Stack>
           <Card>
            <Calendar
                    localizer={localizer}
                    events={calendarView === "global" ? events : Resv}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "50px" }}
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

          </Card>
      </Container>
  </>
  )}


    