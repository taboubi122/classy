import { Helmet } from "react-helmet-async";
import { MDBContainer} from 'mdb-react-ui-kit';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import * as Icons from '@material-ui/icons';
import mapboxgl from 'mapbox-gl';
import { useLocation } from 'react-router-dom';


import {
    Stack,
    Button,
    MenuItem,
    TextField,
    FormControl, InputLabel, Select,
    Grid,
  } from '@mui/material';



  export default function AjouterCentre() {
  const navigate = useNavigate();
  const [selectedPoint, setSelectedPoint] = useState({lng:0,lat:0});
  const [isSelected,setIsSelected]= useState(null);

  const [images, setImages] = useState([]);
  const [vimages, setvImages] = useState(false);
  const [nbImg,setNbImg]=useState(0);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState();
  const [ville, setVille] = useState();
  const [adresse, setAdresse] = useState("");
  const [spec, setSpec] = useState();
	const [description, setDescription] = useState("");

    const [errMessageNom, setErrMessageNom]=useState('');
    const [errorNom, setErrorNom] = useState(false);
    const [messageNom, setMessageNom]=useState(false);
    
    const [errMessageEmail, setErrMessageEmail]=useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [messageEmail, setMessageEmail]=useState(false);

    const [errMessageTel, setErrMessageTel]=useState('');
    const [errorTel, setErrorTel] = useState(false);
    const [messageTel, setMessageTel]=useState(false);

    const [errMessageVille, setErrMessageVille]=useState('');
    const [errorVille, setErrorVille] = useState(false);

    const [errMessageAdresse, setErrMessageAdresse]=useState('');
    const [errorAdresse, setErrorAdresse] = useState(false);
    const [messageAdresse, setMessageAdresse]=useState(false);

    const [errMessageSpec, setErrMessageSpec]=useState('');
    const [errorSpec, setErrorSpec] = useState(false);

    const [errMessageImage, setErrMessageImage]=useState('');
    const [errorImage, setErrorImage] = useState(false);

    const [errMessageDescription, setErrMessageDescription]=useState('');
    const [errorDescription, setErrorDescription] = useState(false);
    const [messageDescription, setMessageDescription]=useState(false);

    const [test1, setTest1] = useState(true);
    const [test2, setTest2] = useState(true);
    const [test3, setTest3] = useState(true);
    const [test4, setTest4] = useState(true);
    const [test5, setTest5] = useState(true);
    const [test6, setTest6] = useState(true);
    const [test7, setTest7] = useState(true);
    const [test8, setTest8] = useState(true);
    const togglePopup = () => {
      setIsSelected(!isSelected);
      document.body.style.overflow = "auto";
    };
    let [lati, setLat] = useState(0);
    let [long, setLong] = useState(0);
    const handleImageUpload = (event) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          images.push(reader.result)
        };
      setNbImg(images.length)
      setvImages(true)
    };
  
    const handleSuccess = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      lati=latitude
      long=longitude
      console.log('Latitude:', lati);
      console.log('Longitude:', long);
    }

    const handleMapClick = (event) => {
      const { lat, lng } = {lati,long}
      setSelectedPoint({ lat, lng });
    };

    const handleGetCoordinates = () => {
      navigator.geolocation.getCurrentPosition(handleSuccess);
      const l={lat:lati, lng:long }
      setSelectedPoint(l);
      console.log('point:', selectedPoint);
      setIsSelected(true)
      if (isSelected) {
        console.log("Coordonnées sélectionnées :", lati, long);
      }
    };
    const emailValidation=(e)=>{
      const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
      const emailValue=e.target.value
      setEmail(emailValue)
      if(email.match(pattern)){
        setMessageEmail(true)
      }else {
        setMessageEmail(false)
      }
    }
    const nomValidation=(e)=>{
      const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
      const nomValue=e.target.value
      setNom(nomValue)
      if(nom.match(pattern)){
        setMessageNom(true)
      }else {
        setMessageNom(false)
      }
      
    }
    const adresseValidation=(e)=>{
      const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
      const nomValue=e.target.value
      setAdresse(nomValue)
      if(adresse.match(pattern)){
        setMessageAdresse(true)
      }else {
        setMessageAdresse(false)
      }
      
    }
    const descValidation=(e)=>{
      const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
      const descValue=e.target.value
      setDescription(descValue)
      if(description.match(pattern)){
        setMessageDescription(true)
      }else {
        setMessageDescription(false)
      }
    }
    const telValidation = (e) => {
      const pattern = /^\d{8}$/;
      const telValue = e.target.value;
      setTel(telValue);
      if (telValue.match(pattern)) {
        setMessageTel(true);
      } else {
        setMessageTel(false);
      }
    };
    const location=useLocation()
    const refCentre =location.pathname.split('/')[4]
    const handleInsert = (event) => {
		event.preventDefault();
    if(email===''){
      setErrorEmail(true)
      setErrMessageEmail('Le champ est obligatoire.')
    }else
    if(!messageEmail){
      setErrorEmail(true)
      setErrMessageEmail('Le champ est invalid.')
    }else{
      setErrorEmail(false)
      setErrMessageEmail('')
      setTest1(false)
    }
    if(nom===''){
      setErrorNom(true)
      setErrMessageNom('Le champ est obligatoire.')
    }else
    if(!messageNom){
      setErrorNom(true)
      setErrMessageNom('Le champ est invalid.')
    }else{
      setErrorNom(false)
      setErrMessageNom('')
      setTest2(false)
    }
    if(tel.length===0){
      setErrorTel(true)
      setErrMessageTel('Le champ est obligatoire.')
    }else
    if(!messageTel){
      setErrorTel(true)
      setErrMessageTel('Le champ est invalid.')
    }else{
      setErrorTel(false)
      setErrMessageTel('')
      setTest3(false)
    }
    if(adresse===''){
      setErrorAdresse(true)
      setErrMessageAdresse('Le champ est obligatoire.')
    }else
    if(!messageAdresse){
      setErrorAdresse(true)
      setErrMessageAdresse('Le champ est invalid.')
    }else{
      setErrorAdresse(false)
      setErrMessageAdresse('')
      setTest4(false)
    }
    if(description===''){
      setErrorDescription(true)
      setErrMessageDescription('Le champ est obligatoire.')
    }else
    if(!messageDescription){
      setErrorDescription(true)
      setErrMessageDescription('Le champ est invalid.')
    }else{
      setErrorDescription(false)
      setErrMessageDescription('')
      setTest5(false)
    }
    if(spec.length===0){
      setErrorSpec(true)
      setErrMessageSpec('Le champ est obligatoire.')
    }else{
      setErrorSpec(false)
      setErrMessageSpec('')
      setTest6(false)
    }
    if(ville.length===0){
      setErrorVille(true)
      setErrMessageVille('Le champ est obligatoire.')
    }else{
      setErrorVille(false)
      setErrMessageVille('')
      setTest7(false)
    }
    if(images.length===0){
      setErrorImage(true)
      setErrMessageImage('Le champ est obligatoire.')
    }else{
      setErrorImage(false)
      setErrMessageImage('')
      setTest8(false)
    }

    if(!test1 && !test2 && !test3 && !test4 && !test5 && !test6 && !test7 && !test8){
      axios.put(`http://localhost:5000/api/addCentre/${refCentre}`, {
      nom
			, email
			, images
			, spec
			, ville
			, description
      , tel
      , adresse
		});
    axios.post(`http://localhost:5000/newHeure/${refCentre}`);
    navigate(`/dashboardCentreProp/${refCentre}/horairesProp`);

    
    }
	};
  return (
    <>
    <Helmet>
        <title> CLASSY | ADMIN... </title>
      </Helmet>
      <Grid item xs={12} md={6} lg={8}>
        
    <MDBContainer>
            <form encType='multipart/form-data' method='POST'>
            <Stack spacing={3}>
                <TextField
                  id="outlined-basic"
                  name="nom"
                  label="Nom"
                  variant="outlined"
                      value={nom}
                      onChange={nomValidation}
                      error={errorNom}
                      helperText={errorNom ? errMessageNom : ''}
                  fullWidth /> 

                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                      value={email}
                      onChange={emailValidation}
                      error={errorEmail}
                      helperText={errorEmail ? errMessageEmail : ''}
                  fullWidth
                  />
                <TextField
                  name="tel"
                  label="Tel"
                  variant="outlined"
                      value={tel}
                      onChange={telValidation}
                      error={errorTel}
                      helperText={errorTel ? errMessageTel : ''}
                  fullWidth
                  />
                <FormControl>
            <InputLabel id="dropdown-label">Selectionner Votre ville</InputLabel>
            <Select
            labelId="dropdown-label"
            id="dropdown"
            onChange={(event) => {
              setVille(event.target.value);
            }}
          error={errorVille}
            >
            <MenuItem value="2">
            Tunis
            </MenuItem>
            <MenuItem value="1">
            Carthage
            </MenuItem>
            <MenuItem value="3">
            Goulette
            </MenuItem>
            <MenuItem value="4">
            Bardo
            </MenuItem>
            <MenuItem value="5">
            Sidi Bousaid
            </MenuItem>
            <MenuItem value="7">
            Zaghouan
            </MenuItem>
            <MenuItem value="8">
            Ain Drahem
            </MenuItem>
            <MenuItem value="9">
            Kairouan
            </MenuItem>
            <MenuItem value="10">
            Bizerte
            </MenuItem>
            <MenuItem value="11">
            Sousse
            </MenuItem>
            <MenuItem value="12">
            Hammamet
            </MenuItem>
            <MenuItem value="13">
            Djerba
            </MenuItem>
            <MenuItem value="14">
            Tabarka
            </MenuItem>
            <MenuItem value="15">
            Tozeur
            </MenuItem>
            <MenuItem value="16">
            Kelibia
            </MenuItem>
            <MenuItem value="17">
            Beja
            </MenuItem>
        </Select>
        {errorVille? <span className="err">{errMessageVille}</span>:''}
        </FormControl>
        <TextField
            name="adresse"
            label="Adresse"
            variant="outlined"
            value={adresse}
            onChange={adresseValidation}
            error={errorAdresse}
            helperText={errorAdresse ? errMessageAdresse : ''}
            fullWidth
            />
            <FormControl>
            <InputLabel id="dropdown-label">Selectionner Votre specialité</InputLabel>
            <Select
            labelId="dropdown-label"
            id="dropdown"
            onChange={(event) => {
              setSpec(event.target.value);
            }}
          error={errorSpec}
            >
            <MenuItem value="Coiffeur">
            Coiffeur
            </MenuItem>
            <MenuItem value="Barbier">
            Barbier
            </MenuItem>
            <MenuItem value="Manucure">
            Manucure
            </MenuItem>
            <MenuItem value="Institut de beauté">
            Institut de beauté
            </MenuItem>
        </Select>
        {errorSpec? <span className="err">{errMessageSpec}</span>:''}

            </FormControl>
            <TextField
            name="description"
            label="Description"
            variant="outlined"
            value={description}
            onChange={descValidation}
            error={errorDescription}
            helperText={errorDescription ? errMessageDescription : ''}
            fullWidth
            />
        
            
            <input
            id="photo"
            name="photo"
            type="file"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            />
            {errorImage? <span className="err">{errMessageImage}</span>:''}
            <label htmlFor="photo">
            <Button
            variant="contained"
            color="primary"
            startIcon={<Icons.PhotoCamera />}
            
            component="span"
            > Images
            </Button>  {nbImg} images<br/><br/> 
            {vimages && (
              <label htmlFor="photo">
              <p
                variant="contained"
                color="primary"
                startIcon={<Icons.PhotoCamera />}
                component="span"
              >
                Vous pouvez ajouter des images
              </p>
              </label>
            )}
            </label>
            </Stack>
            </form>
            <br/>
            <Button type="submit" variant="contained" className='BtnEnreg' onClick={handleInsert}>
            Suivant
            </Button>

    </MDBContainer>
    </Grid>
    </>
  );
}