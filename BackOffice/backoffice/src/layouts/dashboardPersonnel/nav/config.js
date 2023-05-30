  import { SiGoogleanalytics } from "react-icons/si";
  import { FaUsers } from "react-icons/fa";
  import { GiSaloon } from "react-icons/gi";
  import { TbCategory } from "react-icons/tb";
  import {MdAccessTime} from "react-icons/md";
  import { CgWorkAlt } from "react-icons/cg";
  import { useLocation } from "react-router-dom";
  
  const NavConfig = () => {
    const location = useLocation();
    const CIN = location.pathname.split("/")[2];
    console.log(CIN);
  
    const navConfig = [
      {
        title: "Dashboard",
        path: `/dashboardPerso/${CIN}`,
        icon: <SiGoogleanalytics />,
      },
      {
        title: "Reservation",
        path: `/dashboardPerso/${CIN}/reservation`,
        icon: <GiSaloon />,
      },
    
      {
        title: "Horaires",
        path: `/dashboardPerso/${CIN}/horaires`,
        icon: <MdAccessTime />,
      },
     
    ];
  
    return navConfig;
  };
  
  export default NavConfig;
  