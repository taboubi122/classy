
import { SiGoogleanalytics } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import { MdOutlineVilla,MdAccessTime } from "react-icons/md";
import { CgWorkAlt } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import { ImGift } from "react-icons/im";
import { GoCalendar } from "react-icons/go";
import { AiFillStar } from "react-icons/ai";

const NavConfig = () => {
  const location = useLocation();
  const IdSalon = location.pathname.split("/")[2];
  console.log(IdSalon);

  const navConfig = [
    {
      title: "Tableau de bord",
      path: `/dashboardCentreProp/${IdSalon}/appCentreProp`,
      icon: <SiGoogleanalytics />,
    },
    {
      title: "Réservation",
      path: `/dashboardCentreProp/${IdSalon}/reservationProp`,
      icon: <GoCalendar />,
    },
    {
      title: "Personnels",
      path: `/dashboardCentreProp/${IdSalon}/personnelsProp`,
      icon: <FaUsers />,
    },
    {
      title: "Categories",
      path: `/dashboardCentreProp/${IdSalon}/categoriesProp`,
      icon: <TbCategory />,
    },
    {
      title: "Services",
      path: `/dashboardCentreProp/${IdSalon}/servicesProp`,
      icon: <CgWorkAlt />,
    },
    {
      title: "Offres",
      path: `/dashboardCentreProp/${IdSalon}/offresProp`,
      icon: <ImGift />,
    },
    {
      title: "Horaires de travail",
      path: `/dashboardCentreProp/${IdSalon}/horairesProp`,
      icon: <MdAccessTime/>,
    },
    {
      title: "Avis Client",
      path: `/dashboardCentreProp/${IdSalon}/comm`,
      icon: <AiFillStar />,
    },
  
    {
      title: "Informations",
      path: `/dashboardCentreProp/${IdSalon}/infoProp`,
      icon: <MdOutlineVilla />,
    },
  ];

  return navConfig;
};

export default NavConfig;
