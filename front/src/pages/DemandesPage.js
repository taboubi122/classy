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
		id: "document"
		, label: "Document"
		, alignRight: false
	 },
	  {
		id: "date"
		, label: "Date"
		, alignRight: false
	 },
	{
		id: "valide"
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
export default function DemandesPage() {
	useEffect(() => {
		axios
			.get("http://localhost:5000/api/getAllDemandes")
			.then((res) => setDemandes(res.data));
	}, []);

	// Desapprouver
	function DesApprouver(reference) {
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
						.delete(`http://localhost:5000/api/DesapprouverDemande/${reference}`)
						.then((res) => setReference(res.data));
					swalWithBootstrapButtons.fire(
						"Supprimé!"
						, "La demande a été supprimé."
						, "success"
					);
					window.location.reload();
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
	console.log("demandes: ",demandes)

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
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - demandes.length) : 0;
	const filteredUsers = applySortFilter(
		demandes
		, getComparator(order, orderBy)
		, filternom
	);
	const isNotFound = !filteredUsers.length && !!filternom;
	// Duree
	function currentTime(d) {
		const date = new Date(d);
		const day = date.getDate();
		const month = date.getMonth() + 1; // Janvier est 0
		const year = date.getFullYear();
		return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
	}
	// Approuver
	function Approuver(id, nom, prenom,tel, mail) {
		axios.post(`http://localhost:5000/api/ApprouverDemande/${id}`, {
			nom
				, prenom
				,tel
				, mail
			})
			.then(() => {
				console.log("Service Updated successfully");
				
			});
			window.location.reload();
	}
	
	const downloadPdf2= (id)=> {
		fetch(`http://localhost:5000/api/getDoc/${id}`)
		.then(response => response.blob())
      .then(blob => {
        const pdfUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = pdfUrl;
        link.setAttribute('download', 'Nouveau Fichier.pdf');
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Erreur lors du téléchargement du fichier PDF :', error);
      });
	  }
	return (
		<>
      <Helmet>
        <title> Demandes | </title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Demandes
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
                minWidth: 800,
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
                      const { reference, nom, prenom, email, tel, document,date } = row;
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
                                {nom} {prenom}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"> {email}</TableCell>
                          <TableCell align="left"> {tel} </TableCell>
                          <TableCell align="left"> 
						  <IconButton
							sx={{
								"& svg": {
								width: 35,
								height: 35,
								},
							}}
							onClick={() => downloadPdf2(reference)}
							>
								
							<Iconify
								icon={"vscode-icons:file-type-pdf2"}
								sx={{
								mr: 2,
								}}
							/>
							</IconButton>
						  </TableCell>
                          <TableCell align="left"> {currentTime(date)} </TableCell>
                          
                          <TableCell align="right">
						  <IconButton
							sx={{
								"& svg": {
								width: 35,
								height: 35,
								},
							}}
							onClick={() => Approuver(reference,nom,prenom,tel,email)}
							>
								
							<Iconify
								icon={"ph:check-circle-duotone"}
								sx={{
								mr: 2,
								color: "success.main",
								}}
							/>
							</IconButton>
                          </TableCell>
                          <TableCell align="right">
						  <IconButton
							sx={{
								"& svg": {
								width: 35,
								height: 35,
								},
								
							}}
							onClick={() => DesApprouver(reference)}
							>
								
							<Iconify
								icon={"ph:x-circle-duotone"}
								sx={{
								mr: 2,
								color: "error.main",
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
