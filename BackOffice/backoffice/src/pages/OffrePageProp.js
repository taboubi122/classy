import {
	Helmet
} from "react-helmet-async";
import {
	filter
} from "lodash";
import React, {
	useState
	, useEffect
} from "react";
import {
	FcApproval
	, FcCancel
} from "react-icons/fc";
import {
	useParams
} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// @mui
import {
	Card
	, Table
	, Stack
	, Paper
	, Button
	, TableRow
	, TableBody
	, TableCell
	, Container
	, Typography
	, IconButton
	, TableContainer
	, TablePagination
	, TextField
	, Select
	, MenuItem
	, InputLabel
, } from "@mui/material";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import {
	UserListHead
	, UserListToolbar
} from "../sections/@dashboard/user";
// mock
// ----------------------------------------------------------------------
const TABLE_HEAD = [
	{
		id: "etat"
	, }
	
	, {
		id: "nom"
		, label: "Nom"
		, alignRight: false
	, }
	
	
	, {
		id: "pourcentage"
		, label: "Pourcentage"
		, alignRight: false
	, }
	
	
	, {
		id: "debut"
		, label: "Debut"
		, alignRight: false
	, }
	
	
	, {
		id: "fin"
		, label: "Fin"
		, alignRight: false
	, }
	
	
	, {
		id: "service"
		, label: "Service"
		, alignRight: false
	, }
	
	
	, {
		id: "description"
		, label: "Description"
		, alignRight: false
	, }
	
	
	, {
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
				_user.pourcentage.toString()
				.indexOf(query) !== -1
			);
		});
	}
	return stabilizedThis.map((el) => el[0]);
}
export default function OffrePageProp() {
	const params = useParams();
	const idProp = params.id;
	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/getAllOffresByID/${idProp}`)
			.then((res) => setOffres(res.data));
	}, []);
	useEffect(() => {
		axios.get(`http://localhost:5000/api/getAllServicesProp/${idProp}`)
			.then((res) => setService(res.data));
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
						.delete(`http://localhost:5000/api/deleteOffres/${reference}`)
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
	const [service, setService] = useState([]);
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
	const [pourcentage, setPourcentage] = useState(0);
	const [dateDebut, setDateDebut] = useState("");
	const [dateFin, setDateFin] = useState("");
	const [offres, setOffres] = useState([]);
	const [refselectedService, setRefselectedService] = useState([]);
	const [nomUpdate, setNomUpdate] = useState("");
	const [pourcentageUpdate, setPourcentageUpdate] = useState(0);
	const [ddUpdate, setDdUpdate] = useState("");
	const [dfUpdate, setDfUpdate] = useState("");
	const [referenceUpdate, setReferenceUpdate] = useState();
	const [descriptionUpdate, setDescriptionUpdate] = useState("");
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
			const newSelecteds = offres.map((n) => n.nom);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
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
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - offres.length) : 0;
	const filteredUsers = applySortFilter(
		offres
		, getComparator(order, orderBy)
		, filternom
	);
	const isNotFound = !filteredUsers.length && !!filternom;
	// Date
	function currentTime(d) {
		const date = new Date(d);
		const day = date.getDate();
		const month = date.getMonth() + 1; // Janvier est 0
		const year = date.getFullYear();
		return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
	}
	// end etat
	function isEndDateValid(endDate) {
		const currentDate = new Date();
		const endDateObj = new Date(endDate);
		if (endDateObj < currentDate) {
			return false;
		}
		return true;
	}
	// Add
  const [errMessageNom, setErrMessageNom]=useState('');
  const [errorNom, setErrorNom] = useState(false);
  const [messageNom, setMessageNom]=useState(false);

  const [errMessageDesc, setErrMessageDesc]=useState('');
  const [errorDesc, setErrorDesc] = useState(false);
  const [messageDesc, setMessageDesc]=useState(false);

  const [errMessagePour, setErrMessagePour]=useState('');
  const [errorPour, setErrorPour] = useState(false);
  const [messagePour, setMessagePour]=useState(false);

  const [errMessageDebut, setErrMessageDebut]=useState('');
  const [errorDebut, setErrorDebut] = useState(false);
  const [messageDebut, setMessageDebut]=useState(false);

  const [errMessageFin, setErrMessageFin]=useState('');
  const [errorFin, setErrorFin] = useState(false);
  const [messageFin, setMessageFin]=useState(false);

  const [errMessageServ, setErrMessageServ]=useState('');
  const [errorServ, setErrorServ] = useState(false);

  const [test1, setTest1] = useState(true);
  const [test2, setTest2] = useState(true);
  const [test3, setTest3] = useState(true);
  const [test4, setTest4] = useState(true);
  const [test5, setTest5] = useState(true);
  const [test6, setTest6] = useState(true);

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

  const pourValidation=(e)=>{
    const pourValue=e.target.value
    const pattern = /^(?:100|[1-9][0-9]?)$/
    setPourcentage(pourValue)
    if (pourValue.match(pattern)) {
      setMessagePour(true)
    }else {
      setMessagePour(false)
    }
    
  }

  function validateDates(dateDebut, dateFin) {
    const today = new Date();
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
  
    // Vérifier si la date de début est supérieure ou égale à la date d'aujourd'hui
    if (start < today) {
      console.log("if1 :",false)
      setMessageDebut(false)
    }else{
      setMessageDebut(true)
    }
  
    // Vérifier si la date de fin est supérieure à la date de début
    const oneDay = 24 * 60 * 60 * 1000; // Nombre de millisecondes dans une journée
    if (end <= start || (end - start) < oneDay) {
      console.log("if2 :",false)
      setMessageFin(false)
    }
    else{setMessageFin(true)}
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

    if(pourcentage===''){
      setErrorPour(true)
      setErrMessagePour('Le champ est obligatoire.')
    }else
    if(!messagePour){
      setErrorPour(true)
      setErrMessagePour('Le champ est invalid.')
    }else{
      setErrorPour(false)
      setErrMessagePour('')
      setTest3(false)
    }

    const vDate=validateDates(dateDebut,dateFin)
    console.log(vDate)
    if(dateDebut===''){
      setErrorDebut(true)
      setErrMessageDebut('Le champ est obligatoire.')
    }else
    if(!messageDebut){
      setErrorDebut(true)
      setErrMessageDebut('Le champ est invalid.')
    }else{
      setErrorDebut(false)
      setErrMessageDebut('')
      setTest4(false)
    }

    if(dateFin===''){
      setErrorFin(true)
      setErrMessageFin('Le champ est obligatoire.')
    }else
    if(!messageFin){
      setErrorFin(true)
      setErrMessageFin('Le champ est invalid.')
    }else{
      setErrorFin(false)
      setErrMessageFin('')
      setTest5(false)
    }

    if(refselectedService.length===0){
      setErrorServ(true)
      setErrMessageServ('Le champ est obligatoire.')
    }else{
      setErrorServ(false)
      setErrMessageServ('')
      setTest6(false)
    }
    if(!test1 && !test2 && !test3 && !test4 && !test5 && !test6){
      window.location.reload();
		axios.post(`http://localhost:5000/api/addOffres`, {
      			 nom
			, description
			, pourcentage
			, dateDebut
			, dateFin
			, refselectedService
		});
		console.log("Service Registration success");
		
  }
	};
	// Get Name Centre
	function getNameService(id) {
		const svs = service.filter((sv) => sv.reference === id);
		return svs.length > 0 ? svs[0].nomService : 'Inconnu';
	}
	// Get description
	function getdesc(desc) {
		if (desc.length === 0) {
			return msg
		}
		return desc
	}
	const [errMessageNomUpdate, setErrMessageNomUpdate]=useState('');
    const [errorNomUpdate, setErrorNomUpdate] = useState(false);
    const [messageNomUpdate, setMessageNomUpdate]=useState(false);
    
    const [errMessageDescUpdate, setErrMessageDescUpdate]=useState('');
    const [errorDescUpdate, setErrorDescUpdate] = useState(false);
    const [messageDescUpdate, setMessageDescUpdate]=useState(false);

    const [errMessagePourUpdate, setErrMessagePourUpdate]=useState('');
    const [errorPourUpdate, setErrorPourUpdate] = useState(false);

    const [errMessageDebutUpdate, setErrMessageDebutUpdate]=useState('');
    const [errorDebutUpdate, setErrorDebutUpdate] = useState(false);

    const [errMessageFinUpdate, setErrMessageFinUpdate]=useState('');
    const [errorFinUpdate, setErrorFinUpdate] = useState(false);

    const [errMessageServUpdate, setErrMessageServUpdate]=useState('');
    const [errorServUpdate, setErrorServUpdate] = useState(false);

    const [test1Update, setTest1Update] = useState(true);
    const [test2Update, setTest2Update] = useState(true);
    const [test3Update, setTest3Update] = useState(true);
    const [test4Update, setTest4Update] = useState(true);
    const [test5Update, setTest5Update] = useState(true);
    const [test6Update, setTest6Update] = useState(true);

    const nomUpdateValidation=(e)=>{
      const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
      const nomValue=e.target.value
      setNomUpdate(nomValue)
      if(nomUpdate.match(pattern)){
        setMessageNom(true)
      }else {
        setMessageNom(false)
      }
      
    }
  
    const pourUpdateValidation=(e)=>{
      const pourValue=e.target.value
      const pattern = /^(?:100|[1-9][0-9]?)$/
      setPourcentageUpdate(pourValue)
      if (pourValue.match(pattern)) {
        setMessagePour(true)
      }else {
        setMessagePour(false)
      }
      
    }
    const descUpdateValidation=(e)=>{
      const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
      const descValue=e.target.value
      setDescriptionUpdate(descValue)
      if(description.match(pattern)){
        setMessageDesc(true)
      }else {
        setMessageDesc(false)
      }
    }
	function onUpdate(referenceUpdate, nomUpdate, descriptionUpdate, pourcentageUpdate, ddUpdate, dfUpdate, refselectedService) {
    if(nomUpdate==='' && descriptionUpdate==='' && pourcentageUpdate==='' && ddUpdate==='' && dfUpdate==='' && refselectedService.length===0){
      setErrorNomUpdate(true)
      setErrorDescUpdate(true)
      setErrorDebutUpdate(true)
      setErrorFinUpdate(true)
      setErrorServUpdate(true)
      setErrorPourUpdate(true)
      setErrMessageServUpdate('Doit modifier un champ au minimum.')
      setErrMessagePourUpdate('Doit modifier un champ au minimum.')
      setErrMessageDebutUpdate('Doit modifier un champ au minimum.')
      setErrMessageFinUpdate('Doit modifier un champ au minimum.')
      setMessageDescUpdate('Doit modifier un champ au minimum.')
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
      setErrorServUpdate(false)
      setErrMessageServUpdate('')
      setTest6Update(false)
      setErrorPourUpdate(false)
      setErrMessagePourUpdate('')
      setTest5Update(false)
      setErrorDescUpdate(false)
      setErrMessageDescUpdate('')
      setTest2Update(false)
      setErrorDebutUpdate(false)
      setErrMessageDebutUpdate('')
      setTest3Update(false)
      setErrorFinUpdate(false)
      setErrMessageFinUpdate('')
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
    const today = new Date();
    const start = new Date(ddUpdate);
    const end = new Date(dfUpdate);
  
    if (start < today) {
      setErrorDebutUpdate(true)
      setErrMessageDebutUpdate('Le champ est invalid.')
      setTest4Update(true)
    }
  
    const oneDay = 24 * 60 * 60 * 1000; 
    if (end <= start || (end - start) < oneDay) {
      setErrorDebutUpdate(true)
      setTest5Update(true)
      setErrMessageDebutUpdate('Le champ est invalid.')
      setErrorFinUpdate(true)
      setErrMessageFinUpdate('Le champ est invalid.')
    }
     

    if(!test1Update && !test2Update && !test3Update && !test4Update && !test5Update && !test6Update ){
      window.location.reload();
		axios.put(`http://localhost:5000/api/UpdateOffres/${referenceUpdate}`, {
				nomUpdate
				, descriptionUpdate
				, pourcentageUpdate
				, ddUpdate
				, dfUpdate
				, refselectedService
			})
			.then(() => {
				console.log("Service Updated successfully");
				window.location.reload();
			});
    }
    
	}
	return (
		<>
      <Helmet>
        <title> CLASSY | OFFRES</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
          Offres
          </Typography>
          <br />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={togglePopup}
          >
            Nouveau offres
          </Button>
          {isOpenPopAdd && (
            <div className="popup-overlay">
              <div className="popup">
                <Button variant="contained" onClick={togglePopup}>
                  X
                </Button>
                <h2> Ajouter un offre </h2>
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
                    name="pourcentage"
                    label="Pourcentage *"
                    type="number"
                    onChange={pourValidation}
                    error={errorPour}
                    helperText={errorPour ? errMessagePour : ''}
                  />
                  <InputLabel id="my-select-label">Date Debut *</InputLabel>
                  <TextField
                    name="dd"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    error={errorDebut}
                    helperText={errorDebut ? errMessageDebut : ''}
                  />
                  <InputLabel id="my-select-label">Date Fin *</InputLabel>
                  <TextField
                    name="df"
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    error={errorFin}
                    helperText={errorFin ? errMessageFin : ''}
                  />
                  <InputLabel id="my-select-label">Service *</InputLabel>
                  <Select
                    labelId="my-select-label"
                    value={refselectedService}
                    onChange={(event) => {
                        setRefselectedService(event.target.value);
                      }}
                      error={errorServ}
                    >
                    {service.map((option) => (
                    <MenuItem key={option.reference} value={option.reference}>
                    {option.nom}
                    </MenuItem>
                ))}
                    </Select>
                    {errorServ? <span className="err">{errMessageServ}</span>:''}
                  <TextField
                    name="description"
                    label="Description "
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
                  rowCount={offres.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { reference, nom, description, pourcentage, dateDebut, dateFin, refService } = row;
                      const selectedUser = selected.indexOf(nom) !== -1;

                      return (
                        <TableRow
                          hover
                          key={reference}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                        <TableCell align="left">{isEndDateValid(dateFin) ? <FcApproval /> : <FcCancel />}</TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {nom}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"> {pourcentage} %</TableCell>
                          <TableCell align="left" width="120"> {currentTime(dateDebut)} </TableCell>
                          <TableCell align="left" width="120"> {currentTime(dateFin)} </TableCell>
                          <TableCell align="left"> {getNameService(refService)} </TableCell>
                          <TableCell align="left"> {getdesc(description)} </TableCell>
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
            count={offres.length}
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
                <h2> Mise à jour</h2>
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
                    name="pour"
                    label="Pourcentage"
                    value={pourcentageUpdate}
                    onChange={pourUpdateValidation}
                    error={errorPourUpdate}
                    helperText={errorPourUpdate ? errMessagePourUpdate : ''}
                  />
                  <InputLabel id="my-select-label">Date Debut </InputLabel>
                  <TextField
                    name="dd"
                    type="date"
                    value={ddUpdate}
                    onChange={(e) => setDdUpdate(e.target.value)}
                    error={errorDebutUpdate}
                    helperText={errorDebutUpdate ? errMessageDebutUpdate : ''}
                  />
                  <InputLabel id="my-select-label">Date Fin </InputLabel>
                  <TextField
                    name="df"
                    type="date"
                    value={dfUpdate}
                    onChange={(e) => setDfUpdate(e.target.value)}
                    error={errorFinUpdate}
                    helperText={errorFinUpdate ? errMessageFinUpdate : ''}
                  />
                  <InputLabel id="my-select-label">Service </InputLabel>
                  <Select
                    labelId="my-select-label"
                    value={refselectedService}
                    onChange={(event) => {
                        setRefselectedService(event.target.value);
                      }}
                      error={errorServUpdate}
                    >
                    {service.map((option) => (
                    <MenuItem key={option.reference} value={option.reference}>
                    {option.nom}
                    </MenuItem>
                ))}
                    </Select>
                    {errorServUpdate? <span className="err">{errMessageServUpdate}</span>:''}
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
                    onUpdate( referenceUpdate, nomUpdate, descriptionUpdate, pourcentageUpdate, ddUpdate, dfUpdate, refselectedService )
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
