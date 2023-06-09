import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
// layouts
import SimpleLayout from './layouts/simple';
//
import Page404 from './pages/Page404';
import ConfirmationProp from './pages/ConfirmationProp';
import {useState,React } from 'react';
// layouts
import ProfilClient from './Front/profilClient';
import Home from './Front/Home';
import Auth from './Front/Auth';
import ConfirmUser from './Front/confirmUser';
import SignUp from './Front/SignUp/SignUp';
import Coiffure from './Front/coiffure/Coiffure';
import DetailsCoiff from './Front/detailsCoiff/DetailsCoiff';
import CoiffComponents from './Front/CoiffComponents/CoiffComponents';
import ReservationPage from './Front/ReservationPage';
import EnvDemande from './Front/EnvDemande';
import AlertProtection from './AlertProtection';
export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [email] = useState(localStorage.getItem('email'));
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', true);
    navigate('/');
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };
  const routes = useRoutes([
    {
      path: 'confirmation',
      element: <ConfirmationProp />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />},
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    
    {
      path: '/',
     element: <Home isLoggedIn={isLoggedIn} email={email}/> ,index: true ,
    },
    {
      path: '/auth',
     element: <Auth handleLogin={handleLogin}/> ,index: true ,
    },
    {
      path: '/SignUp',
     element: <SignUp isLoggedIn={isLoggedIn}/> ,index: true ,
    },
    {
      path: '/Profil',
     element: <ProfilClient handleLogout={handleLogout} isLoggedIn={isLoggedIn}/>,index: true ,
    },
    {
      path: '/confirm/:activeCode',
     element: <ConfirmUser/>  ,
    },
    {
      path: '/classy/:type',
     element: <Coiffure isLoggedIn={isLoggedIn}/>  ,
    },
    {
      path: '/classy/:type/:ville',
     element: <CoiffComponents isLoggedIn={isLoggedIn}/>  ,
    },
    {
      path: '/demande',
     element: <EnvDemande/>  ,
    },
    {
      path: '/classy/:type/:ville/:nom',
     element: <DetailsCoiff isLoggedIn={isLoggedIn}/>  ,
    },
    {
      path: '/reservation/:centre/:service',
     element: <ReservationPage isLoggedIn={isLoggedIn}/>  ,
    },
    {
      path: '/reservation/:centre/:service/:ref',
     element: <ReservationPage isLoggedIn={isLoggedIn}/>  ,
    },
    {
      path: '/notConnected',
     element: <AlertProtection/>  ,
    },
  ]);

  return routes;
}
