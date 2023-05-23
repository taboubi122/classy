import { Navigate, useRoutes } from 'react-router-dom';
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
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import {useState,React } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import DashboardLayoutCentre from './layouts/dashboard - Copie/DashboardLayoutCentre';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
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
import HorairePerso from './pages/HorairePerso';

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
        { path: 'horaires', element: <HorairePerso/> },  
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
