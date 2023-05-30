import PropTypes from 'prop-types';
import React, {useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import { Buffer } from 'buffer';
import { useParams } from "react-router-dom";
import axios from "axios";
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import NavConfig from "./config";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const params = useParams();
  const idProp = params.id;
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getAllPropriate/${idProp}`)
      .then((res) => setUser(res.data));
  }, []);
  const centre={reference:idProp,nom:"",photo:"",email:"",prenom:""}
  if(user.length===0){
    console.log("")
  }else{
     centre.email=user[0].email
     centre.nom=user[0].nom
     centre.prenom=user[0].prenom
     centre.photo=user[0].photo
  }


  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <div />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={centre.photo && `data:image/png;base64,${Buffer.from(centre.photo.data).toString('base64')}`} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {centre.nom} {centre.prenom}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>
      
      <NavSection data={NavConfig()} />
      
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
