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

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAdmin /> },
        { path: 'demandes', element: <DemandesPage /> },
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
        { path: 'categories', element: <CategoriesPage /> },
        { path: 'services', element: <ServicePageProp /> },
        { path: 'offres', element: <OffrePageProp /> }, 
        { path: 'horaires', element: <HoraireProp /> },
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
  ]);

  return routes;
}
