import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// @mui
import { Card, Table, Stack, Button, TableRow, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TextField } from "@mui/material";
import InputAdornment from "@material-ui/core/InputAdornment";
import ScheduleIcon from "@material-ui/icons/Schedule";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import {
	UserListHead
} from "../sections/@dashboard/user";
// mock
// ----------------------------------------------------------------------
const TABLE_HEAD = [
	{
		id: "etat"
	, }
	
	, {
		id: "jour"
		, label: "Jour"
		, alignRight: false
	, }
	
	, {
		id: "ouverture"
		, label: "Ouverture"
		, alignRight: false
	, }
	, {
		id: "fermeture"
		, label: "Fermeture"
		, alignRight: false
	, }
	, {
		id: ""
	, }
	, {
		id: "valide"
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
export default function HoraireProp() {
	const params = useParams();
	const idProp = params.id;
	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/getAllHoraires/${idProp}`)
			.then((res) => setHoraires(res.data));
	}, []);
	useEffect(() => {
		axios.get(`http://localhost:5000/api/getAllJour`)
			.then((res) => setJour(res.data));
	}, []);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState("asc");
	const [selected, setSelected] = useState([]);
	const [orderBy, setOrderBy] = useState("nom");
	const [filternom, setFilternom] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [isOpenPopUpdate, setIsOpenPopUpdate] = useState(false);
	const [jour, setJour] = useState([]);
	const [horaires, setHoraires] = useState([]);
	const [ouvertureUpdate, setOuvertureUpdate] = useState("");
	const [fermetureUpdate, setFermetureUpdate] = useState("");
	const [referenceUpdate, setReferenceUpdate] = useState();
	const [refselectedJourUpdate, setRefselectedJourUpdate] = useState([]);
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = horaires.map((n) => n.nom);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - horaires.length) : 0;
	const filteredUsers = applySortFilter(
		horaires
		, getComparator(order, orderBy)
		, filternom
	);
	// Date
	function currentTime(d) {
		if (d === null) {
			return "--:--"
		}
		const [hours, minutes] = d.split(":");
		const date = new Date();
		date.setHours(parseInt(hours, 10));
		date.setMinutes(parseInt(minutes, 10));
		return `${hours} : ${minutes}`;
	}
	// Get Name Centre
	function getNameJour(id) {
		const svs = jour.filter((sv) => sv.reference === id);
		return svs.length > 0 ? svs[0].jour : 'Inconnu';
	}
	// Get Name Centre
	function getJour(id) {
		const svs = horaires.filter((sv) => sv.reference === id);
		return svs.length > 0 ? svs[0].refHoraire : 'Inconnu';
	}
	// Update
	const [errMessageO, setErrMessageO]=useState('');
    const [errorO, setErrorO] = useState(false);
    const [messageO, setMessageO]=useState(false);

    const [errMessageF, setErrMessageF]=useState('');
    const [errorF, setErrorF] = useState(false);
    const [messageF, setMessageF]=useState(false);

    const [test1, setTest1] = useState(true);
    const [test2, setTest2] = useState(true);

	const OuvrtureValidation=(e)=>{
		const pattern = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/
		const descValue=e.target.value
		setOuvertureUpdate(descValue)
		 if (pattern.test(descValue)) {
			const [hours, minutes] = descValue.split(':');
			if (parseInt(hours, 10) >= 0 && parseInt(hours, 10) <= 23 && parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) <= 59) {
			  setMessageO(true)
			  console.log("Mo1: ",messageO)
			}
		  }else {
			setMessageO(false)
			console.log("Mo2: ",messageO)
		 	 }
		  console.log(messageO)
		
	  }
	  const FerValidation=(e)=>{
		const pattern = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/
		const descValue=e.target.value
		setFermetureUpdate(descValue)
		if (pattern.test(descValue)) {
			const [hours, minutes] = descValue.split(':');
			if (parseInt(hours, 10) >= 0 && parseInt(hours, 10) <= 23 && parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) <= 59) {
			  setMessageF(true)
			  console.log("Mf1: ",messageF)
			}
		  }else {
			setMessageF(false)
			console.log("Mf2: ",messageF)
		 	 }
		console.log(messageF)
	  }
	  function compareTimeFields(start, end) {
		// Convertir les heures et les minutes de start en minutes totales
		const [startHours, startMinutes] = start.split(':');
		const startTotalMinutes = parseInt(startHours, 10) * 60 + parseInt(startMinutes, 10);
	  
		// Convertir les heures et les minutes de end en minutes totales
		const [endHours, endMinutes] = end.split(':');
		const endTotalMinutes = parseInt(endHours, 10) * 60 + parseInt(endMinutes, 10);
	  
		// Vérifier si end est supérieur à start
		if (endTotalMinutes > startTotalMinutes) {
		  // Comparaison réussie, end est supérieur à start
		  return true;
		}
	  
		// Comparaison échouée, end n'est pas supérieur à start
		return false;
	  }
	function onUpdate(referenceUpdate, ouvertureUpdate, fermetureUpdate, refselectedJourUpdate) {
		const isEndLater = compareTimeFields(ouvertureUpdate, fermetureUpdate);
		if(ouvertureUpdate==='' && fermetureUpdate===''){
			setErrorO(true)
				setErrMessageO('Le champ est invalid.')
				setTest1(true)
				console.log("1")
				setErrorF(true)
				setErrMessageF('Le champ est invalid.')
				setTest2(true)
				console.log("2")
		}else
			if(!isEndLater){
				setErrorO(true)
				setErrMessageO('Le champ est invalid.')
				setTest1(true)
				console.log("1")
				setErrorF(true)
				setErrMessageF('Le champ est invalid.')
				setTest2(true)
				console.log("2")
		
		}
		else{
			if(!messageO && ouvertureUpdate!==''){
				setErrorO(true)
				setErrMessageO('Le champ est invalid.')
				setTest1(true)
				console.log("1")
			  }else{
				setErrorO(false)
				setErrMessageO('')
				setTest1(false)
				console.log("11")
		  }
			if(!messageF && fermetureUpdate!==""){
				setErrorF(true)
				setErrMessageF('Le champ est invalid.')
				setTest2(true)
				console.log("2")
			  }else{
				setErrorF(false)
				setErrMessageF('')
				setTest2(false)
				console.log("22")
		  }
		}
		  if(!test1 && !test2){
			window.location.reload();
		    axios.put(`http://localhost:5000/api/UpdateHoraire/${referenceUpdate}`, {
				ouvertureUpdate
				, fermetureUpdate
				, refselectedJourUpdate
				, idProp
			})
			.then(() => {
				console.log("Horaire Updated successfully");
				
			});}
	}
	return (
		<>
      <Helmet>
        <title> Horaires de travail | </title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
          Horaires
          </Typography>
          <br />
        </Stack>
        <Card>
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
                  rowCount={horaires.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  
                  {filteredUsers
                    .map((row, index) => {
                      const { reference, ouverture, fermeture, refHoraire } = row;
                      const selectedUser = selected.indexOf(jour) !== -1;

                      return (
                        <TableRow
                          hover
                          key={reference}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                        <TableCell align="left"><div/></TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                              {getNameJour(refHoraire)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"> {currentTime(ouverture)} </TableCell>
                          <TableCell align="left" width="120"> {currentTime(fermeture)} </TableCell>
                          <TableCell align="left" width="120"> <div/> </TableCell>

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
              </Table>
            </TableContainer>
          </Scrollbar>
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
                <h2> {getNameJour(getJour(referenceUpdate))} </h2>
                <Stack spacing={3}>
					<TextField
                    name="duree"
                    label="Ouverture *"
                    type="date time"
                    onChange={OuvrtureValidation}
                    error={errorO}
                    helperText={errorO ? errMessageO : ''}
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
				  <TextField
				  name="duree"
				  label="Fermeture *"
				  type="date time"
				  onChange={FerValidation}
				  error={errorF}
				  helperText={errorF ? errMessageF : ''}
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
                    onUpdate( referenceUpdate, ouvertureUpdate, fermetureUpdate, refselectedJourUpdate)
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
