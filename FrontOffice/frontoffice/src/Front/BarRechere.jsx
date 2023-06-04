import React,{useEffect,useState} from 'react';
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
  const [ville,setVille]=useState('')
  const [nom,setNom]=useState('')
  function cher(){
    console.log(nom.length!==0)
    if(ville.length===0 && nom.length===0){
        return
    }else if (! nom===''){
        navigate(`/${nom}`);
    }else if(ville.length!==0 && !nom===0){
      navigate(`/${nom}/${ville}`);
    }
}
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
                    <input className="inputRech" type="text" placeholder='Nom du salon, prestations (coupe...)'
                    value={nom}
                    onChange={(e)=>setNom(e.target.value)}/>
                 </div>
               </div>
               <div className="CityInput">
                <label htmlFor="city"  className="labelRech">
                 Où ?
                </label>
                 <div className="input1 flex">
                    <input  className="inputRech" type="text" placeholder='Adresse, ville...'
                    value={ville}
                    onChange={(e)=>setVille(e.target.value)}
                    />
                 <GrLocation className='icon'/>
                 </div>
               </div>
               
                <div className="searchOption1 flex" onClick={()=>cher()}>
                <GoSearch className="icon"/>
                <p className='navLink'> <span>Rechercher</span></p>
                    </div>           
            </div>
        </div>
      </section> 
    )
}

export default BarRecherche