import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import React, {	useState} from "react";
import TextField from '@mui/material/TextField';
import axios from "axios";
import img from '../Assets/ConfirmationProp.png';
import done from '../Assets/ConfirmationPropDone.png';

  export default function ConfirmationProp() {

    const [pass, setPass] = useState('');
    const [mail, setMail] = useState('');
    const [ isUploaded, setIsUploaded] = useState(false);

    const [errMessageMail, setErrMessageMail]=useState('');
    const [error, setError] = useState(false);
    const [messageMail, setMessageMail]=useState(false);

    const [errMessagePass, setErrMessagePass]=useState('');
    const [errorPass, setErrorPass] = useState(false);

    const [test1, setTest1] = useState(true);
    const [test2, setTest2] = useState(true);

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
    if(mail===''){
      setError(true)
      setErrMessageMail('Le champ est obligatoire.')
    }else
    if(!messageMail){
      setError(true)
      setErrMessageMail('Le champ est invalid.')
    }else{
      setError(false)
      setErrMessageMail('')
      setTest1(false)
    }
    if(pass===''){
      setErrorPass(true)
      setErrMessagePass('Le champ est obligatoire.')
    }else{
      setErrorPass(false)
      setErrMessagePass('')
      setTest2(false)
    }
    if(!test1 && !test2){
		axios.post(`http://localhost:5000/api/ConfirmerDemande`, {mail, pass})
    .then((response) => {
      console.log("reponse : ",response.data.message);
      if(response.data.message){
        setIsUploaded(true)
      }else {
        setIsUploaded(false)
        setErrorPass(true)
        setErrMessagePass('Le mote de passe incorrecte.')
      }
  })
  .catch((error) => {
      console.error(error);
  });}
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
                    <MDBCardImage src={img} alt="..." className="rounded-start" fluid/>
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
                <MDBCardImage src={img} alt="..." className="rounded-start" fluid/>
              </MDBCol>
              <MDBCol md='6'>
                
                <MDBCardBody className='text-black text-center d-flex flex-column justify-content-center '>
                <h6 className="mb-5 text-uppercase demandeProp">Confirmez Votre compte</h6>
                  <MDBRow className='justify-content-center'>
                  <MDBCol md='6'>
                      <h6 className='LabelColor'>Email*</h6>
                      <TextField 
                      placeholder='____@gmail.com' 
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
                  <MDBRow  className='justify-content-center'>
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
                  <div className="d-flex justify-content-center pt-3">
                    <MDBBtn rounded className='ms-2 color' size='lg' onClick={handleInsert}>Confirmer</MDBBtn>
                  </div>
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