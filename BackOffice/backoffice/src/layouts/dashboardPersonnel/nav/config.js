
  import {MdAccessTime} from "react-icons/md";
  import { useLocation } from "react-router-dom";
  import { GoCalendar } from "react-icons/go";
  import { CgProfile } from "react-icons/cg";

  
  const NavConfig = () => {
    const location = useLocation();
    const CIN = location.pathname.split("/")[2];
    console.log(CIN);
  
    const navConfig = [
      {
        title: "Réservation",
        path: `/dashboardPerso/${CIN}/reservation`,
        icon: <GoCalendar />,
      },
    
      {
        title: "Horaires",
        path: `/dashboardPerso/${CIN}/horaires`,
        icon: <MdAccessTime />,
      },

      {
        title: "Profile",
        path: `/dashboardPerso/${CIN}/profile`,
        icon: <CgProfile />,
      },
     
    ];
  
    return navConfig;
  };
  
  export default NavConfig;
  