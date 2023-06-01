import { Helmet } from "react-helmet-async";
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import axios from "axios";
import img from '../Assets/PersoLogin.png';
import { useNavigate } from 'react-router-dom';
import { black } from "material-ui/styles/colors";
import TopNavbarVide from "./Home/components/Nav/TopNavbarVide";


  export default function PropLogin() {

    const [props, setProps]=useState([])

    useEffect(() => {
		axios
			.get("http://localhost:5000/api/LoginProp")
			.then((res) => setProps(res.data));
	}, []);

    const [pass, setPass] = useState('');
    const [mail, setMail] = useState('');

    const [errMessageMail, setErrMessageMail]=useState('');
    const [error, setError] = useState(false);
    const [messageMail, setMessageMail]=useState(false);

    const [errMessagePass, setErrMessagePass]=useState('');
    const [errorPass, setErrorPass] = useState(false);

    const [test1, setTest1] = useState(true);
    const [test2, setTest2] = useState(true);
    const navigate = useNavigate();

    const emailValidation=(e)=>{
      const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
      const emailValue=e.target.value
      setMail(emailValue)
      if(mail.match(pattern)){
        setMessageMail(true)
      }else {
        setMessageMail(false)
      }
    }

    const handleInsert = (event) => {
		event.preventDefault();
        const getMail=props.filter((ele) => ele.email === mail);
        console.log(getMail)
    if(mail===''){
      setError(true)
      setErrMessageMail('Le champ est obligatoire.')
      setErrorPass(true)
      setErrMessagePass('Le champ est obligatoire.')
    }else
    if(!messageMail){
      setError(true)
      setErrMessageMail('Le champ est invalid.')
    }else if(getMail.length===0){
      setError(true)
      setErrMessageMail('Email incorrecte.')
    }else{
      setError(false)
      setErrMessageMail('')
      setTest1(false)
    }
    const p=pass
    console.log()
    if(pass.length===0){
      setErrorPass(true)
      setErrMessagePass('Le champ est obligatoire.')
    }
    else if(!getMail.length===0 && !getMail[0].password===p){
      setErrorPass(true)
      setErrMessagePass('Mote de pass incorrecte.')
    }else{
      setErrorPass(false)
      setErrMessagePass('')
      setTest2(false)
    }

   console.log(getMail[0].CIN) 
    console.log("test1: ",test1," test2: ",test2)
    if(!test1 && !test2){
        navigate(`/dashboardCentre/${getMail[0].CIN}/app`);
    }
	};
  return (
    <>
    <Helmet>
        <title> CLASSY | PROPR... </title>
      </Helmet>
      <TopNavbarVide />
      <div style={{ backgroundColor:black }}>
    <br/><br/><br/>
    <MDBContainer fluid className='bg-dark'>
    
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol>

          <MDBCard className='my-4 c'>

            <MDBRow className='g-0'>

              <MDBCol md='6' className="d-none d-md-block">
                <MDBCardImage src={img} alt="..." className="rounded-start" fluid/>
              </MDBCol>
              <MDBCol md='6'>
                
                <MDBCardBody className='text-black text-center d-flex flex-column justify-content-center rp'>
                <h6 className="mb-5 text-uppercase demandeProp">Se Connecter </h6>
                  <MDBRow className='justify-content-left'>
                  <MDBCol md='6'>
                      <h6 className='LabelColor'>Email*</h6>
                      <TextField 
                      placeholder='EMAIL...' 
                      size='lg' 
                      id='form1'
                      className="selectProp" 
                      type='text'
                      value={mail}
                      onChange={emailValidation}
                      error={error}
                      helperText={error ? errMessageMail : ''}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow  className='justify-content-left'>
                  <MDBCol md='6'  className='padding'>
                      <h6 className='LabelColor'>Mot de passe*</h6>
                      <TextField 
                      placeholder="********" 
                      id='form1' 
                      className="selectProp"
                      size='lg' 
                      type='password'
                      value={pass}
                      onChange={(event) => {
                        setPass(event.target.value);
                      }}
                      error={errorPass}
                      helperText={errorPass ? errMessagePass : ''}
                      />
                    </MDBCol>
                  </MDBRow>
                  <div className="d-flex justify-content-left pt-3 bAut">
                    <MDBBtn rounded className='color' size='lg' onClick={handleInsert}>Confirmer</MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow><br/><br/>
    </MDBContainer>
    </div>
    </>
  );
}