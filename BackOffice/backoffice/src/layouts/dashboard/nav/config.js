

import {SiGoogleanalytics} from "react-icons/si";
import {FaUsers} from "react-icons/fa";
import {GiSaloon} from "react-icons/gi"
import {ImGift} from "react-icons/im"

import {TbReportAnalytics,TbCategory} from "react-icons/tb"
import {MdOutlineVilla} from "react-icons/md";
import {CgWorkAlt} from "react-icons/cg"
import {HiUserGroup} from "react-icons/hi";

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard/app',
    icon: <SiGoogleanalytics/>,
  },
  {
    title: 'Clients',
    path: '/dashboard/clients',
    icon: <FaUsers/>,
  },
  {
    title: 'Centres',
    path: '/dashboard/centres',
    icon:<GiSaloon/>,
  },
  {
    title: 'Proprietaires',
    path: '/dashboard/proprietaires',
    icon: <HiUserGroup/>,
  },
  {
    title: 'Demandes',
    path: '/dashboard/demandes',
    icon: <TbReportAnalytics/>,
  },
  {
    title: 'Categories',
    path: '/dashboard/categories',
    icon: <TbCategory/>,
  },
  {
    title: 'Services',
    path: '/dashboard/services',
    icon: <CgWorkAlt/>,
  },
  {
    title: 'Offres',
    path: '/dashboard/offres',
    icon: <ImGift/>,
  },

];

export default navConfig;
