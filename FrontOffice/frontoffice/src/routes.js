import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import DashboardLayoutCentre from './layouts/dashboard - Copie/DashboardLayoutCentre';
import SimpleLayout from './layouts/simple';
//
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import CategoriesPage from './pages/CategoriesPage';
import ServicesPage from './pages/ServicesPage';
import ServicePageProp from './pages/ServicePageProp';
import OffrePage from './pages/OffrePage';
import OffrePageProp from './pages/OffrePageProp';
import HoraireProp from './pages/HoraireProp';
import DemandesPage from './pages/DemandesPage';
import EnvoyerDemandePage from './pages/EnvoyerDemandePage';
import ConfirmationProp from './pages/ConfirmationProp';
import DashboardAdmin from './pages/DashboardAdmin';
import LoginAdmin from './pages/LoginAdmin';
import PropLogin from './pages/PropLogin';
import {useState,React } from 'react';
import UserPage from './pages/UserPage';
import ProductsPage from './pages/ProductsPage';
import DetailsCentre from './pages/DetailsCentre';
import PersonnelPage from './pages/personnels';
import PersonnelDetails from './pages/PersonnelDetails';
import Reservation from './pages/Reservation';
import Home from './Front/Home';
import Auth from './Front/Auth';
import ProfilClient from './Front/profilClient';
import ConfirmUser from './Front/confirmUser';
import SignUp from './Front/SignUp/SignUp';
import Calendrier from './Front/Calendrier';
import Coiffure from './Front/coiffure/Coiffure';
import DetailsCoiff from './Front/detailsCoiff/DetailsCoiff';
import CoiffComponents from './Front/CoiffComponents/CoiffComponents';
import ReservationPage from './Front/ReservationPage';
import DashboardLayoutPersonnel from './layouts/dashboardPersonnel/DashboardLayoutPersonnel';
import ReservationPerso from './pages/ReservationPerso';

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
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAdmin /> },
        { path: 'demandes', element: <DemandesPage /> },
        { path: 'clients', element: <UserPage /> },
        { path: 'centres', element: <ProductsPage /> },
        { path: 'categories', element: <CategoriesPage /> },
        { path: 'services', element: <ServicesPage /> },
        { path: 'offres', element: <OffrePage /> },
      ],
    },
    {    
      path: '/dashboardCentre/:id',
      element:<DashboardLayoutCentre/> ,
      children: [
        { path: '/dashboardCentre/:id/app', element: <DashboardLayoutCentre/>},
        { path: 'personnels', element: <PersonnelPage/> },
        { path: 'reservation', element: <Reservation/> },
        { path: 'categories', element: <CategoriesPage /> },
        { path: 'services', element: <ServicePageProp /> },
        { path: 'offres', element: <OffrePageProp /> }, 
        { path: 'horaires', element: <HoraireProp /> },
        { path: 'info', element: <DetailsCentre/> },
        { path: 'detailPerso/:CIN', element: <PersonnelDetails/> },
      ],
    },
    {    
      path: '/dashboardPerso/:id',
      element:<DashboardLayoutPersonnel/> ,
      children: [
        { path: '/dashboardPerso/:id', element: <DashboardLayoutPersonnel/>,index: true },
        { path: 'reservation', element: <ReservationPerso/> },
      ],
    },
    {
      path: 'login',
      element: <EnvoyerDemandePage />,
    },
    {
      path: 'loginAdmin',
      element: <LoginAdmin />,
    },
    {
      path: 'loginProp',
      element: <PropLogin />,
    },
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
