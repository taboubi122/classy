import { Helmet } from 'react-helmet-async';
import { filter, set } from 'lodash';
import { Modal,Form} from 'react-bootstrap';
import ReactModal from "react-modal";
import { Buffer } from 'buffer';
import {useState, useEffect,React } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  FormControl, InputLabel, Select,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Radio,RadioGroup, Box
} from '@mui/material';
// components
import { useLocation} from "react-router-dom";
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import Label from '../components/label';
import Iconify from '../components/iconify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '', alignRight: false },
  { id: 'nom', label: 'Nom', alignRight: false },
  { id: 'Cin', label: 'CIN', alignRight: false },
  { id: 'telephone', label: 'Telephone', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'sexe', label: 'Sexe', alignRight: false },
  {id:'valide'},
  { id: '' },
  { id: '' },
];

  

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el) => [el, el.CIN]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.nom.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function PersonnelPage() {
    
  const location = useLocation();
  const IdSalon = location.pathname.split("/")[2];
  console.log(IdSalon);
  useEffect(()=>{
    axios.get(`http://localhost:5000/api/getAllPersonnels/${IdSalon}`)
    .then(res=>setClient(res.data)
    );
     },[]);
     useEffect(()=>{
      axios.get(`http://localhost:5000/api/services/${IdSalon}`)
      .then(res=>setService(res.data)
      );
       },[]);
     
    
       const [service, setService] = useState([]);

     function onDelete(CIN)
    {   
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
              axios.delete(`http://localhost:5000/api/deletePerso/${CIN}`)
              
              console.log(CIN)  
               swalWithBootstrapButtons.fire(
                 'Supprimé!',
                 'Votre personnel a été supprimé.',
                 'success'
               )
              window.location.reload()
             } else if (
               result.dismiss === Swal.DismissReason.cancel
             ) {
               swalWithBootstrapButtons.fire(
                 'Annulé',
                 'Votre personnel est en sécurité :)',
                 'erreur'
               )
             }
           })
           
         
    }
        
  const [client,setClient] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [selectedPerso, setSelectedPerso] = useState("");

  const [orderBy, setOrderBy] = useState('nom');

  const [filternom, setFilternom] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [setCIN]=useState();
    
  const [isOpenPopAdd, setIsOpenPopAdd] = useState(false);
  const [isOpenPopUpd, setIsOpenPopUpd] = useState(false);

  const [nom, setNom] = useState("");
