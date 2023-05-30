import React, {useState, useEffect} from "react";
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import { Buffer } from 'buffer';
import { useParams } from "react-router-dom";
import axios from "axios";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const params = useParams();
  const idProp = params.id;
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getAllPersonnel/${idProp}`)
      .then((res) => setUser(res.data));
  }, []);
  const centre={reference:idProp,nom:"",photo:"",email:"",prenom:""}
  if(user.length===0){
    console.log("")
  }else{
     centre.email=user[0].email
     centre.prenom=user[0].prenom
     centre.nom=user[0].nom
     centre.photo=user[0].photo
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
        <Avatar src={centre.photo && `data:image/png;base64,${Buffer.from(centre.photo.data).toString('base64')}`} alt="photoURL" />
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
            {centre.nom} {centre.prenom}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {centre.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <a href="/"><MenuItem onClick={handleClose} sx={{ m: 1 }}>
           Se déconnecter
        </MenuItem></a>
      </Popover>
    </>
  );
}
