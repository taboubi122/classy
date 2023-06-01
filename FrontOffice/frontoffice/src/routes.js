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
import UserPage from './pages/UserPage';
import ProductsPage from './pages/ProductsPage';
import DetailsCentre from './pages/DetailsCentre';
import PersonnelPage from './pages/personnels';
import PersonnelDetails from './pages/PersonnelDetails';
import Reservation from './pages/Reservation';
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
      path: '*',
      element: <Navigate to="/404" replace />,
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
     element: <SignUp/> ,index: true ,
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
      path: '/:type',
     element: <Coiffure isLoggedIn={isLoggedIn}/>  ,
    },
    {
      path: '/:type/:ville',
     element: <CoiffComponents isLoggedIn={isLoggedIn}/>  ,
    },
    {
      path: '/demande',
     element: <EnvDemande/>  ,
    },
    {
      path: '/:type/:ville/:nom',
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
  ]);

  return routes;
}
