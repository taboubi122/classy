import React,{useState,useEffect}from 'react';
import './navbar.css';
import {GrFormClose} from "react-icons/gr";
import{TbGridDots, TbSpace} from "react-icons/tb";
import axios from 'axios';

import NotificationsPopover from '../../layouts/dashboard/header/NotificationsPopover';
import AccountPop from '../../layouts/dashboard/header/AccountPop';


const Navbar = ({ isLoggedIn, handleLogout, change}) => {
  
  const [active, setActive] = useState('navBar');
  const [scroll, setScroll] = useState(false);
  const [email, setEmail] = useState('');
  const [client, setClient] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);


  useEffect(() => {
    axios.get(`http://localhost:5000/api/getInfosClient/${email}`)
      .then(res => {
        setClient(res.data);
        console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [email]);
  const showNav = () => {
    setActive('navBar activeNavbar');
  };
  const coiffure="coiffure";
  const barbier="barbier";
  const institut="institut";
  const manucure="manucure";
  const removeNav = () => {
    setActive('navBar');
  };

  const changeBackground = () => {

    if (window.scrollY >= 30) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };
  
  window.addEventListener('scroll', changeBackground);

const navbarClass = scroll ? 'header scroll' :change ;

  return (
    <section className="navBarSection">
      <header className={navbarClass} >
        <div className="logoDiv">
          <a href="/" className="navLink">
            <h1 className="logo flex"> Classy </h1>
          </a>
        </div>
        <div className={active}>
          <ul className="navLists flex">
            <li className="navItem">
              <a href={`/${coiffure}`} className="navLink">
                {' '}
                Coiffure{' '}
              </a>
            </li>
            <li className="navItem">
              <a href={`/${barbier}`} className="navLink">
                {' '}
                Barbier{' '}
              </a>
            </li>
            <li className="navItem">
              <a href={`/${manucure}`} className="navLink">
                {' '}
                Manucure{' '}
              </a>
            </li>
            <li className="navItem">
              <a href={`/${institut}`} className="navLink">
                {' '}
                Institut de beauté{' '}
              </a>
            </li>
             {isLoggedIn ? (
              <>
               
                  </>
            ) : (
              <button className="btn1">
              <a href="/partenaire">Ajouter votre salon</a>
            </button>
            )}
            {isLoggedIn ? (
               <> 
               <NotificationsPopover />
               {client.map((donne)=>    
               <AccountPop nom={donne.nom} prenom={donne.prenom} email={donne.email} photo={donne.photo}  handleLogout={handleLogout}/>
                       )} 
                 </>
            ) : (
              <button className="btn">
                <a href="/auth">Se connecter</a>
              </button>
            )}
          </ul>
          <button
            className="closeNavbar"
            role="button"
            tabIndex="0"
            onClick={removeNav}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                removeNav();
              }
            }}
          >
            <GrFormClose className="icon" />
          </button>
        </div>
        <button
          className="toggleNavbar"
          role="button"
          tabIndex="0"
          onClick={showNav}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              showNav();
            }
          }}
        >
          <TbGridDots className="icon" />
        </button>
      </header>
    </section>
  );
};

export default Navbar;
