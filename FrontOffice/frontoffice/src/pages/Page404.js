import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import img from "../notFound.jpg";
// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | Minimal UI </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
          Désolé, la page est introuvable !
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
          Désolé, nous n'avons pas pu trouver la page que vous recherchez. Peut-être avez-vous mal saisi l'URL ? Assurez-vous de vérifier l'orthographe.

          </Typography>
         

          <Box
            component="img"
            src={img}
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />
           <a href='/'>
          <button to="/" size="large" variant="contained" className='btn' component={RouterLink}>
            Acceuil
          </button>
          </a>
        </StyledContent>
      </Container>
    </>
  );
}
