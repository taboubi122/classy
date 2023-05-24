import React, {useState} from "react";
import {GrFormClose} from "react-icons/gr";
import {TbGridDots} from "react-icons/tb";

export default function NavBar() {
    const[active ,setActive]=useState('navBar')
  // function pour montrer la navbar
  const showNav=()=>{
     setActive('navBar activeNavbar')
  }
   // function pour supprimer la navbar
  const removeNav=()=>{
    setActive('navBar')
 }
 return(
    <section className='navBarSection'>
     <header className='header flex'>
    
       <div className='logoDiv'>
       <a href="/" className='navLink'><h1 className='logo flex'> Classy </h1></a>
            
       </div>
       <div className={active}>
         <ul className='navLists flex'>
           <li className='navItem'>
           <a href="/coiffeur" className='navLink'> Coiffeur </a>
           </li>
           <li className='navItem'>
           <a href="/barbier" className='navLink'> Barbier </a>
           </li>
           <li className='navItem'>
           <a href="/manucure" className='navLink'> Manucure </a>
           </li>
           <li className='navItem'>
           <a href="/institut" className='navLink'> Institut de beauté </a>
           </li>
           <li className='navItem'>
           <a href="/mag" className='navLink'> Mag </a>
           </li>
           <button className='btn1'><a href='/partenaire'>Ajouter votre établissement</a></button>
           <button className='btn'><a href='/auth' >Se connecter</a></button>
        </ul>
        <button onClick={removeNav} className="closeNavbar">
        <GrFormClose className="icon"/>
        </button>
       </div>
       <button onClick={showNav} className="toggleNavbar">
         <TbGridDots className="icon"/>
        </button>
     </header>
    </section>
 )
	}
