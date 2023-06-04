import {MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBRow, MDBCol} from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';
import  {Card, InputAdornment} from '@material-ui/core';
import React, {	useState, useEffect, useRef} from "react";
import axios from "axios";
import img1 from '../Assets/propDemande.png';
import done from '../Assets/propDemandeDone.png';
import imgTunisia from '../Assets/icons-tunisie.png'
import Iconify from "../components/iconify";
import { Container } from 'react-bootstrap';
import Footer from './Footer';
import Navbar from './Navbar/navbar';


const EnvDemande= () =>{
    useEffect(() => {
        axios
          .get("http://localhost:5000/api/getAllDemandes")
          .then((res) => setDemandes(res.data));
      }, []);
      const [demandes,setDemandes]=useState([]);
      const [nom, setNom] = useState('');
      const [prenom, setPrenom] = useState('');
      const [mail, setMail] = useState('');
      const [tel, setTel] = useState(0);
      const [fichier, setFichier] = useState('');
      const [ isUploaded, setIsUploaded] = useState(false);
      const formRef = useRef(null);
      
      const [errMessageTel, setErrMessageTel]=useState('');
      const [errorTel, setErrorTel] = useState(false);
      const [messageTel, setMessageTel]=useState(false);
  
      const [errMessageMail, setErrMessageMail]=useState('');
      const [error, setError] = useState(false);
      const [messageMail, setMessageMail]=useState(false);
  
      const [errMessagePrenom, setErrMessagePrenom]=useState('');
      const [errorPrenom, setErrorPrenom] = useState(false);
      const [messagePrenom, setMessagePrenom]=useState(false);
  
      const [errMessageNom, setErrMessageNom]=useState('');
      const [errorNom, setErrorNom] = useState(false);
      const [messageNom, setMessageNom]=useState(false);
      
      const [errMessageFile, setErrMessageFile]=useState('');
      const [errorFile, setErrorFile] = useState(false);
      const [messageFile, setMessageFile]=useState(false);
      const [mailE, setMailE] = useState(false);
  
      const [test1, setTest1] = useState(true);
      const [test2, setTest2] = useState(true);
      const [test3, setTest3] = useState(true);
      const [test4, setTest4] = useState(true);
      const [test5, setTest5] = useState(true);
      const scrollThreshold = "header scroll";
      const imgStyle = {
        width: '100%',
        height: '100%',
        display: 'block',
      };
      const formStyle = {
        width:"400px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      };
      const divStyle={
        width:"600px",
      }
      const texStyle={
        paddingTop:'10px',
        textAlign:"center",
      }
      
      const emailValidation=(e)=>{
        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
        const emailValue=e.target.value
        setMail(emailValue)
        if(mail.match(pattern)){
          setMessageMail(true)
        }else {
          setMessageMail(false)
        }
        for (let i = 0; i< demandes.length; i++) {
          if(demandes[i].email===mail){
            console.log(demandes[i].email===mail)
            setMailE(true)
          }
          }
          if(demandes.length===0){
            setMailE(false)
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
      const prenomValidation=(e)=>{
        const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
        const prenomValue=e.target.value
        setPrenom(prenomValue)
        if(prenom.match(pattern)){
          setMessagePrenom(true)
        }else {
          setMessagePrenom(false)
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
      const handleClick = () => {
         if (fichier.current) {
            fichier.current.click();
    }
      };
      const fileValidation=(e)=>{
        const fileValue=e.target.value
        setFichier(fileValue)
        console.log(e.target.files[0].type)
        if(e.target.files[0].type !== 'application/pdf'){
          setMessageFile(true)
        }else {
          setMessageFile(false)
        }
      }
      const onSubmit = async ( evt ) =>{
        evt.preventDefault();
        if(mail===''){
          setError(true)
          setErrMessageMail('Le champ est obligatoire.')
        }else
        if(!messageMail){
          setError(true)
          setErrMessageMail('Le champ est invalid.')
        }else if(mailE){
          setError(true)
          setErrMessageMail('Cette adresse e-mail est déjà utilisée.')
        }else{
          setError(false)
          setErrMessageMail('')
          setTest1(false)
        }
        if(nom===''){
          setErrorNom(true)
          setErrMessageNom('Le champ est obligatoire.')
          console.log(errorNom)
        }else
        if(!messageNom){
          setErrorNom(true)
          setErrMessageNom('Le champ est invalid.')
        }else{
          setErrorNom(false)
          setErrMessageNom('')
          setTest2(false)
        }
        if(prenom===''){
          setErrorPrenom(true)
          setErrMessagePrenom('Le champ est obligatoire.')
        }else
        if(!messagePrenom){
          setErrorPrenom(true)
          setErrMessagePrenom('Le champ est invalid.')
        }else {
          setErrorPrenom(false)
          setErrMessagePrenom('')
          setTest3(false)
        }
        if(tel===0){
          setErrorTel(true)
          setErrMessageTel('Le champ est obligatoire.')
        }else
        if(!messageTel){
          setErrorTel(true)
          setErrMessageTel('Le champ est invalid.')
        }else {
          setErrorTel(false)
          setErrMessageTel('')
          setTest4(false)
        }
        if(fichier===''){
          setErrorFile(true)
          setErrMessageFile('Le champ est obligatoire.')
        }else
        if(messageFile){
          setErrorFile(true)
          setErrMessageFile('Le champ être de type PDF.')
        }else {
          setErrorFile(false)
          setErrMessageFile('')
          setTest5(false)
        }
        if (!formRef){
          return;
        }
        if (formRef && !test1 && !test2 && !test3 && !test4 && !test5){
          setIsUploaded(true)
          const response = await fetch (formRef.current.action, {
            method: formRef.current.method,
            body: new FormData(formRef.current)
          })
          console.log(isUploaded)
        }
        
      };
      if(isUploaded){
          return(
            <>
            <Navbar change={scrollThreshold} />
            <br/><br/><br/>
            <Container>
  
            <div  style={{ display: 'flex', paddingTop:"50px"}}>
                <Card><img src={img1} alt="..."   style={imgStyle} /></Card>
            
            <div >
                <Card><img src={done} alt="..."  style={imgStyle} /></Card>
            </div>
            </div>
            <div style={{ paddingBottom:"20px",paddingLeft:"550px",paddingTop:"20px"}}>
                                <a href="/">
                      <MDBBtn style={{ backgroundColor:'black'}} rounded size='lg' type='submit'>Accueil</MDBBtn></a>
                                </div>
          </Container>
          <Footer/>
          </>
          );
        }
  
    return (
      <>
      <Navbar change={scrollThreshold} />
      <br/><br/><br/>
      <Container>
      <div style={{ display: 'flex', paddingTop:"50px"}}>
        <Card>
        <img src={img1} alt="..." style={imgStyle} />
        </Card>
        
        <div style={formStyle}>
                  <Card style={divStyle}>
                    <h6 style={texStyle}>Vous étes gérant d'un établissement beauté ?<br/>un de nos experts vous recontacte</h6><br/>
                    <form 
                            ref = {formRef}
                            action = "http://localhost:5000/api/enyoyerDemande"
                            method = "POST"
                            onSubmit = {onSubmit}
                             >
                        <h6 style={{paddingLeft:"50px",paddingTop:'10px'}}>Prénom*</h6><br/>
                        
                        <TextField
                        placeholder='Entrer votre prénom...' 
                        size='lg' 
                        name='prenom'
                        style={{paddingLeft:"50px",width:"400px"}} 
                        type='text'
                        value={prenom}
                        onChange={prenomValidation}
                        error={errorPrenom}
                        helperText={errorPrenom ? errMessagePrenom : ''}
                              /><br/>
                        <h6  style={{paddingLeft:"50px",paddingTop:'10px'}}>Nom*</h6><br/>
                        <TextField
                        placeholder='Entrer votre nom...' 
                        size='lg' 
                        style={{paddingLeft:"50px",width:"400px"}}
                        name='nom' 
                        type='text'
                        value={nom}
                        onChange={nomValidation}
                        error={errorNom}
                        helperText={errorNom ? errMessageNom : ''}
                              /><br/>
                        <h6 style={{paddingLeft:"50px",paddingTop:'10px'}}>Email*</h6><br/>
                        <TextField
                        placeholder='Entrer votre email...' 
                        size='lg' 
                        style={{paddingLeft:"50px",width:"400px"}}
                        name='mail' 
                        type='text'
                        value={mail}
                        onChange={emailValidation}
                        error={error}
                        helperText={error ? errMessageMail : ''}
                              /><br/>
                        <h6  style={{paddingLeft:"50px",paddingTop:'10px'}}>Téléphone portable*</h6><br/>
                        <TextField
                        placeholder='00 000 000' 
                        size='lg' 
                        name='tel' 
                        style={{paddingLeft:"50px",width:"400px" }}
                        type='number'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <img src={imgTunisia} alt="..."/>
                            </InputAdornment>
                          ),
                        }}
                        onChange={telValidation}
                        error={errorTel}
                        helperText={errorTel ? errMessageTel : ''}
                      /><br/>
                        <h6 style={{paddingLeft:"50px"}}>Document*</h6>
                        <div style={{paddingLeft:"50px",}}>
                        <div style={{textAlign: 'center',border: '3px dashed black',padding: '1.5rem',position: 'relative',cursor: 'pointer',width:"350px"}} onClick={handleClick}>
                        <Iconify
                                  icon={"line-md:cloud-upload-loop"}
                                  width={48}
                                  height={48}
                                  sx={{
                                    mr: 2,
                                  }}
                                /><br/>
                                <h3>Cliquez sur le box</h3>
                                <TextField  
                                  size='lg'
                                  type="file"
                                  name="fichier"
                                  style={{display: 'block',position: 'absolute',top: '0',
                                    bottom: '0',
                                    left: '0',
                                    right: '0',
                                    opacity: '0',
                                    cursor: 'pointer'}}
                                  onChange={fileValidation}
                                  error={errorFile}
                                  helperText={errorFile ? errMessageFile : ''}
                                  />
                                  {errorFile && <p style={{ color: 'red' }}>Le fichier doit être un PDF !</p>}
                        </div>
                        </div>
                        <br/>
                               <div style={{ paddingBottom:"20px",paddingLeft:"110px"}}>
                                
                      <MDBBtn style={{ backgroundColor:'black'}} rounded size='lg' type='submit'>Découvrir gratuitement</MDBBtn>
                                </div> 
                    </form>
                  </Card>
            </div></div>
      </Container>
      <br/><br/>
      <Footer/>
      </>
    );
}

export default EnvDemande