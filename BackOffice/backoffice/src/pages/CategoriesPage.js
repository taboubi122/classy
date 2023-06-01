import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// @mui
import { Card, Table, Stack, Paper, Button, TableRow, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination, TextField } from "@mui/material";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// ----------------------------------------------------------------------
const TABLE_HEAD = [
	{
		id: "ref"
  , }
	, {
		id: "nom"
		, label: "Nom"
		, alignRight: false
  , },
	{
		id: "description"
		, label: "Description"
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
				.indexOf(query.toLowerCase()) !== -1
			);
		});
	}
	return stabilizedThis.map((el) => el[0]);
}
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
	useEffect(() => {
		axios
			.get("http://localhost:5000/api/getAllCategories")
			.then((categ) => setCategories(categ.data));
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
						.delete(`http://localhost:5000/api/deleteCategories/${reference}`)
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
	const [nomUpdate, setNomUpdate] = useState("");
	const [referenceUpdate, setReferenceUpdate] = useState();
	const [descriptionUpdate, setDescriptionUpdate] = useState("");

    const [errMessageNom, setErrMessageNom]=useState('');
    const [errorNom, setErrorNom] = useState(false);
    const [messageNom, setMessageNom]=useState(false);
    
    const [errMessageDesc, setErrMessageDesc]=useState('');
    const [errorDesc, setErrorDesc] = useState(false);
    const [messageDesc, setMessageDesc]=useState(false);

    const [test1, setTest1] = useState(true);
    const [test2, setTest2] = useState(true);

    const [errMessageNomUpdate, setErrMessageNomUpdate]=useState('');
    const [errorNomUpdate, setErrorNomUpdate] = useState(false);
    const [messageNomUpdate, setMessageNomUpdate]=useState(false);
    
    const [errMessageDescUpdate, setErrMessageDescUpdate]=useState('');
    const [errorDescUpdate, setErrorDescUpdate] = useState(false);
    const [messageDescUpdate, setMessageDescUpdate]=useState(false);

    const [test1Update, setTest1Update] = useState(true);
    const [test2Update, setTest2Update] = useState(true);

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
			const newSelecteds = categories.map((n) => n.nom);
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
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;
	const filteredUsers = applySortFilter(
		categories
		, getComparator(order, orderBy)
		, filternom
	);
	const isNotFound = !filteredUsers.length && !!filternom;
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

  const nomUpdateValidation=(e)=>{
    const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
    const nomValue=e.target.value
    setNomUpdate(nomValue)
    if(nomUpdate.length>0){
    if(nomUpdate.match(pattern)){
      setMessageNomUpdate(true)
    }else {
      setMessageNomUpdate(false)
    }
  }else {
    setMessageNomUpdate(true)
  }
    
  }
  const descUpdateValidation=(e)=>{
    const pattern = /^[^@.,;:/\\<>[\]{}()|^=_+*&%$#!?¨`~¤£§€°æøåÆØÅ\d]{3,}$/
    const descValue=e.target.value
    setDescriptionUpdate(descValue)
    if(descriptionUpdate.length>0){
    if(descriptionUpdate.match(pattern)){
      setMessageDescUpdate(true)
    }else {
      setMessageDescUpdate(false)
    }}else {
      setMessageNomUpdate(true)
    }
  }
	// Add
	const handleInsert = async (event) => {
		event.preventDefault();
    if(nom===''){
      setErrorNom(true)
      setErrMessageNom('Le champ est obligatoire.')
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
    if(!test1 && !test2){
		try {
      window.location.reload();
			await axios.post(`http://localhost:5000/api/addCategories`, {
         nom
				, description
			, });
			console.log("Categorie Registration success");
			
		} catch (err) {
			console.log(err);
		}
  }
	};
	// Update
	function onUpdate(id, nomupdate, descriptionUpdate) {
    if(nomUpdate.length===0 && descriptionUpdate.length===0){
      setErrorNomUpdate(true)
      setErrMessageNomUpdate('Doit modifier un champ au minimum.')
    }else
    if(!messageNomUpdate){
      setErrorNomUpdate(true)
      setErrMessageNomUpdate('Le champ est invalid.')
    }else
    if(nomUpdate.length>100){
      setErrorNomUpdate(true)
      setErrMessageNomUpdate('Le champ et de 100 caractères au maximum.')
    }else{
      setErrorNomUpdate(false)
      setErrMessageNomUpdate('')
      setTest1Update(false)
    }

    if(nomUpdate.length===0 && descriptionUpdate.length===0){
      setErrorDescUpdate(true)
      setErrMessageDescUpdate('Doit modifier un champ au minimum.')
    }else
    if(!messageDescUpdate){
      setErrorDescUpdate(true)
      setErrMessageDescUpdate('Le champ est invalid.')
    }else
    if(descriptionUpdate.length>500){
      setErrorDescUpdate(true)
      setErrMessageDescUpdate('Le champ et de 500 caractères au maximum.')
    }else{
      setErrorDescUpdate(false)
      setErrMessageDescUpdate('')
      setTest2Update(false)
    }
    if(!test1Update && !test2Update){
      window.location.reload();
      axios.put(`http://localhost:5000/api/UpdateCategories/${id}`, {
			nomupdate
			, descriptionUpdate
		, });
    }
	}
	return (
		<>
      <Helmet>
        <title> Classy | LES CATEGORIES </title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Catégories
          </Typography>
          <br />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={togglePopup}
          >
            Nouveau catégorie
          </Button>
          {isOpenPopAdd && (
            <div className="popup-overlay">
              <div className="popup">
                <Button variant="contained" onClick={togglePopup}>
                  X
                </Button>
                <h2> Ajouter un catégorie </h2>
                <Stack spacing={3}>
                  <TextField
                    name="nom"
                    label="Nom"
                    value={nom}
                    onChange={nomValidation}
                    error={errorNom}
                    helperText={errorNom ? errMessageNom : ''}
                  />
                  <TextField
                    name="description"
                    label="description"
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
                  rowCount={categories.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { reference, nomCateg, descriptionCateg } = row;
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
                                
                                {nomCateg}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"> {descriptionCateg} </TableCell>
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
                            Aucun résultat trouvé pour & nbsp;
                            <strong> & quot; {filternom} & quot; </strong>.
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
            count={categories.length}
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
            <Button
              sx={{
                backgroundColor: "success.main",
              }}
              variant="contained"
              onClick={() => {
                setIsOpenPopUpdate(!isOpenPopUpdate);
                document.body.style.overflow = "auto";
              }}
            >
              X
            </Button>
            <h2> Mise à jour catégorie </h2>
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
                name="description"
                label="description"
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
                onUpdate(referenceUpdate, nomUpdate, descriptionUpdate)
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
