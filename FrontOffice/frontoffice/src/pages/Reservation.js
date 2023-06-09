import { Helmet } from 'react-helmet-async';
import React,{useState,useEffect} from 'react';
import { Calendar, momentLocalizer  } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-datepicker/dist/react-datepicker.css"
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import { DateTimePicker } from 'datetime-picker-reactjs'
import 'datetime-picker-reactjs/dist/index.css'
import axios from 'axios';
// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,Input ,FormControl,
  FormControlLabel,
  FormLabel,
  
  FormGroup,Radio,RadioGroup
} from '@mui/material';
import { useLocation} from "react-router-dom";
import Iconify from '../components/iconify';
// sections
export default function Reservation() {
 
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
    return {
      title: `${reservation.nomService}`,
      start: reservation.startDateResv,
      end: reservation.endDateResv,
      personnel: `${reservation.nomPerso} ${reservation.prenomPerso}`,
      client: `${reservation.nom} ${reservation.prenom}`,
      allDay: false,
    };
  }
  
  const [newEvent, setNewEvent] = useState({ title:"", start: new Date(), end:new Date(),nom:"",prenom:"",nomPerso:"",prenomPerso:"" });
 
  const events = Resv.map((reservation) => createEvent(reservation));
 console.log(events)
  const [allEvents,setAllEvents]=useState(events)


const handleAddEvent = () => {
  const { title, start, end ,nom,prenom,nomPerso,prenomPerso} = newEvent;
  const startTimestamp = Date.parse(start);
  const endTimestamp = Date.parse(end);

  const newEventObject = { title, start: new Date(startTimestamp), end: new Date(endTimestamp),nom,prenom,nomPerso,prenomPerso};
  setAllEvents([...allEvents, newEventObject]);
  setNewEvent({ title: '', start: new Date(), end: new Date(),nom:"",prenom:"",nomPerso:"",prenomPerso:"" });
};
  const handleSelectEvent = (event, e) => {
  const popover = new bootstrap.Popover(e.target, {
      title: event.title,
      content: `
        <p>Start: ${event.start.toLocaleString()}</p>
        <p>End: ${event.end.toLocaleString()}</p>
        <p> Client: ${event.client}</p>
        <p> Personnel: ${event.personnel}</p>`,
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
        <title> User | Minimal UI </title>
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
        value={new Date(newEvent.start)}
        onChange={(start) => setNewEvent({ ...newEvent, start })}
        timePicker
      />
      <DateTimePicker
        placeholder="Select End Date"
        value={new Date(newEvent.end)}
        onChange={(end) => setNewEvent({ ...newEvent, end })}
        timePicker
      />
      <br />
      <Input
        type="text"
        placeholder="Add Title"
        value={newEvent.title}
        onChange={(e) =>
          setNewEvent({ ...newEvent, title: e.target.value })
        }
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
    
<RadioGroup aria-label="sexe" name="personnels" style={{ display: 'flex', flexDirection: 'row' }}>
  {PersoCalen.map((row) => (
    <FormControlLabel
      key={row.nom}
      value={row.nom}
      control={<Radio />}
      label={row.nom}
      selected={calendarView === row.CIN}
      onChange={() => showCalendar(row.CIN)}
    />
  ))}
</RadioGroup>



 <Calendar
        localizer={localizer}
        events={calendarView === "global" ? events : Resv}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

 </Card>
      </Container>

     
    </>
  );
}
