import { Helmet } from "react-helmet-async";
import { MDBContainer} from 'mdb-react-ui-kit';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import img from "../Assets/logo2.png";
import img2 from "../Assets/merci.png";
import {
    TextField,
    Card,
    Container
  } from '@mui/material';
  import { BsStar, BsStarFill } from 'react-icons/bs';
import FullButton from "./Home/components/Buttons/FullButton";



  export default function AvisClient() {
    const [rating, setRating] = useState(0);

  const handleStarHover = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    console.log(`Vous avez sélectionné ${selectedRating} étoile(s).`);
  };
  const location=useLocation()
  const clientCIN =location.pathname.split('/')[2]
  const centreRef =location.pathname.split('/')[3]
  const reservRef =location.pathname.split('/')[4]
  const [centres,setCentres]=useState([]);
  const [comm,setComm]=useState("");
  const [resers,setResers]=useState([]);
  const [client,setClient]=useState([]);
  const [serv,setServ]=useState([]);
  const [avis,setAvis]=useState([]);
  const [ isUploaded, setIsUploaded] = useState(false);

      useEffect(() => {
        axios.get(`http://localhost:5000/api/avis/${clientCIN}`)
          .then(res => setAvis(res.data)
          );
        }, []);
        useEffect(() => {
          axios.get(`http://localhost:5000/api/getCentreByref/${centreRef}`)
            .then(res => setCentres(res.data)
            );
          }, []);
        useEffect(() => {
          axios.get(`http://localhost:5000/api/getclientByref/${clientCIN}`)
            .then(res => setClient(res.data)
            );
          }, []);
          useEffect(() => {
            axios.get(`http://localhost:5000/api/getresvByref/${reservRef}`)
              .then(res => setResers(res.data)
              );
            }, []);
            useEffect(() => {
              axios.get(`http://localhost:5000/api/getservByref/${reservRef}`)
                .then(res => setServ(res.data)
                );
              }, []);
              function currentTime(d) {
                const date = new Date(d);
                const day = date.getDate();
                const month = date.getMonth() + 1; // Janvier est 0
                const year = date.getFullYear();
                return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
              }
              const insert= (event) => {
                event.preventDefault();
                axios.put(`http://localhost:5000/api/addAvis/${avis[0].reference}`, {
                  comm
                  , rating
                  
                });
                setIsUploaded(true)
              }
              if(isUploaded){
                return(
                  <>
                  <div style={{paddingLeft:"400px",paddingTop:"95px",backgroundColor:"#F1F1F1"}}>
                   <Card style={{width:"500px",height:"700px"}}>
                    <Container style={{paddingTop:"20px", paddingBottom:"20px"}}>
                      <img src={img2} alt="Image" style={{ position: "absolute", top: "110px",paddingLeft:"20px"}} />
                   </Container>
                   </Card>
                   <img src={img} alt="Image" style={{ position: "absolute", top: "90px", right: "200px" }} />

                   <br/><br/><br/><br/>
            </div>

                  </>
                )}
  return (
    <>
    <Helmet>
        <title> CLASSY | ADMIN... </title>
      </Helmet>
            <div style={{paddingLeft:"400px",paddingTop:"95px",backgroundColor:"#F1F1F1"}}>
                   <Card style={{width:"500px",height:"700px"}}>
                    <Container style={{paddingTop:"20px", paddingBottom:"20px"}}>
                    <div style={{textAlign:"center"}}>
                        <h2 >Avis </h2>
                        <br/>
                      </div>
                      <h4>Informations</h4><br/>
                      <Container>
                      <p>
                        Client : {client.length===0?"":client[0].nom} {client.length===0?"":client[0].prenom}<br/>
                        Centre : {centres.length===0?"":centres[0].nom} <br/>
                        Service : {serv.length===0?"":serv[0].nomService} <br/>
                        Prix : {serv.length===0?"":serv[0].prix} Dinar<br/>
                        Le {serv.length===0?"":currentTime(resers[0].startDateResv)}
                      </p>
                      </Container>
                      <br/>
                    <div style={{paddingLeft:"120px"}}>
                    {[...Array(5)].map((_, index) => {
                        const starRating = index + 1;
                        return (
                        <span
                            key={index}
                            onMouseEnter={() => handleStarHover(starRating)}
                            onMouseLeave={() => handleStarHover(rating)}
                            onClick={() => handleStarClick(starRating)}
                            style={{paddingLeft:"20px"}}
                        >
                            {rating >= starRating ? (
                            <BsStarFill className="star"/> 
                            ) : (
                            <BsStar className="star"/>
                            )}
                        </span>
                        );
                    })}
                    </div> <br/>
                    <TextField
                        name="commentaire"
                        label="Commentaire"
                        variant="outlined"
                        value={comm}
                        onChange={(e)=>setComm(e.target.value)}
                        InputProps={{
                            classes: {
                              input: 'customInput', // Utilisez la classe personnalisée ici
                            },
                          }}
                        fullWidth
                        /><br/>
                        <div style={{width:"40%",paddingTop:"20px",paddingLeft:"70px"}}  onClick={insert}>
                        <FullButton title="Envoyer"/>
                        </div>
                        
                   </Container>
                   </Card>
                   <img src={img} alt="Image" style={{ position: "absolute", top: "90px", right: "200px" }} />

                   <br/><br/><br/><br/>
            </div>

    </>
  );
}