const [CIN, setCIN2] = useState("");
const [prenom, setPrenom] = useState("");
const [sexe, setSexe] = useState("");
const [email, setEmail] = useState("");
const [tel, setTel] = useState("");
const [fonction, setFonction] = useState("");
const [password, setPassword] = useState("");
const [photo, setPhoto] = useState("");
const[imagess,setImagess]=useState("");
const [selectedOption] = useState("Femme");
const [nomService,setNomservice] = useState("");
 
  const togglePopup = () => {
    setIsOpenPopAdd(!isOpenPopAdd);
    document.body.style.overflow = "auto"; // rétablit le défilement de la page lorsque le pop-up est fermé

  }
  const togglePopup2 = (Perso) => {
    setIsOpenPopUpd(!isOpenPopUpd);
    document.body.style.overflow = "auto"; // rétablit le défilement de la page lorsque le pop-up est fermé
    console.log(Perso)
    setSelectedPerso(Perso)
  }
 
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = client.map((n) => n.nom);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, nom) => {
    const selectedIndex = selected.indexOf(nom);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, nom);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
    
  async function filter(val) {
      try {
        const res = await axios.get(`http://localhost:5000/api/personnels/search/${val}`);
        setFilternom(res.data);
        console.log(typeof val, val);
      } catch (err) {
        console.log("Registation Failed")
      }
    
  }

  const handleFilterBynom = (event) => {
    const filterValue = event.target.value;
    setPage(0); 
   
    console.log(`filterValue ${event.target.value}`);
    console.log(typeof filterValue, filterValue);

      setFilternom(filterValue);
  
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - client.length) : 0;

  const filteredUsers = applySortFilter(client, getComparator(order, orderBy), filternom);

  const isNotFound = !filteredUsers.length && !!filternom;
  // defining the insert function outside the JSX element
  const Insert = async (num,name,preName,telephone,genre,role,service,mail,passw,pic) => {

    try {
      await axios.post(`http://localhost:5000/api/insertPerso/${IdSalon}`,
      {CIN:num,nom:name,
        prenom:preName,sexe:genre,email:mail,photo,fonction:role,nomService:service,tel:telephone,password:passw});
      console.log("perso Registration success");
      setIsOpenPopAdd(false);
      window.location.reload()
    } catch (err) {
      console.log(err);
      console.log("perso Registration failed");
    }
  };
  const Update = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/updatePerso/${selectedPerso.CIN}`,
       {nom:selectedPerso.nom,
        prenom:selectedPerso.prenom,
          email:selectedPerso.email,
         password:selectedPerso.password,
          tel:selectedPerso.tel,
       photo:selectedPerso.photo});
      console.log("perso Update success");
      setIsOpenPopUpd(false);
      window.location.reload()
    } catch (err) {
      console.log(err);
      console.log("perso Update failed");
      setIsOpenPopUpd(false);
      window.location.reload()
    }
  };
 
  const ConvertToBased64 = (e) => {
    console.log(e);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setPhoto(reader.result);
    };
    reader.onerror=error =>{
      console.log("error",error);
    }
  };
  const [selectedValue, setSelectedValue] = useState('Option 1');

  const handleSelectionChange = (event) => {
    setSelectedValue(event.target.value);
    setNomservice(event.target.value)
  };

  const classes = useStyles();
  const checkMail = async (mail) => {
    try {
      const query = await axios.get(`http://localhost:5000/api/getMail/${mail}`);
      return query.data.length > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const checkCIN = async (CIN) => {
    try {
      const query = await axios.get(`http://localhost:5000/api/getCIN/${CIN}`);
      return query.data.length > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const validateCIN = async (value) => {
    const isValid = /^\d{8}$/.test(value);
    if (isValid) {
      const isCINExist = await checkCIN(value);
      return !isCINExist || "CIN existant déjà";
    }
    return "CIN doit être un nombre entier de 8 chiffres";
  };
  
  const validateTel = (value) => {
    const isValid = /^\d{8}$/.test(value); // vérifier que la valeur est un nombre de 8 chiffres
    return isValid || "tel doit être un nombre entier de 8 chiffres"; // renvoyer un message d'erreur si la valeur n'est pas valide
  };

  const validateEmail = async (value) => {
    const isValid = /\S+@\S+\.\S+/.test(value); 
    if (isValid) {
      const isEmailExist = await checkMail(value);
      return !isEmailExist|| "Email existant déjà";
    }// vérifier que la valeur est un e-mail valide
    return isValid || "L'adresse e-mail doit être valide"; // renvoyer un message d'erreur si la valeur n'est pas valide
  };
  const validatePassword = (value) => {
    const isValid =
      value.length >= 8 &&
      /[a-z]/.test(value) &&
      /[A-Z]/.test(value) &&
      /\d/.test(value);
    return isValid || "Le mot de passe doit contenir au moins 8 caractères, une lettre minuscule, une lettre majuscule et un chiffre";
  };
  const validateNom = (value) => {
    const regex = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/; // regex pour vérifier que le nom ne contient pas les caractères spécifiés et a une longueur d'au moins 3
    return regex.test(value) || "Nom invalide"; // renvoyer un message d'erreur si la valeur n'est pas valide
  };
  const validatePrenom= (value) => {
    const regex = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/; // regex pour vérifier que le nom ne contient pas les caractères spécifiés et a une longueur d'au moins 3
    return regex.test(value) || "Prenom invalide"; // renvoyer un message d'erreur si la valeur n'est pas valide
  };
  const validateFonction = (value) => {
    const regex = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/; // regex pour vérifier que le nom ne contient pas les caractères spécifiés et a une longueur d'au moins 3
    return regex.test(value) || "Fonction invalide"; // renvoyer un message d'erreur si la valeur n'est pas valide
  };
 
  const validateRadio = (value) => {
    return value !== undefined || "Le champ sexe est obligatoire";
  };
  
  const validateDropdown = (value) => {
    return value !== "" || "Le champ service est obligatoire";
  };
  
  const validateFile = (value) => {
    if (!value || value.length === 0) {
      return "Le champ photo est obligatoire";
    }
    return true;
  };
  
const { register, handleSubmit, watch, formState: { errors } } = useForm();
const onSubmit = (data) => Insert(data.CIN,data.nom,data.prenom,data.tel,data.sexe,data.fonction,data.service,data.email,data.password);
  return (
    <>
      <Helmet>
        <title> CLASSY | PERSONNELS</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
           Personnels
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={togglePopup}>
            Nouveau personnel
          </Button>
          {isOpenPopAdd && (

        <div  className="popup-overlay">
          <div className="popup">
            <Button variant="contained" onClick={togglePopup}>X</Button>
            <h2>Ajouter un personnel</h2>
            
       <form encType='multipart/form-data' method='POST' onSubmit={handleSubmit(onSubmit)}>

       <Stack spacing={3}>
      <TextField
        id="outlined-basic"
       name="CIN"
       label="CIN"
        variant="outlined"
         fullWidth
         {...register("CIN", { required: "CIN est requis.", validate: validateCIN })}
         error={Boolean(errors.CIN)}
         helperText={errors.CIN?.message} /> 

        <TextField
          name="nom"
          label="Nom"
          variant="outlined"
          fullWidth
          {...register("nom", { required: "Nom est requis.", validate: validateNom })}
          error={Boolean(errors.nom)}
          helperText={errors.nom?.message}
        />

      <TextField
        name="prenom"
        label="Prenom"
        variant="outlined"
        fullWidth
        {...register("prenom", { required: "Prenom est requis.", validate: validatePrenom })}
        error={Boolean(errors.prenom)}
        helperText={errors.prenom?.message}
      />
          <FormControl>
  <InputLabel id="dropdown-label">Service</InputLabel>
  <Select
    labelId="dropdown-label"
    id="dropdown"
    {...register("service", { validate: validateDropdown })}
    error={Boolean(errors.service)}
  >
    {service.map((option) => (
      <MenuItem value={option.nomService}>
        {option.nomService}
      </MenuItem>
    ))}
  </Select>
  {errors.service && (
    <FormHelperText error>{errors.service.message}</FormHelperText>
  )}
</FormControl>

      <TextField
        name="fonction"
        label="Fonction"
        variant="outlined"
          fullWidth
          {...register("fonction", { required: "Fonction est requis.", validate: validateFonction })}
          error={Boolean(errors.fonction)}
          helperText={errors.fonction?.message}
        />

      <TextField
        name="tel"
        label="Tel"
        variant="outlined"
          fullWidth
          {...register("tel", { required: "Tel est requis.", validate: validateTel})}
          error={Boolean(errors.tel)}
          helperText={errors.tel?.message}
        />

      <TextField
        name="email"
        label="Email address"
        variant="outlined"
        fullWidth
        {...register("email", { required: "Email est requis.", validate: validateEmail })}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />
      <TextField
                name="password"
                label="Password"
                type='password'
                variant="outlined"
                fullWidth
                {...register("password", { required: "Password est requis.", validate: validatePassword })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
  
  <FormControl component="fieldset">
  <FormLabel component="legend">Sexe :</FormLabel>
  <RadioGroup aria-label="sexe" name="sexe" fullWidth 
                variant="outlined"
    {...register("sexe", { required: "Selectionner.", validate:validateRadio})}
    error={Boolean(errors.sexe)}
    helperText={errors.sexe?.message}
  >
    <FormControlLabel value="Femme" control={<Radio />} label="Femme" />
    <FormControlLabel value="Homme" control={<Radio />} label="Homme" />
    <FormHelperText error={!!errors.sexe}>
    {errors.sexe ? errors.sexe.message : ""}
  </FormHelperText>
  </RadioGroup>
  
</FormControl>
<input
  className={classes.input}
  id="photo"
  name="photo"
  type="file"
  style={{ display: 'none' }}
  onChange={(event) => {
    ConvertToBased64(event);
  }}
  
/>

<label htmlFor="photo">
  <Button
    variant="contained"
    color="primary"
    startIcon={<Icons.PhotoCamera />}
    component="span"
  > Upload
  </Button>
</label>
  {photo ===""|| photo===null ? "":<img alt="1" width={100} src={photo} className='ClientPhoto'/>}
      </Stack>
      <br/>
      <FormHelperText style={{color:'#d32f2f'}}>{errors.tnc?.message}</FormHelperText>

  <Button type="submit" variant="contained" onClick={(e)=>Insert()} className='BtnEnreg'>
    Enregistrer
  </Button>
</form>
          </div>
        </div>
      )}
          

     
        </Stack>
        <Card>
        <UserListToolbar numSelected={selected.length} filterName={filternom} onFilterName={handleFilterBynom} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
              <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={client.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, nom,prenom, tel, sexe, CIN, photo, email , password} = row;
                    const selectedUser = selected.indexOf(nom) !== -1;
                   
                    return (
                      <TableRow hover key={row.CIN} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                          <Box component="img" alt="..." src={row.photo && `data:image/png;base64,${Buffer.from(row.photo.data).toString('base64')}`} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>                          
                            <Typography variant="subtitle2" noWrap>
                              {nom} {prenom}
                            </Typography>  
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{CIN}</TableCell>

                        <TableCell align="left">{tel}</TableCell>
                       

                        <TableCell align="left">{email}</TableCell>

                      
 
                        <TableCell align="left">
                          <Label>{sexe}</Label>
                        </TableCell>
                        
                      <TableCell align="right">
                                            
                      <IconButton size="large">
                        <a href={`detailPerso/${row.CIN}`} >
                         
                          <Label className='detailsBtn'>Details</Label>
                        
                        </a>
                      </IconButton>

                                      </TableCell>
                      <TableCell align="right">
                                            
                            <IconButton size="large" onClick={() => togglePopup2(row)}
                            sx={{
                              color: "success.main",
                            }}>
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                            </IconButton>
                      </TableCell>
                      {isOpenPopUpd && (

<div  className="popup-overlay">
         <div className="popup">
           <Button variant="contained" onClick={togglePopup2}>X</Button>
           <h2>Modifier un personnel</h2>
      <form onSubmit={Update}> 
      <Stack spacing={3}>
       <TextField
         name="nom"
         label="Nom"
         value={selectedPerso.nom}
         onChange={(e) => {
          setSelectedPerso(prevState => ({...prevState, nom: e.target.value}));
          setNom(e.target.value);
         }}
       />

<TextField
  name="prenom"
  label="Prenom"
  value={selectedPerso.prenom}
  onChange={(e) => {
    setSelectedPerso(prevState => ({...prevState, prenom: e.target.value}));
    setPrenom(e.target.value );
  }}
/>

     <TextField
       name="tel"
       label="Tel"
       value={selectedPerso.tel}
       onChange={(e) => {
        setSelectedPerso(prevState => ({...prevState, tel: e.target.value}));
        setTel(e.target.value);
        }}/>
     <TextField
       name="email"
       label="Email address"
       value={selectedPerso.email}
       onChange={(e) => {
        setSelectedPerso(prevState => ({...prevState, email: e.target.value}));
        setEmail(e.target.value);
        }}/>
     <TextField
               name="password"
               label="Password"
               value={selectedPerso.password}
               onChange={(e) => {
                setSelectedPerso(prevState => ({...prevState, password: e.target.value}));
                setPassword(e.target.value);
                }}/>

<input
 name="photo"
 type="file"  
  onChange={(e)=>{
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setSelectedPerso((prevState) => ({ ...prevState, photo: reader.result}));
      setPhoto(reader.result);
       setImagess( reader.result);
      console.log(`imagesss ${imagess}`);
    };
  }}/> 

{selectedPerso.photo && selectedPerso.photo.data ? (
  <img className='ClientPhoto' alt={id} src={`${Buffer.from(selectedPerso.photo.data)}`} />
) : (
   <img alt="1" className='ClientPhoto' width={100} src={imagess} /> 
)}
  </Stack>

     <br/>
     
 <Button type="submit" variant="contained" className='BtnEnreg' onClick={Update}>
   Mettre a jour
 </Button>
</form>
         </div>
       </div>
     )}
                        <TableCell align="right">
                          
                          <IconButton size="large" sx={{
                                color: "error.main",
                              }}  onClick={() => onDelete(CIN)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                      
                          </IconButton>
                        </TableCell>
                    
                      
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filternom}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={client.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
   
      </Container>
  
   
  
     
    </>
  );
}
