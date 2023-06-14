import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate ,useLocation, useParams} from "react-router-dom";
import { Table, TableHead, TableBody, TableRow, TableCell, Button, TablePagination, IconButton } from '@mui/material';
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { format, startOfWeek, addDays, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import moment from 'moment';

const Calendrier = ({ refCentre, cinPersonnel, onReservation }) => {
  const [Time, setTime] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [formattedReservations, setFormattedReservations] = useState([]);
  const [Resv, setResv] = useState([]);
  const [perso, setPerso] = useState([]);
  const [hourSelect, setHourSelect] = useState("");
   const CIN = parseInt(cinPersonnel);
   const location=useLocation()
   const nomSalon =location.pathname.split('/')[2].split('%20').join(' ')
   const service =location.pathname.split('/')[3].split('%20').join(' ')
  useEffect(() => {
    if (CIN!== 0) {
      axios.get(`http://localhost:5000/api/getResvPerso/${cinPersonnel}`)
        .then(res => {
          const formattedData = res.data.map((reservation) => ({
            startDateResv: moment(reservation.startDateResv).toDate(),
            endDateResv: moment(reservation.endDateResv).toDate(),
          }));
          setResv(formattedData);
          setFormattedReservations(formattedData);
        })
        .catch(error => console.error(error));
    } else {
      axios.get(`http://localhost:5000/api/getReservation/${refCentre}`)
        .then(res => {
          const formattedData = res.data.map((reservation) => ({
            startDateResv: moment(reservation.startDateResv).toDate(),
            endDateResv: moment(reservation.endDateResv).toDate(),
          }));
          setResv(formattedData);
          setFormattedReservations(formattedData);
        })
        .catch(error => console.error(error));
    }
  }, [refCentre, cinPersonnel]);
  const currentDate = new Date();
  
  useEffect(() => {
    const fetchCalendarData = () => {
      const endDate = addMonths(currentDate, 2); // Deux mois à partir de la date actuelle
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
      if (CIN !== 0) {
        // Charger les données du calendrier personnel
        axios.get(`http://localhost:5000/api/heureCalendrierPerso/${cinPersonnel}?endDate=${formattedEndDate}`)
          .then(res => {
            setTime(res.data);
          })
          .catch(error => console.error(error));
      } else {
        // Charger les données du calendrier du centre
        axios.get(`http://localhost:5000/api/heureCalendrier/${refCentre}?endDate=${formattedEndDate}`)
          .then(res => {
            setTime(res.data);
          })
          .catch(error => console.error(error));
      }
    };
  
    fetchCalendarData();
  }, [refCentre, cinPersonnel]);
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
    
   
   
  const renderDaysHeader = () => {
    const startDate = addDays(currentDate, page * 7);
    const endDate = addDays(startDate, 6);

    return Time.map((res, index) => {
      const date = addDays(startDate, index);
      const formattedDate = format(date, "'le' d MMMM", { locale: fr });
      const day = format(date, " eeee ", { locale: fr });

      return (
        <TableCell
          key={index}
          align="center"
          sx={{ borderBottom: 'none', marginLeft: '0.5px', paddingRight: '0.5px' }}
        >
          {day} <br /> {formattedDate}
        </TableCell>
      );
    });
  };
 
   const isPastTime = (date, time) => {
      const selectedDateTime = new Date(date);
      selectedDateTime.setHours(time.split(':')[0]);
      selectedDateTime.setMinutes(time.split(':')[1]);
    
      const currentDateTime = new Date();
    
      return selectedDateTime < currentDateTime;
    }; 
  const renderHourCells = () => {
    const isReservationExists = (selectedDate, selectedTime) => {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedTime.split(':')[0]);
      selectedDateTime.setMinutes(selectedTime.split(':')[1]);
      
      return Resv.some(reservation => {
        const startDateResv = new Date(reservation.startDateResv);
        const endDateResv = new Date(reservation.endDateResv);
        return selectedDateTime >= startDateResv && selectedDateTime <= endDateResv;
      });
    };
  
    const currentTime = moment();
    return (
      <TableRow>
        {Time.map((res, index) => {
          const startTime = moment(res.ouverture, 'HH:mm');
          const endTime = moment(res.fermeture, 'HH:mm');
          const interval = moment.duration(30, 'minutes');
          const currentTime = startTime.clone();
          const hours = [];
  
          while (currentTime.isSameOrBefore(endTime)) {
            const formattedTime = currentTime.format('HH:mm');
            hours.push(formattedTime);
            currentTime.add(interval);
          }
          return (
            <TableCell
              key={index}
              align="center"
              sx={{ borderBottom: 'none', marginLeft: '0.5px', paddingRight: '0.5px' }}
            >
              {hours.map((hour, hourIndex) => {
                const selectedDate = addDays(addDays(currentDate, page * 7), index);
                const reservationExists = isReservationExists(selectedDate, hour);
                const isTimePast = isPastTime(selectedDate, hour);
                
                return (
                  <Button
                  key={hourIndex}
                  className="heurs"
                  style={{ marginBottom: '7px' }}
                  disabled={reservationExists || isTimePast }

                  onClick={() => handleDayChange(index, hour)}
                >
                  {hour}
                </Button>
                
                );
              })}
            </TableCell>
          );
          
          })}
        </TableRow>
      );
    };  
    const handleDayChange = async (index, hour) => {
      const selectedDate = addDays(addDays(currentDate, page * 7), index);
      const selectedTime = moment(hour, 'HH:mm').format('HH:mm');
      const dateTime = {
        date: selectedDate,
        time: selectedTime,
      };
    
      const selectedDateTime = { date: new Date(dateTime.date), time: dateTime.time };
    
      setSelectedDateTime(dateTime);
      const formattedDateTime = new Date(selectedDateTime.date);
      formattedDateTime.setUTCHours(selectedDateTime.time.split(':')[0]);
      formattedDateTime.setMinutes(selectedDateTime.time.split(':')[1]);
      formattedDateTime.setSeconds(0);
      const formattedDateTimeString = formattedDateTime.toISOString().slice(0, 19).replace('T', ' ');
      onReservation(formattedDateTimeString,CIN);
    };
    
  
    
      
        const handlePreviousPage = () => {
          setPage((prevPage) => prevPage - 1);
        };
      
        const handleNextPage = () => {
          setPage((prevPage) => prevPage + 1);
        };
      
        return (
          <div style={{ background: '#ffffff', display: 'flex', justifyContent: 'center', paddingLeft: '180px', paddingRight: '180px' }}>
          <Table style={{ background: 'none' }}>
          
              
                <IconButton onClick={handlePreviousPage} disabled={page === 0} style={{ marginRight: '55px', top: '60px' }}>
                    <MdArrowBackIos />
                  </IconButton>
                    <TableBody>{renderDaysHeader()}
                  <IconButton onClick={handleNextPage} disabled={page === 8} style={{ top: '20px' }}>
                    <MdArrowForwardIos />
                  </IconButton>
            <TableRow/>
                {renderHourCells()}
              </TableBody>
            </Table>
  
          </div>
        );}
        export default Calendrier;