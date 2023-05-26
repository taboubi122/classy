import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Buffer } from 'buffer';
import {useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nom', label: 'nom', alignRight: false },
  { id: 'Cin', label: 'CIN', alignRight: false },
  { id: 'telephone', label: 'Telephone', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'password', label: 'Password', alignRight: false },
  { id: 'sexe', label: 'Sexe', alignRight: false },
  {id:'valide'},
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
  const stabilizedThis = array.map((el, index) => [el, index]);
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

export default function UserPage() {
  useEffect(()=>{
    axios.get('http://localhost:5000/api/getAllClients')
    .then(res=>setClient(res.data)
    );
     },[]);
  
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
              window.location.reload()
              axios.delete(`http://localhost:5000/api/deleteClient/${CIN}`)
              .then(res => setCIN(res.data));
               swalWithBootstrapButtons.fire(
                 'Supprimé!',
                 'Votre client a été supprimé.',
                 'success'
               )
              
             } else if (
               result.dismiss === Swal.DismissReason.cancel
             ) {
               swalWithBootstrapButtons.fire(
                 'Annulé',
                 'Votre client est en sécurité :)',
                 'erreur'
               )
             }
           })
           
         
    }



  const [client,setClient] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('nom');

  const [filternom, setFilternom] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [setCIN]=useState();
    

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
        const res = await axios.get(`http://localhost:5000/api/clients/search/${val}`);
        setFilternom(res.data);
      } catch (err) {
        console.log("Registation Failed")
      }
    
  }
  
  const handleFilterBynom = (event) => {
    const filterValue = event.target.value;
    setPage(0); 

      setFilternom(filterValue);
  
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - client.length) : 0;

  const filteredUsers = applySortFilter(client, getComparator(order, orderBy), filternom);

  const isNotFound = !filteredUsers.length && !!filternom;

  return (
    <>
      <Helmet>
        <title> CLASSY | CLIENTS</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Clients |
          </Typography>
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
                    const { id, nom,prenom, tel, sexe, CIN, photo, email , password} = row;
                    const selectedUser = selected.indexOf(nom) !== -1;
                   
                    return (
                      <TableRow hover key={index} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                          {photo && <img className='ClientPhoto' alt={id} src={`data:image/png;base64,${Buffer.from(row.photo.data).toString('base64')}`} />}
                            <Typography variant="subtitle2" noWrap>
                              {nom} {prenom}
                            </Typography>  
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{CIN}</TableCell>

                        <TableCell align="left">{tel}</TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{password}</TableCell>

                        <TableCell align="left">
                          <Label>{sexe}</Label>
                        </TableCell>

                        <TableCell align="right">
                          
                          <IconButton size="large" sx={{ color: 'error.main' }} onClick={() => onDelete(CIN)}>
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
