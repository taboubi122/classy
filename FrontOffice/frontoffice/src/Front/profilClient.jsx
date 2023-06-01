import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, makeStyles, CardContent, CardHeader, CardMedia, Typography, Grid, IconButton,} from "@material-ui/core";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import Swal from "sweetalert2";
import { Buffer } from 'buffer';
import {TfiPencil}from "react-icons/tfi"
import {BsStars}from "react-icons/bs"
import {MdOutlineAccessTime,MdUpdate}from "react-icons/md"
import {TbTrash}from "react-icons/tb"
import {FaMoneyBillWave} from 'react-icons/fa'
import Footer from "./Footer";
import Navbar from './Navbar/navbar';
const useStyles = makeStyles((theme) => ({
    input: {
      display: "none",
    },
    button: {
      margin: theme.spacing(1),
    },
      root: {
        display: 'flex',
        alignItems: 'left',
        width: '500px',
      },
      media: {
        marginTop: '50px', 
        marginLeft: '20px', 
        width: '200px', 
        marginRight: '20px', 
        borderRadius:'10px'
      },
  }));

const ProfilClient = ({isLoggedIn}) => {
  const [email, setEmail] = useState('');
  const [client, setClient] = useState([]);
  const [activeTab, setActiveTab] = useState('account');
  const [editing, setEditing] = useState(false);
  const [editedNom, setEditedNom] = useState('');
  const [editedPrenom, setEditedPrenom] = useState('');
  const [editedPhoto, setEditedPhoto] = useState('');
const [editedTel, setEditedTel] = useState('');
const [editClient, setEditClient] = useState("");
const [editMode, setEditMode] = useState(false);
const[imagess,setImagess]=useState("");
const[resv,setResv]=useState([]);
const[del,setDel]=useState([]);

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = format(date, "EEEE 'le' dd MMMM HH:mm", { locale: fr });
  return formattedDate;
}


  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);


  useEffect(() => {
    axios.get(`http://localhost:5000/api/getInfosClient/${email}`)
      .then(res => {
        setClient(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [email]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getResvClient/${email}`)
      .then(res => {
        setResv(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [email]); 
  
  const formatDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
  
    if (hours > 0) {
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}min`;
      }
    } else {
      return `${minutes}min`;
    }
  };
  

  const { activeCode } = useParams();
  const scrollThreshold = "header scroll";
 
  const classes = useStyles();
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const edit = async (client) => {
    setEditMode(true)
    setEditClient(client)
  };
  const Update = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/updateClient/${email}`,{
        nom: editClient.nom,
        prenom: editClient.prenom,
        tel: editClient.tel,
        photo: editClient.photo
      });
      console.log("client Update success");
      window.location.reload();
    } catch (err) {
      console.log(err);
      console.log("client Update failed");
      window.location.reload();
    }  };
 
    const onDelete= (reference)=>{
      const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
          title: 'Êtes-vous sûr?',
          text: "Vous ne pourrez pas revenir en arrière!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, supprimer!',
          cancelButtonText: 'Non, annuler!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
           axios.delete(`http://localhost:5000/api/deleteResv/${reference}`)
           .then(res => setDel(res.data));
            swalWithBootstrapButtons.fire(
              'Supprimé!',
              'Votre reservation a été supprimé.',
              'success'
            )
           window.location.reload()
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              'Annulé',
              'Votre reservation est en sécurité :)',
              'erreur'
            )
          }
        })
        
      
 }
  return (
    <>
      <Navbar change={scrollThreshold} isLoggedIn={isLoggedIn}/>
      <div className='navBarLinks' />
      <section className='profilClient'>
        <div className='container'>
          <div className="img-container">
            <br />
            <div className="container">
              <Card>
                {client.map((row) => {
                  return (
                    <div className="bg-white shadow rounded-lg d-block d-sm-flex">
                      <div className="profile-tab-nav border-right">
                        <div className="p-4">
             
                        <div className="img-circle text-center mb-3">
  {editClient.photo && editClient.photo.data && !editMode ? (
    
    <img className="shadow" alt={1} src={editClient.photo} />
  ) : (
   
    <img className="shadow" alt={1} src={`${Buffer.from(row.photo.data)}`}  />
   
  )}

  {editMode ? (
    <>
    
      <input
        className={classes.input}
        id="photo"
        name="photo"
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          const reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onload = () => {
            const newPhoto = reader.result;
            setEditClient(prevState => ({ ...prevState, photo: newPhoto }));
            setEditedPhoto(newPhoto);
            setImagess(newPhoto);
          };
        }}
      />

      <label htmlFor="photo" style={{ position: 'absolute', top: '28%', transform: 'translate(-50%, -50%)' }}>
        <i><TfiPencil style={{ position: 'absolute', right: '30%' }} size={20} onClick={() => setEditing(true)} /></i>
      </label>
    </>
  ) : ( <>
   
    <i></i></>
  )}
</div>

                          <h3 className="text-center">{row.nom} {row.prenom}</h3>
                        </div>
                        <div className=" flex-column nav-pills" id="v-pills-tab" >
                          <a
                            className={`nav-link ${activeTab === 'account' ? 'active-black' : ''}`}
                           
                            aria-selected={activeTab === 'account' ? 'true' : 'false'}
                            onClick={() => handleTabChange('account')}
                            style={{
                              backgroundColor: activeTab === 'account' ? 'black' : '',
                              color: activeTab === 'account' ? 'white' : ''
                            }}
                            href
                          >
                            <i className="fa fa-home text-center mr-1"></i>
                            Account
                          </a>
                           <a className={`nav-link ${activeTab === 'password' ? 'active-black' : ''}`}
                            
                            aria-selected={activeTab === 'password' ? 'true' : 'false'}
                            onClick={() => handleTabChange('password')}
                            style={{
                                backgroundColor: activeTab === 'password' ? 'black' : '',
                                color: activeTab === 'password' ? 'white' : ''
                            }}
                            >
                            <i className="fa fa-key text-center mr-1"></i> 
                            Password
                            </a>
                            <a
                            className={`nav-link ${activeTab === 'Reservation' ? 'active-black' : ''}`}
                            
                            aria-controls="reservation"
                            aria-selected={activeTab === 'reservation' ? 'true' : 'false'}
                            onClick={() => handleTabChange('reservation')}
                            style={{
                                backgroundColor: activeTab === 'reservation' ? 'black' : '',
                                color: activeTab === 'reservation' ? 'white' : ''
                            }}
                            >
                            <i className="fa fa-user text-center mr-1"></i> 
                            reservation
                            </a>
                            <a
                            className={`nav-link ${activeTab === 'notification' ? 'active-black' : ''}`}
                            
                            aria-controls="notification"
                            aria-selected={activeTab === 'notification' ? 'true' : 'false'}
                            onClick={() => handleTabChange('notification')}
                            style={{
                                backgroundColor: activeTab === 'notification' ? 'black' : '',
                                color: activeTab === 'notification' ? 'white' : ''
                            }}
                            >
                            <i className="fa fa-bell text-center mr-1"></i> 
                            Notification
                            </a>  </div>
                    
                      </div>
                      <div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
                      <div className={`tab-pane fade ${activeTab === 'account' ? 'show active' : ''}`} id="account" role="tabpanel" aria-labelledby="account-tab">
  <h3 className="mb-4">Profil</h3>
  {editMode ? (
          // Affichez le formulaire de mise à jour
          <div className="row">
            <div className="col-md-12">
              <div className="form-groupProfil">
                <label>Nom :</label>
                <input
                  name="nom"
                  type="text"
                  className="form-control"
                  value={editClient.nom}
                  onChange={(e) => {
                    setEditClient(prevState => ({...prevState, nom: e.target.value}));
                    setEditedNom(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-groupProfil">
                <label>Prénom :</label>
                <input
                  name="prenom"
                  type="text"
                  className="form-control"
                  value={editClient.prenom}
                  onChange={(e) => {
                    setEditClient(prevState => ({...prevState, prenom: e.target.value}));
                    setEditedPrenom(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-groupProfil">
                <label>Telephone :</label>
                <input
                  name="tel"
                  type="text"
                  className="form-control"
                  value={editClient.tel}
                  onChange={(e) => {
                    setEditClient(prevState => ({...prevState, tel: e.target.value}));
                    setEditedTel(e.target.value);
                  }}
                />
              </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12">
              <div className="form-groupProfil">
                <label>Nom :</label>
                <span>{row.nom}</span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-groupProfil">
                <label>Prénom :</label>
                <span>{row.prenom}</span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-groupProfil">
                <label>Telephone:</label>
                <span>{row.tel}</span>
              </div>
            </div>
          </div>
        )}
        <div>
          {editMode ? (
            <>
              <button className="btnBlack" onClick={Update}>Enregistrer</button>
              <button className="btnBlack" onClick={() => setEditMode(false)}>Annuler</button>
            </>
          ) : (
            <button className="btnBlack" onClick={() => edit(row)}>Mettre à jour</button>

          )}
  </div>
</div>


                      <div className={`tab-pane fade ${activeTab === 'password' ? 'show active' : ''}`} id="password" role="tabpanel" aria-labelledby="password-tab">
                        <h3 className="mb-4">Password Settings</h3>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-groupProfil">
                              <label>Old password</label>
                              <input type="password" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-groupProfil">
                              <label>New password</label>

                              <input type="password" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-groupProfil">
                              <label>Confirm password</label>
                              <input type="password" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="col-md-12">
                            <div className="form-groupProfil">
                            </div>
                          </div>
                          <button className="btnBlack">Mettre à jour</button>
                          <span></span>
                          <button className="btnBlack">Annuler</button>
                        </div>
                      </div>
                      <div className={`tab-pane fade ${activeTab === 'reservation' ? 'show active' : ''}`} id="reservation" role="tabpanel" aria-labelledby="reservation-tab">
                        <h3 className="mb-4">Mes rendez-vous </h3>
                        <div className="row">
                         
                        </div>
                        <div>
                          <div className="col-md-12">
                            <div className="form-groupProfil"> {resv.map((row) => (
                            <React.Fragment>
                              
                              <Card className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
        <img  className={classes.media}
            alt='1'
            src={`data:image/png;base64,${Buffer.from(row.src.data).toString('base64')}`}
          />
        
        </Grid>
        <Grid item xs={8}>
          <CardHeader title={formatDate(row.startDateResv)} />
          <CardContent>
          <Typography variant="body1">{row.nom}</Typography>
          <Typography variant="body1"><BsStars/> {row.nomService}</Typography>
          <Typography variant="body1"><MdOutlineAccessTime/> {formatDuration(row.duree)} <span/> <FaMoneyBillWave/> {row.prix}D</Typography>

          </CardContent>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <IconButton>
              <button className="btnBlack" onClick={() => onDelete(row.reference)}><TbTrash/> Annuler</button>

              </IconButton>
            </Grid>
            <Grid item>
              <IconButton>
            <button className="btnBlack" ><a href={`reservation/${row.nom}/${row.nomService}/${row.reference}`}><MdUpdate/> Deplacer</a></button>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card><br/></React.Fragment>
                                          ))}

                            </div>
                          </div>
                          
                        </div>
                      </div>
                  
                      <div className={`tab-pane fade ${activeTab === 'notification' ? 'show active' :
                        ''}`} id="notification" role="tabpanel" aria-labelledby="notification-tab">
                        <h3 className="mb-4">Notification Settings</h3>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-groupProfil">
                              <label>Email Notifications</label>
                              <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="emailNotifications" />
                                <label className="form-check-label" htmlFor="emailNotifications">Receive email notifications</label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-groupProfil">
                              <label>SMS Notifications</label>
                              <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="smsNotifications" />
                                <label className="form-check-label" htmlFor="smsNotifications">Receive SMS notifications</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="col-md-12">
                            <div className="form-groupProfil">
                            </div>
                          </div>
                          <button className="btn">Mettre à jour</button>
                          <span></span>
                          <button className="btn">Annuler</button>
                        </div>
                      </div>
                    </div>
            </div> 
                  );
                })}
              </Card>
              <br/><br/>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProfilClient;
