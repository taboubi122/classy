import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
// layouts
import SimpleLayout from './layouts/simple';
//
import Page404 from './pages/Page404';
import EnvoyerDemandePage from './pages/EnvoyerDemandePage';
import ConfirmationProp from './pages/ConfirmationProp';
import {useState,React } from 'react';
// layouts
//
import Home from './Front/Home';
import Auth from './Front/Auth';
import ConfirmUser from './Front/confirmUser';
import SignUp from './Front/SignUp/SignUp';
import Calendrier from './Front/Calendrier';
import Coiffure from './Front/coiffure/Coiffure';
import DetailsCoiff from './Front/detailsCoiff/DetailsCoiff';
import CoiffComponents from './Front/CoiffComponents/CoiffComponents';
import ReservationPage from './Front/ReservationPage';
import EnvDemande from './Front/EnvDemande';

// ----------------------------------------------------------------------

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
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
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/',
     element: <Home isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> ,index: true ,
    },
    {
      path: '/auth',
     element: <Auth handleLogin={handleLogin}/> ,index: true ,
    },
    {
      path: '/SignUp',
     element: <SignUp/> ,index: true ,
    },
    {
      path: '/confirm/:activeCode',
     element: <ConfirmUser/>  ,
    },
    {
      path: '/calendrier',
     element: <Calendrier/>  ,
    },
    {
      path: '/:type',
     element: <Coiffure/>  ,
    },
    {
      path: '/:type/:ville',
     element: <CoiffComponents/>  ,
    },
    {
      path: '/demande',
     element: <EnvDemande/>  ,
    },
    {
      path: '/:type/:ville/:nom',
     element: <DetailsCoiff/>  ,
    },
    {
      path: '/reservation/:centre/:service',
     element: <ReservationPage/>  ,
    },
  ]);

  return routes;
}
