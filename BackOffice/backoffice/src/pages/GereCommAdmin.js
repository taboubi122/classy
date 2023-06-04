import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// @mui
import { Card, Table, Stack, Button, TableRow, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { AiOutlineStar } from "react-icons/ai";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import {
	UserListHead
} from "../sections/@dashboard/user";
// mock
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
export default function GereCommAdmin() {
	const params = useParams();
	const idProp = params.id;
	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/getAvisCentre/${idProp}`)
			.then((res) => setAvis(res.data));
	}, []);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState("asc");
	const [selected, setSelected] = useState([]);
	const [orderBy, setOrderBy] = useState("nom");
	const [filternom, setFilternom] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [avis, setAvis] = useState([]);
    const [client, setClient] = useState([]);
    useEffect(() => {
		axios
			.get(`http://localhost:5000/api/getAllClients`)
			.then((res) => setClient(res.data));
	}, []);
    console.log(client)
    console.log(avis)

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};
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
						.delete(`http://localhost:5000/api/deleteAvis/${reference}`)
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
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - avis.length) : 0;
	const filteredUsers = applySortFilter(
		avis
		, getComparator(order, orderBy)
		, filternom
	);

    function getDate(d) {
		const date = new Date(d);
		const day = date.getDate();
		const month = date.getMonth() + 1; // Janvier est 0
		const year = date.getFullYear();
		return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
	}
    function getNomPrenomClient(id){
        const nom1=client.filter((ctr) => ctr.CIN === id)
        const prenom1=client.filter((ctr) => ctr.CIN === id)
        const n=nom1[0].nom
        const p=prenom1[0].prenom
        return `${n} ${p}`
    }
	return (
		<>
      <Helmet>
        <title> Avis | </title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
            <Typography variant="h4" gutterBottom>
            Avis client
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer
              sx={{
                minWidth: 800,
              }}
            >
              <Table>
                <TableBody>
                  
                  {filteredUsers
                    .map((row, index) => {
                      const { reference, commentaire, note, dateAvis, CinClient } = row;
                      const selectedUser = selected.indexOf(note) !== -1;

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
                              {commentaire}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"> {note}.0  <AiOutlineStar/></TableCell>
                          <TableCell align="left" width="120"> {getDate(dateAvis)}</TableCell>
                          <TableCell align="left" width="120"> {getNomPrenomClient(CinClient)} </TableCell>
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
                  {avis.length === 0 && (
                    <TableRow><TableCell align="left"><div/></TableCell>
                    <TableCell component="th" scope="row" padding="none">
                        <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                              Aucun avis sur cette centre
                              </Typography>
                            </Stack>
                            </TableCell>
                    </TableRow>
                  )}

                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
	);
}
