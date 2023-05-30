import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import DashboardLayoutCentre from './layouts/dashboard - Copie/DashboardLayoutCentre';
import SimpleLayout from './layouts/simple';
//
import Page404 from './pages/Page404';
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
// layouts
import UserPage from './pages/UserPage';
import ProductsPage from './pages/ProductsPage';
import DetailsCentre from './pages/DetailsCentre';
import PersonnelPage from './pages/personnels';
import PersonnelDetails from './pages/PersonnelDetails';
import Reservation from './pages/Reservation';
import DashboardLayoutPersonnel from './layouts/dashboardPersonnel/DashboardLayoutPersonnel';
import HomeApp from './pages/Home/HomeApp';
import PersoLogin from './pages/PersoLogin';
import HorairePerso from './pages/HorairePerso';
import ReservationPerso from './pages/ReservationPerso';

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
     element: <HomeApp/> ,index: true ,
    },
    {
      path: '/admin',
     element: <LoginAdmin/> ,index: true ,
    },
    {
      path: '/prop',
     element: <PersoLogin/> ,index: true ,
    },
    {
      path: '/perso',
     element: <PersoLogin/> ,index: true ,
    },
  ]);

  return routes;
}
