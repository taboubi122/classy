import React from 'react';
import Navbar from './Navbar/navbar';
import Footer from '../Footer';

const Erreur= () =>{
    return(
        <>
        <Navbar/>
        <div className='navBarLinks'></div>
        <section className='Erreur'  >
            <div className='container'>
           <h1> 404 Non Trouvé</h1>
            </div>
        </section>
        <Footer/>
        </>
    )
}

export default Erreur