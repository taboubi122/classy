import React,{useState}from 'react';
import './navbar.css';
import {GrFormClose} from "react-icons/gr";
import{TbGridDots} from "react-icons/tb";
import Swal from 'sweetalert2';
import NotificationsPopover from '../../layouts/dashboard/header/NotificationsPopover';

const Navbar = ({ isLoggedIn, handleLogout, change }) => {
  const [active, setActive] = useState('navBar');
  const [scroll, setScroll] = useState(false);
  // function pour montrer la navbar
  const showNav = () => {
    setActive('navBar activeNavbar');
  };
  const coiffure="coiffure";
  const barbier="barbier";
  const institut="institut";
  const manucure="manucure";
  // function pour supprimer la navbar
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
  
  function Deconnecter()
{   
     const swalWithBootstrapButtons = Swal.mixin({
         customClass: {
           confirmButton: 'btn btn-success',
           cancelButton: 'btn btn-danger'
         },
         buttonsStyling: false
       })
       swalWithBootstrapButtons.fire({
         title: 'Êtes-vous sûr?',
         text: "Vous ne pourrez pas revenir en arrière!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Oui, Deconnecter!',
         cancelButtonText: 'Non, annuler!',
         reverseButtons: true
       }).then((result) => {
         if (result.isConfirmed) {
          handleLogout();
           swalWithBootstrapButtons.fire(
             'Deconnecter!',
             'success'
           )
          window.location.reload()
         } else if (
           result.dismiss === Swal.DismissReason.cancel
         ) {
           swalWithBootstrapButtons.fire(
             'Annulé',
             'Vous rester connecter :)',
             'erreur'
           )
         }
       })
       
     
}
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
               <NotificationsPopover />
            ) : (
              <button className="btn1">
              <a href="/demande">Ajouter votre salon</a>
            </button>
            )}
            {isLoggedIn ? (
              <button className="btnDeco" onClick={Deconnecter}>Se Deconnecter</button>
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
