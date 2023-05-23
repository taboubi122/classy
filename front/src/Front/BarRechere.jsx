import React,{useEffect} from 'react';
import {GrLocation} from'react-icons/gr';
import {GoSearch} from 'react-icons/go';
import Aos from 'aos';
import video from "../Assets/make.mp4";
import 'aos/dist/aos.css'

const BarRecherche= () =>{
  // pour l'annimation 
  useEffect(()=>{
    Aos.init({duration:20000})
  },[])
    return(
      <section className='BarRecherche'>
        <div className='overlay'/>
        <video src={video} type='video/mp4' muted autoPlay loop/>
        <div className="BarRechercheContent container">
            <div className="textDiv">
            <h1 className="BarRechercheTitle" data-aos="fade-up" >
                Vos rendez-vous de beauté en ligne
            </h1>
            <span data-aos="fade-up" className="smallText">
                 Simple • Immédiat • 24h/24
            </span>
            </div>
            <div className="cardDiv grid" data-aos="fade-up" >
               <div className="salonInput">
                <label  className="labelRech" htmlFor="salon">
                Que chercher-vous ?
                </label>
                 <div className="input1 flex">
                    <input className="inputRech" type="text" placeholder='Nom du salon, prestations (coupe...)'/>
                 </div>
               </div>
               <div className="CityInput">
                <label htmlFor="city"  className="labelRech">
                 Où ?
                </label>
                 <div className="input1 flex">
                    <input  className="inputRech" type="text" placeholder='Adresse, ville...'/>
                 <GrLocation className='icon'/>
                 </div>
               </div>
               
                <div className="searchOption1 flex">
                <a href="/recherche" className='navLink'> <span>Rechercher</span></a>
                
                    <GoSearch className="icon"/>
                    </div>           
            </div>
        </div>
      </section> 
    )
}

export default BarRecherche