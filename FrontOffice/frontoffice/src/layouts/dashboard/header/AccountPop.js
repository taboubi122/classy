import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import img from '../../../Assets/logo2.png';
import Swal from 'sweetalert2';
import { Buffer } from 'buffer';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    path: '/profil',
  },
];
// ----------------------------------------------------------------------

export default function AccountPop({handleLogout,nom,prenom,email,photo}) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  function Deconnecter()
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
           confirmButtonText: 'Oui, Deconnecter!',
           cancelButtonText: 'Non, annuler!',
           reverseButtons: true
         }).then((result) => {
           if (result.isConfirmed) {
            handleLogout();
             swalWithBootstrapButtons.fire(
               'Deconnecter!',
               'success'
             )
            window.location.reload()
           } else if (
             result.dismiss === Swal.DismissReason.cancel
           ) {
             swalWithBootstrapButtons.fire(
               'Annulé',
               'Vous rester connecter :)',
               'erreur'
             )
           }
         })
         
       
  }
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {photo!==null ?(
     <Avatar >    <img className="shadow" alt={1} src={`${Buffer.from(photo.data)}`}  />

  </Avatar> ):
  (<Avatar><img src={img} alt="1"/></Avatar>)}
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {nom} {prenom}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
          <a href={option.path} style={{ color: 'black' }}>{option.label}</a>
        </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={Deconnecter} sx={{ m: 1 }}>
           Se déconnecter
        </MenuItem>
      </Popover>
    </>
  );
}
