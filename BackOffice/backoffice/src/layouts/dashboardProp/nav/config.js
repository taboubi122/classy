

  import {GiSaloon} from "react-icons/gi"
  import { useLocation } from "react-router-dom";
  import { GoCalendar } from "react-icons/go";
  import { CgProfile } from "react-icons/cg";

const NavConfig = () => {
  const location = useLocation();
  const CIN = location.pathname.split("/")[2];
  console.log(CIN);

  const navConfig = [
    {
      title: "tableau de bord",
      path: `/dashboardProp/${CIN}/appProp`,
      icon: <GoCalendar />,
    },
    {
      title: "Mes centres",
      path: `/dashboardProp/${CIN}/centres`,
      icon: <GiSaloon />,
    },
    {
      title: "Profile",
      path: `/dashboardProp/${CIN}/info`,
      icon: <CgProfile />,
    },
   
  ];

  return navConfig;
};
export default NavConfig;

