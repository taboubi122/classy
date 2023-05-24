import {MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBRow, MDBCol} from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';
import  {InputAdornment} from '@material-ui/core';
import React, {	useState, useEffect, useRef} from "react";
import axios from "axios";
import img1 from '../Assets/propDemande.png';
import done from '../Assets/propDemandeDone.png';
import imgTunisia from '../Assets/icons-tunisie.png'
import Iconify from "../components/iconify";


  export default function EnvoyerDemandePage() {
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
          <MDBContainer fluid className='bg-dark'>

          <MDBRow className='d-flex justify-content-center align-items-center h-100'>
            <MDBCol>
    
              <MDBCard className='my-4'>
    
                <MDBRow className='g-0'>
    
                  <MDBCol md='6' className="d-none d-md-block">
                    <MDBCardImage src={img1} alt="..." className="rounded-start" fluid/>
                  </MDBCol>
    
                  <MDBCol md='6'>
    
                  <MDBCardImage src={done} alt="..." className="rounded-start" fluid/>
    
                  </MDBCol>
                </MDBRow>
              </MDBCard>
    
            </MDBCol>
          </MDBRow>
    
        </MDBContainer>
        </>
        );
      }

  return (
    <>
    <MDBContainer fluid className='bg-dark'>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol>

          <MDBCard className='my-4'>

            <MDBRow className='g-0'>

              <MDBCol md='6' className="d-none d-md-block">
                <MDBCardImage src={img1} alt="..." className="rounded-start img" fluid/>
              </MDBCol>

              <MDBCol md='6'>

                <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                  <h6 className="mb-5 text-uppercase demandeProp">Vous étes gérant d'un établissement beauté ?<br/>un de nos experts vous recontacte</h6>
                  <form 
                          ref = {formRef}
                          action = "http://localhost:5000/api/enyoyerDemande"
                          method = "POST"
                          onSubmit = {onSubmit}
                           >
                  <MDBRow className='justify-content-center'>

                    <MDBCol md='6'   className='padding'>
                      <h6 className='LabelColor'>Prénom*</h6>
                      
                      <TextField
                      placeholder='Entrer votre prénom...' 
                      className='selectProp'
                      size='lg' 
                      name='prenom' 
                      type='text'
                      value={prenom}
                      onChange={prenomValidation}
                      error={errorPrenom}
                      helperText={errorPrenom ? errMessagePrenom : ''}
                            />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className='justify-content-center'>
                    <MDBCol md='6'  className='padding'>
                      <h6 className='LabelColor'>Nom*</h6>
                      <TextField
                      placeholder='Entrer votre nom...' 
                      className='selectProp'
                      size='lg' 
                      name='nom' 
                      type='text'
                      value={nom}
                      onChange={nomValidation}
                      error={errorNom}
                      helperText={errorNom ? errMessageNom : ''}
                            />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className='justify-content-center'>

                  <MDBCol md='6'  className='padding'>
                      <h6 className='LabelColor'>Email*</h6>
                      <TextField
                      placeholder='Entrer votre email...' 
                      className='selectProp'
                      size='lg' 
                      name='mail' 
                      type='text'
                      value={mail}
                      onChange={emailValidation}
                      error={error}
                      helperText={error ? errMessageMail : ''}
                            />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className='justify-content-center'>
                    <MDBCol md='6'  className='padding'>
                      <h6 className='LabelColor'>Téléphone portable*</h6>
                      <TextField
                      placeholder='00 000 000' 
                      size='lg' 
                      name='tel' 
                      type='number'
                      className="selectProp"
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
                    />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className='justify-content-center'>
                    <MDBCol md='6'   className='padding'>
                      <h6 className='LabelColor'>Document*</h6>
                      
                              <div className="file-upload">
                              <Iconify
                                icon={"line-md:cloud-upload-loop"}
                                width={48}
                                height={48}
                                sx={{
                                  mr: 2,
                                }}
                              />
                              <h3>Cliquez sur le box</h3>
                              <TextField  
                                size='lg'
                                type="file"
                                name="fichier"
                                className='TextField'
                                onChange={fileValidation}
                                error={errorFile}
                                helperText={errorFile ? errMessageFile : ''}
                                />
                                {errorFile && <p style={{ color: 'red' }}>Le fichier doit être un PDF !</p>}
                            </div>
                    </MDBCol>
                    
                  </MDBRow>
                  <MDBRow className='justify-content-center'>
                    <MDBCol md='6'  className='padding'>
                    <MDBBtn rounded className='ms-2 color' size='lg' type='submit'>Découvrir gratuitement</MDBBtn>
                    </MDBCol>
                  </MDBRow>
                  </form>
                </MDBCardBody>

              </MDBCol>
            </MDBRow>
          </MDBCard>

        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </>
  );
}