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
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import NavConfig from "./config";
import { useParams } from "react-router-dom";
import axios from "axios";
import { black } from 'material-ui/styles/colors';

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
  const params = useParams();
  const idProp = params.id;
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getCentreById/${idProp}`)
      .then((res) => setUser(res.data));
  }, []);
  console.log(user)
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const centre={reference:idProp,nom:""}
  if(user.length===0){
    console.log("")
  }else{
     centre.nom=user[0].nom
  }
  

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <br/>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              Centre
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
                {centre.nom}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      
      <NavSection data={NavConfig()} />
      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
      
      <Button href="/dashboard/app" style={{backgroundColor:black}} variant="contained">
        Retourn au menu
      </Button>

  </Box>
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
