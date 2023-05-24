import React from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Navbar from './Navbar/navbar';

const ProfilClient= () =>{

  const {activeCode}=useParams();
   console.log(activeCode)
    return(
        <>
        <Navbar/>
        <div className='navBarLinks'/>
        <section className='profilClient'  >
            <div className='container'>
            <div className="img-container">
              <h1>Activerrr</h1>
                   
             
        
                         
               </div>
            </div>
        </section>
        <Footer/>
        </>
    )
}

export default ProfilClient