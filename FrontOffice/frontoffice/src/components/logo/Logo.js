import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import img from '../../logo2.png';
// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx }) => {


  // OR using local (public folder)
  // -------------------------------------------------------
 const logo = (
     <Box
       component="img"
      src={img} 
     sx={{ width: 50, height: 50, cursor: 'pointer', ...sx }}
    />
  );


  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
