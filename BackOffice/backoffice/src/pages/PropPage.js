import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import React, { useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
// @mui
import { Card, Table, Stack, Paper, TableRow, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination } from "@mui/material";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
const TABLE_HEAD = [
	{ id: "ref" }
	, {
		id: "nomP"
		, label: "Nom & Prénom"
		, alignRight: false 
	}
	, {
		id: "email"
		, label: "Email"
		, alignRight: false
	 }
	, {
		id: "tel"
		, label: "Tel"
		, alignRight: false
	 }
	, {
		id: "sexe"
		, label: "Sexe"
		, alignRight: false
	 },
	  {
		id: "etat de compte"
		, label: "Etat de compte"
		, alignRight: false
	 },
	{
		id: ""
	 }
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
				_user.prenom.toLowerCase()
				.indexOf(query.toLowerCase()) !== -1 ||
				_user.tel.toString()
				.indexOf(query) !== -1
			);
		});
	}
	return stabilizedThis.map((el) => el[0]);
}
export default function PropPage() {
	useEffect(() => {
		axios
			.get("http://localhost:5000/api/getPropriates")
			.then((res) => setDemandes(res.data));
	}, []);

	// Desapprouver
	function Supprimer(CIN) {
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
          window.location.reload();
					axios
						.delete(`http://localhost:5000/api/SupprimerProp/${CIN}`)
					swalWithBootstrapButtons.fire(
						"Supprimé!"
						, "La demande a été supprimé."
						, "success"
					);
					
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					swalWithBootstrapButtons.fire(
						"Annulé"
						, "La demande est en sécurité :)"
						, "erreur"
					);
				}
			});
	}
	const [demandes, setDemandes] = useState([]);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState("asc");
	const [selected, setSelected] = useState([]);
	const [orderBy, setOrderBy] = useState("nom");
	const [filternom, setFilternom] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [setReference] = useState();
	const [isOpenPopAdd, setIsOpenPopAdd] = useState(false);
  console.log(demandes)
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
			const newSelecteds = demandes.map((n) => n.nom);
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
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - demandes.length) : 0;
	const filteredUsers = applySortFilter(
		demandes
		, getComparator(order, orderBy)
		, filternom
	);
	const isNotFound = !filteredUsers.length && !!filternom;
	// etat
	function etat(d) {
		if(d===0)
        {return false}
        return true
	}
	return (
		<>
      <Helmet>
        <title> CLASSY | PROPRIÈTAIRES</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Propriétaires |
          </Typography>
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
                minWidth: 200,
              }}
            >
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={demandes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { CIN, nom, prenom, email, tel,sexe,activer } = row;
                      return (
                        <TableRow
                          key={CIN}
                        >
                          <TableCell padding="checkbox">
                            <div/>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                            >
                              <Typography variant="subtitle2" noWrap>
                                {nom} {prenom}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"> {email}</TableCell>
                          <TableCell align="left"> {tel} </TableCell>
                          <TableCell align="left"> {sexe}</TableCell>
                          <TableCell align="center"> {
                          etat(activer)?
                          <IconButton
                              size="large"
                              sx={{
                                color: "success.main",
                              }}
                            >
                              <Iconify
                                icon={"pepicons-pencil:circle-filled"}
                                sx={{
                                  mr: 2,
                                }}
                              />
                            </IconButton>:
                            <IconButton
                            size="large"
                            sx={{
                              color: "error.main",
                            }}
                          >
                            <Iconify
                              icon={"pepicons-pencil:circle-filled"}
                              sx={{
                                mr: 2,
                              }}
                            />
                          </IconButton>
                          } </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="large"
                              sx={{
                                color: "error.main",
                              }}
                              onClick={() => Supprimer(CIN)}
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
                        colSpan={3}
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
            count={demandes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={labelRowsPerPage}
          />
        </Card>
      </Container>
    </>
	);
}
