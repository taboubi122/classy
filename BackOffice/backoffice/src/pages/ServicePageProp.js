import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// @mui
import {Card, Table, Stack, Paper, Button, TableRow, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import InputAdornment from "@material-ui/core/InputAdornment";
import ScheduleIcon from "@material-ui/icons/Schedule";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock
const TABLE_HEAD = [
	{
		id: "ref"
	, }
	, {
		id: "nom"
		, label: "Nom"
		, alignRight: false
	, }
	, {
		id: "prix"
		, label: "Prix"
		, alignRight: false
	, }
	, {
		id: "duree"
		, label: "Duree"
		, alignRight: false
	, }
	, {
		id: "description"
		, label: "Description"
		, alignRight: false
	, },
	{
		id: "categorie"
		, label: "Categorie"
		, alignRight: false
	, }
	, {
		id: "centre"
		, label: "Centre"
		, alignRight: false
	, },
	{
		id: "valide"
	, },
	{
		id: ""
	, }
, ];
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
	return order === "desc" ?
		(a, b) => descendingComparator(a, b, orderBy) :
		(a, b) => -descendingComparator(a, b, orderBy);
}
// Filter
function applySortFilter(array, comparator, query) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	if (query) {
		return filter(array, (_user) => {
			return (
				_user.nom.toLowerCase()
				.indexOf(query.toLowerCase()) !== -1 ||
				_user.description.toLowerCase()
				.indexOf(query.toLowerCase()) !== -1 ||
				_user.prix.toString()
				.indexOf(query) !== -1
			);
		});
	}
	return stabilizedThis.map((el) => el[0]);
}
export default function ServicePageProp() {
	const params = useParams();
	const idProp = params.id;
	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/getAllServicesProp/${idProp}`)
			.then((res) => setServices(res.data));
	}, []);
	useEffect(() => {
		axios.get("http://localhost:5000/api/getCentres")
			.then((res) => setCentre(res.data));
	}, []);
	useEffect(() => {
		axios.get("http://localhost:5000/api/getAllCategories")
			.then((res) => setCategories(res.data));
	}, []);
	// Delete
	function onDelete(reference) {
		const swalWithBootstrapButtons = Swal.mixin({
			customclassName: {
				confirmButton: "btn btn-success"
				, cancelButton: "btn btn-danger"
			, }
			, buttonsStyling: false
		, });
		swalWithBootstrapButtons
			.fire({
				title: "Êtes-vous sûr?"
				, text: "Vous ne pourrez pas revenir en arrière!"
				, icon: "warning"
				, showCancelButton: true
				, confirmButtonText: "Oui, supprimer!"
				, cancelButtonText: "Non, annuler!"
				, reverseButtons: true
			, })
			.then((result) => {
				if (result.isConfirmed) {
					axios
						.delete(`http://localhost:5000/api/deleteServices/${reference}`)
						.then((res) => setReference(res.data));
					swalWithBootstrapButtons.fire(
						"Supprimé!"
						, "Votre catégorie a été supprimé."
						, "success"
					);
					window.location.reload();
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					swalWithBootstrapButtons.fire(
						"Annulé"
						, "Votre catégories est en sécurité :)"
						, "erreur"
					);
				}
			});
	}
	const msg = "_____________________________________";
	const [categories, setCategories] = useState([]);
	const [centre, setCentre] = useState([]);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState("asc");
	const [selected, setSelected] = useState([]);
	const [orderBy, setOrderBy] = useState("nom");
	const [filternom, setFilternom] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [setReference] = useState();
	const [isOpenPopAdd, setIsOpenPopAdd] = useState(false);
	const [isOpenPopUpdate, setIsOpenPopUpdate] = useState(false);
	const [nom, setNom] = useState("");
	const [description, setDescription] = useState("");
	const [prix, setPrix] = useState('');
	const [duree, setDuree] = useState('');
	const [services, setServices] = useState([]);
	const [refselectedCateg, setRefselectedCateg] = useState([]);
	const [nomUpdate, setNomUpdate] = useState("");
	const [prixUpdate, setPrixUpdate] = useState('');
	const [dureeUpdate, setDureeUpdate] = useState("");
	const [referenceUpdate, setReferenceUpdate] = useState();
	const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [errMessageNom, setErrMessageNom]=useState('');
    const [errorNom, setErrorNom] = useState(false);
    const [messageNom, setMessageNom]=useState(false);
    
    const [errMessageDesc, setErrMessageDesc]=useState('');
    const [errorDesc, setErrorDesc] = useState(false);
    const [messageDesc, setMessageDesc]=useState(false);

    const [errMessagePrix, setErrMessagePrix]=useState('');
    const [errorPrix, setErrorPrix] = useState(false);

    const [errMessageDuree, setErrMessageDuree]=useState('');
    const [errorDuree, setErrorDuree] = useState(false);
    const [messageDuree, setMessageDuree]=useState(false);

    const [errMessageCateg, setErrMessageCateg]=useState('');
    const [errorCateg, setErrorCateg] = useState(false);


    const [test1, setTest1] = useState(true);
    const [test2, setTest2] = useState(true);
    const [test3, setTest3] = useState(true);
    const [test4, setTest4] = useState(true);
    const [test5, setTest5] = useState(true);

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
    const descValidation=(e)=>{
      const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
      const descValue=e.target.value
      setDescription(descValue)
      if(description.match(pattern)){
        setMessageDesc(true)
      }else {
        setMessageDesc(false)
      }
    }

    const dureeValidation=(e)=>{
      const pattern = /^(0[0-9]|09):([0-5][0-9]|55)$/
      const descValue=e.target.value
      setDuree(descValue)
      if(descValue.match(pattern)){
        setMessageDuree(true)
      }else {
        setMessageDuree(false)
      }
    }

	const togglePopup = () => {
		setIsOpenPopAdd(!isOpenPopAdd);
		document.body.style.overflow = "auto";
	};
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = services.map((n) => n.nom);
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
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex)
				, selected.slice(selectedIndex + 1)
			);
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
	const labelRowsPerPage = 'Lignes par page : ';
	const handleFilterBynom = (event) => {
		const filterValue = event.target.value;
		setPage(0);
		setFilternom(filterValue);
	};
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - services.length) : 0;
	const filteredUsers = applySortFilter(
		services
		, getComparator(order, orderBy)
		, filternom
	);
	const isNotFound = !filteredUsers.length && !!filternom;
	// Duree
	function currentTime(d) {
		let duree = "";
		const [hours, minutes] = d.split(":");
		const date = new Date();
		date.setHours(parseInt(hours, 10));
		date.setMinutes(parseInt(minutes, 10));
		if (hours === "00") {
			duree = `${minutes} min`;
		} else if (minutes === "00") {
			duree = `${hours} h`;
		} else {
			duree = `${hours} h ${minutes} min`;
		}
		return duree;
	}
	// Add
	const handleInsert = (event) => {
		event.preventDefault();
    if(nom===''){
      setErrorNom(true)
      setErrMessageNom('Le champ est obligatoire.')
      console.log(errorNom)
    }else
    if(!messageNom){
      setErrorNom(true)
      setErrMessageNom('Le champ est invalid.')
    }else
    if(nom.length>100){
      setErrorNom(true)
      setErrMessageNom('Le champ et de 100 caractères au maximum.')
    }else{
      setErrorNom(false)
      setErrMessageNom('')
      setTest1(false)
    }

    if(description===''){
      setErrorDesc(true)
      setErrMessageDesc('Le champ est obligatoire.')
      console.log(errorDesc)
    }else
    if(!messageDesc){
      setErrorDesc(true)
      setErrMessageDesc('Le champ est invalid.')
    }else
    if(description.length>500){
      setErrorDesc(true)
      setErrMessageDesc('Le champ et de 500 caractères au maximum.')
    }else{
      setErrorDesc(false)
      setErrMessageDesc('')
      setTest2(false)
    }
    console.log(duree==='')
    if(duree===''){
      setErrorDuree(true)
      setErrMessageDuree('Le champ est obligatoire.')
    }else
    if(!messageDuree){
      setErrorDuree(true)
      setErrMessageDuree('Le champ est invalid.')
    }else{
      setErrorDuree(false)
      setErrMessageDuree('')
      setTest3(false)
    }
    //prix
    if(prix.length===0){
      setErrorPrix(true)
      setErrMessagePrix('Le champ est obligatoire.')
    }else
    if(prix.length>4){
      setErrorPrix(true)
      setErrMessagePrix('Le champ est invalid.')
    }else{
      setErrorPrix(false)
      setErrMessagePrix('')
      setTest4(false)
    }

    if(refselectedCateg.length===0){
      setErrorCateg(true)
      setErrMessageCateg('Le champ est obligatoire.')
    }else{
      setErrorCateg(false)
      setErrMessageCateg('')
      setTest5(false)
    }

    if(!test1 && !test2 && !test3 && !test4 && !test5){
      window.location.reload();
      axios.post(`http://localhost:5000/api/addServiceProp`, {
			 nom
			, description
			, prix
			, duree
			, idProp
			, refselectedCateg
		});
		console.log("Service Registration success");
	};
}
	// Get Name categorie
	function getNameCateg(id) {
		const categs = categories.filter((categ) => categ.reference === id);
		return categs.length > 0 ? categs[0].nomCateg : 'Inconnu';
	}
	// Get description
	function getdesc(desc) {
		if (desc.length === 0) {
			return msg
		}
		return desc
	}
	// Update
  const nomUpdateValidation=(e)=>{
    const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
    const nomValue=e.target.value
    setNomUpdate(nomValue)
    if(nomValue===''){
      setMessageNomUpdate(true)
    }else {
      if(nomUpdate.match(pattern)){
        setMessageNomUpdate(true)
      }else {
        setMessageNomUpdate(false)
      }
      }
  }
  const descUpdateValidation=(e)=>{
    const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
    const descValue=e.target.value
    setDescriptionUpdate(descValue)
    if(descValue===''){
      setMessageDescUpdate(true)
    }else{
      if(descValue.match(pattern)){
        setMessageDescUpdate(true)
      }else {
        setMessageDescUpdate(false)
      }
    }
  }

  const dureeUpdateValidation=(e)=>{
    const pattern = /^(0[0-9]|09):([0-5][0-9]|55)$/
    const descValue=e.target.value
    setDureeUpdate(descValue)
    if(descValue===''){
      setMessageDureeUpdate(true)
    }else {
      if(descValue.match(pattern)){
        setMessageDureeUpdate(true)
      }else {
        setMessageDureeUpdate(false)
      }
      
    }
    
  }

  const [errMessageNomUpdate, setErrMessageNomUpdate]=useState('');
    const [errorNomUpdate, setErrorNomUpdate] = useState(false);
    const [messageNomUpdate, setMessageNomUpdate]=useState(false);
    
    const [errMessageDescUpdate, setErrMessageDescUpdate]=useState('');
    const [errorDescUpdate, setErrorDescUpdate] = useState(false);
    const [messageDescUpdate, setMessageDescUpdate]=useState(false);

    const [errMessagePrixUpdate, setErrMessagePrixUpdate]=useState('');
    const [errorPrixUpdate, setErrorPrixUpdate] = useState(false);

    const [errMessageDureeUpdate, setErrMessageDureeUpdate]=useState('');
    const [errorDureeUpdate, setErrorDureeUpdate] = useState(false);
    const [messageDureeUpdate, setMessageDureeUpdate]=useState(false);

    const [errMessageCategUpdate, setErrMessageCategUpdate]=useState('');
    const [errorCategUpdate, setErrorCategUpdate] = useState(false);

    const [test1Update, setTest1Update] = useState(true);
    const [test2Update, setTest2Update] = useState(true);
    const [test3Update, setTest3Update] = useState(true);
    const [test4Update, setTest4Update] = useState(true);
    const [test5Update, setTest5Update] = useState(true);

    function onUpdate(id, nomUpdate, descriptionUpdate, prixUpdate, dureeUpdate, refselectedCateg) {
      if(nomUpdate==='' && descriptionUpdate==='' && prixUpdate.length===0 && dureeUpdate==='' && refselectedCateg.length===0){
        setErrorNomUpdate(true)
        setErrorDescUpdate(true)
        setErrorDureeUpdate(true)
        setErrorPrixUpdate(true)
        setErrorCategUpdate(true)
        setErrMessageCategUpdate('Doit modifier un champ au minimum.')
        setErrMessagePrixUpdate('Doit modifier un champ au minimum.')
        setErrMessageDescUpdate('Doit modifier un champ au minimum.')
        setErrMessageDureeUpdate('Doit modifier un champ au minimum.')
        setErrMessageNomUpdate('Doit modifier un champ au minimum.')
      }else
      if(!messageNomUpdate && !nomUpdate===''){
        setErrorNomUpdate(true)
        setErrMessageNomUpdate('Le champ est invalid.')
      }else
      if(nomUpdate.length>100 && !nomUpdate===''){
        setErrorNomUpdate(true)
        setErrMessageNomUpdate('Le champ et de 100 caractères au maximum.')
      }else{
        setErrorNomUpdate(false)
        setErrMessageNomUpdate('')
        setTest1Update(false)
        setErrorCategUpdate(false)
        setErrMessageCategUpdate('')
        setTest5Update(false)
        setErrorDescUpdate(false)
        setErrMessageDescUpdate('')
        setTest2Update(false)
        setErrorDureeUpdate(false)
        setErrMessageDureeUpdate('')
        setTest3Update(false)
        setErrorPrixUpdate(false)
        setErrMessagePrixUpdate('')
        setTest4Update(false)
      }
      if(!descriptionUpdate===''){
         if(!messageDescUpdate){
          setErrorDescUpdate(true)
          console.log(messageDescUpdate)
          setErrMessageDescUpdate('Le champ est invalid.')
        }else
        if(descriptionUpdate.length>500){
          setErrorDescUpdate(true)
          setErrMessageDescUpdate('Le champ et de 500 caractères au maximum.')
        }
      }
        if(!messageDureeUpdate && !dureeUpdate===''){
          setErrorDureeUpdate(true)
          setErrMessageDureeUpdate('Le champ est invalid.')
        }
      
      if(!prixUpdate.length===0){
        if(prixUpdate.length>4){
          setErrorPrixUpdate(true)
          setErrMessagePrixUpdate('Le champ est invalid.')
        }else{
          setErrorPrixUpdate(false)
          setErrMessagePrixUpdate('')
          setTest4Update(false)
        }
      }
       
  
      if(!test1Update && !test2Update && !test3Update && !test4Update && !test5Update){
        window.location.reload();
        axios.put(`http://localhost:5000/api/UpdateServicesProp/${id}`, {
            nomUpdate
            , descriptionUpdate
            , prixUpdate
            , dureeUpdate
            , idProp
            , refselectedCateg
          })
          .then(() => {
            console.log("Service Updated successfully");
          });
    }
	}
	return (
		<>
      <Helmet>
        <title> CLASSY | SERVICES</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Services |
          </Typography>
          <br />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={togglePopup}
          >
            Nouveau service
          </Button>
          {isOpenPopAdd && (
            <div className="popup-overlay">
              <div className="popup">
                <Button variant="contained" onClick={togglePopup}>
                  X
                </Button>
                <h2> Ajouter un service </h2>
                <Stack spacing={3}>
                  
                  <TextField
                    name="nom"
                    label="Nom *"
                    value={nom}
                    onChange={nomValidation}
                    error={errorNom}
                    helperText={errorNom ? errMessageNom : ''}
                  />
                  <TextField
                    name="prix"
                    label="Prix *"
                    type="number"
                    onChange={(e) => setPrix(e.target.value)}
                    error={errorPrix}
                    helperText={errorPrix ? errMessagePrix : ''}
                  />
                  <InputLabel id="my-select-label">Duree *</InputLabel>
                  <TextField
                    name="duree"
                    type="date time"
                    value={duree}
                    onChange={dureeValidation}
                    error={errorDuree}
                    helperText={errorDuree ? errMessageDuree : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ScheduleIcon />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      step: 60,
                    }}
                  />
                  <InputLabel id="my-select-label">Categories *</InputLabel>
                  <Select
                    labelId="my-select-label"
                    value={refselectedCateg}
                    onChange={(event) => {
                        setRefselectedCateg(event.target.value);
                      }}
                      error={errorCateg}
                    >
                    {categories.map((option) => (
                    <MenuItem key={option.reference} value={option.reference}>
                    {option.nom}
                    </MenuItem>
                ))}
                    </Select>
                    {errorCateg? <span className="err">{errMessageCateg}</span>:''}
                  <TextField
                    name="description"
                    label="Description *"
                    value={description}
                    onChange={descValidation}
                    error={errorDesc}
                    helperText={errorDesc ? errMessageDesc : ''}
                  />
                </Stack>
                <br />
                <Button
                  type="submit"
                  align="centre"
                  variant="contained"
                  onClick={handleInsert}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filternom}
            onFilterName={handleFilterBynom}
          />
          <Scrollbar>
            <TableContainer
              sx={{
                minWidth: 800,
              }}
            >
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={services.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { reference, nomService, description, prix, duree, refCateg, refCentre } = row;
                      const selectedUser = selected.indexOf(nom) !== -1;

                      return (
                        <TableRow
                          hover
                          key={reference}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell padding="checkbox">
                            <div/>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {nomService}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"> {prix} Dinars</TableCell>
                          <TableCell align="left"> {currentTime(duree)} </TableCell>
                          <TableCell align="left"> {getdesc(description)} </TableCell>
                          <TableCell align="left"> {getNameCateg(refCateg)} </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="large"
                              sx={{
                                color: "success.main",
                              }}
                              onClick={() => {
                                setReferenceUpdate(reference);
                                setIsOpenPopUpdate(!isOpenPopUpdate);
                                document.body.style.overflow = "auto";
                              }}
                            >
                              <Iconify
                                icon={"eva:edit-fill"}
                                sx={{
                                  mr: 2,
                                }}
                              />
                            </IconButton>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="large"
                              sx={{
                                color: "error.main",
                              }}
                              onClick={() => onDelete(reference)}
                            >
                              <Iconify
                                icon={"eva:trash-2-outline"}
                                sx={{
                                  mr: 2,
                                }}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={6}
                        sx={{
                          py: 3,
                        }}
                      >
                        <Paper
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Introuvable
                          </Typography>
                          <Typography variant="body2">
                            Aucun résultat trouvé pour 
                            <strong> {filternom} </strong>.
                            <br /> Vérifiez les fautes de frappe ou les mots complets..
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
            count={services.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={labelRowsPerPage}
          />
        </Card>
      </Container>
      {isOpenPopUpdate && (
            <div className="popup-overlay">
              <div className="popup">
                <Button variant="contained"
                sx={{
                    backgroundColor: "success.main",
                  }}
                 onClick={() => {
                setIsOpenPopUpdate(!isOpenPopUpdate);
                document.body.style.overflow = "auto";
              }}>
                  X
                </Button>
                <h2> Mise à jour service </h2>
                <Stack spacing={3}>
                  
                  <TextField
                    name="nom"
                    label="Nom"
                    value={nomUpdate}
                    onChange={nomUpdateValidation}
                    error={errorNomUpdate}
                    helperText={errorNomUpdate ? errMessageNomUpdate : ''}
                  />
                  <TextField
                    name="prix"
                    label="Prix"
                    value={prixUpdate}
                    onChange={(e) => setPrixUpdate(e.target.value)}
                    error={errorPrixUpdate}
                    helperText={errorPrixUpdate ? errMessagePrixUpdate : ''}
                  />
                  <InputLabel id="my-select-label">Duree</InputLabel>
                  <TextField
                    name="duree"
                    type="date time"
                    label="Duree"
                    value={dureeUpdate}
                    onChange={dureeUpdateValidation}
                    error={errorDureeUpdate}
                    helperText={errorDureeUpdate ? errMessageDureeUpdate : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ScheduleIcon />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      step: 60,
                    }}
                  />
                  <InputLabel id="my-select-label">Categories *</InputLabel>
                  <Select
                    labelId="my-select-label"
                    value={refselectedCateg}
                    onChange={(event) => {
                        setRefselectedCateg(event.target.value);
                      }}
                      error={errorCategUpdate}
                    >
                    {categories.map((option) => (
                    <MenuItem key={option.reference} value={option.reference}>
                    {option.nom}
                    </MenuItem>
                ))}
                    </Select>
                    {errorCategUpdate? <span className="err">{errMessageCategUpdate}</span>:''}
                  <TextField
                    name="description"
                    label="Description"
                    value={descriptionUpdate}
                    onChange={descUpdateValidation}
                    error={errorDescUpdate}
                    helperText={errorDescUpdate ? errMessageDescUpdate : ''}
                  />
                </Stack>
                <br />
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: "success.main",
                  }}
                  align="centre"
                  variant="contained"
                  onClick={() =>
                    onUpdate( referenceUpdate, nomUpdate, descriptionUpdate, prixUpdate, dureeUpdate, refselectedCateg )
                  }
                >
                  Mise à jour
                </Button>
              </div>
            </div>
          )}
    </>
	);
}
