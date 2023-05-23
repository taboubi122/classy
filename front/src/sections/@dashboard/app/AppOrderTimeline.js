// @mui
import PropTypes from 'prop-types';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import {
  Container, 
  Typography,
  Grid,
  Card,
  Table,
  Stack,
  Paper,
  Input,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TablePagination,
  FormControl, InputLabel,
  CardMedia,CardContent,
  CardHeader, Select,
  Link,InputAdornment, TextField
} from '@mui/material';
import {useState, useEffect, React} from 'react';
import axios from 'axios';
import {BsPlusCircle}from "react-icons/bs"

import {BiTrash}from "react-icons/bi"
import { useLocation} from "react-router-dom";
import { useForm } from "react-hook-form";

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {

  const location = useLocation();
  const IdSalon = location.pathname.split("/")[2];
  console.log(IdSalon);
  const [service, setService] = useState([]);
  useEffect(()=>{
    axios.get(`http://localhost:5000/api/services/${IdSalon}`)
    .then(res=>setService(res.data)
    );
     },[]);
const [nomService,setNomservice] = useState("");
const [fonction, setFonction] = useState("");
  const [isOpenPopAdd, setIsOpenPopAdd] = useState(false);
  const togglePopup = () => {
    setIsOpenPopAdd(!isOpenPopAdd);
    document.body.style.overflow = "auto"; // rétablit le défilement de la page lorsque le pop-up est fermé

  }
  const [selectedValue, setSelectedValue] = useState('Option 1');

  const handleSelectionChange = (event) => {
    setSelectedValue(event.target.value);
    setNomservice(event.target.value)
  };
  const CINPerso= location.pathname.split("/")[4];
  console.log(`cinPersooooo${CINPerso}`);
  const Insert = async (event) => {
    try {
      await axios.post(`http://localhost:5000/api/InsertTachePerso/${CINPerso}`,{fonction,nomService});
      console.log("tacheperso Registration success");
      setIsOpenPopAdd(false);
      window.location.reload()
    } catch (err) {
      console.log(err);
      console.log("tacheperso Registration failed");
    }
  };
 
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = (data) => Insert();
  console.log(errors);
  return (
    <Card {...other} >
      <CardHeader title="Fonction & Services" subheader={subheader} />

      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {list.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === list.length - 1} />
          ))}

        </Timeline> 
         <h6>Voulez vous ajouter d'autres ? <IconButton onClick={togglePopup}><BsPlusCircle/></IconButton>   </h6>
      </CardContent>
      {isOpenPopAdd && (

<div  className="popup-overlay">
         <div className="popup">
           <Button variant="contained" onClick={togglePopup}>X</Button>
           <h4>Ajouter d'autre fonction </h4><br/>
      <form encType='multipart/form-data' method='POST' onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
         <FormControl>
     <InputLabel id="dropdown-label">Service </InputLabel>
     <Select
       labelId="dropdown-label"
       id="dropdown"
       value={selectedValue}
       onChange={handleSelectionChange}
     >
       {service.map((option) => (
         <MenuItem  value={option.nomService}>
           {option.nomService}
         </MenuItem>
       ))}
     </Select>
   
   </FormControl>
     <TextField
       name="fonction"
       label="Fonction"
       value={fonction}
       fullWidth
       {...register("fonction", { required: "fonction is required." })}
       error={Boolean(errors.fonction)}
       helperText={errors.fonction?.message}
       onChange={(e) => setFonction(e.target.value)}/>
     </Stack>

     <br/>
     
 <Button type="submit" variant="contained" className='BtnEnreg'>
  Ajouter
 </Button>
</form>
         </div>
       </div>
     )}
      
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    btn:PropTypes.string
  }),
};
const testDel=(row)=>{
  console.log(`rowwww${row}`);
}
function OrderItem({ item, isLast }) {
  const { type, title, time ,btn} = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === 'order1' && 'primary') ||
            (type === 'order2' && 'success') ||
            (type === 'order3' && 'info') ||
            (type === 'order4' && 'warning') ||
            'error'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
      <Typography variant="subtitle2">{title}</Typography>
    
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {time}
        </Typography>
      </TimelineContent>
           <IconButton><BiTrash/></IconButton>,
           
    </TimelineItem>
  );
}
