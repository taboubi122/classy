
import { SiGoogleanalytics } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import { MdOutlineVilla,MdAccessTime } from "react-icons/md";
import { CgWorkAlt } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import { ImGift } from "react-icons/im";
import { GoCalendar } from "react-icons/go";

const NavConfig = () => {
  const location = useLocation();
  const IdSalon = location.pathname.split("/")[2];
  console.log(IdSalon);

  const navConfig = [
    {
      title: "Dashboard",
      path: `/dashboardCentre/${IdSalon}/appCentre`,
      icon: <SiGoogleanalytics />,
    },
    {
      title: "Reservation",
      path: `/dashboardCentre/${IdSalon}/reservation`,
      icon: <GoCalendar />,
    },
    {
      title: "Personnels",
      path: `/dashboardCentre/${IdSalon}/personnels`,
      icon: <FaUsers />,
    },
    {
      title: "Categories",
      path: `/dashboardCentre/${IdSalon}/categories`,
      icon: <TbCategory />,
    },
    {
      title: "Services",
      path: `/dashboardCentre/${IdSalon}/services`,
      icon: <CgWorkAlt />,
    },
    {
      title: "Offres",
      path: `/dashboardCentre/${IdSalon}/offres`,
      icon: <ImGift />,
    },
    {
      title: "Horaires de travail",
      path: `/dashboardCentre/${IdSalon}/horaires`,
      icon: <MdAccessTime/>,
    },
  
    {
      title: "Informations",
      path: `/dashboardCentre/${IdSalon}/info`,
      icon: <MdOutlineVilla />,
    },
  ];

  return navConfig;
};

export default NavConfig;
