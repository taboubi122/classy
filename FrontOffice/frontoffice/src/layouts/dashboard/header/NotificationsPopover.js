import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import {GiConfirmed,GiCancel} from 'react-icons/gi'
import { MdAccessTime, MdOutlineFeedback} from 'react-icons/md'
// ----------------------------------------------------------------------


function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = format(date, "EEEE 'le' dd MMMM HH:mm", { locale: fr });
  return formattedDate;
}

export default function NotificationsPopover({isLogout}) {
  const [client, setClient] = useState([]);
  const [email, setEmail] = useState('');
 
  const [notif, setNotif] = useState([]);
  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);
useEffect(() => {
  axios.get(`http://localhost:5000/api/getNotif/${email}`)
    .then((response) => {
      setNotif(response.data);
    })
    .catch((error) => {
      console.error('Failed to fetch notifications:', error);
    });
}, [email]);

  const totalUnRead = notif.filter((item) => item.etat === 0).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleMarkAllAsRead = () => {
    setNotif(
      notif.map((notification) => ({
        ...notification,
        etat: false,
      }))
    );
  };


  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
            <IconButton color="primary" onClick={handleMarkAllAsRead}>
              <Iconify icon="eva:done-all-fill" />
            </IconButton>
          </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notif.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>

        
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
           voir plus
          </Button>
        </Box>
      </Popover>
    </>
  );
}
function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.etat && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
        
           {formatDate(notification.confirmDate)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.type}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.contenu}
      </Typography>
    </Typography>
  );

  
  if (notification.type === 'confirmation') {
    return {
      avatar: <GiConfirmed color='green' size={30}/>,
      title,
    };
  }
  if (notification.type === 'annulation') {
    return {
      avatar: <GiCancel  color='red' size={30}/>,
      title,
    };
  }
  if (notification.type === 'rappel') {
    return {
      avatar: <MdAccessTime  color='black' size={30}/>,
      title,
    };
  }
  if (notification.type === 'acces') {
    return {
      avatar: <MdOutlineFeedback color='black' size={30}/>,
      title,
    };
  }
  return {
    title,
  };
}
