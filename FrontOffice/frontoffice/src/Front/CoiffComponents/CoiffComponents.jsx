
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Buffer } from 'buffer';
import {CiLocationOn,CiStar} from 'react-icons/ci';
import './CoiffComponents.css'
import maps from '../../hooks/maps';
import Footer from '../Footer';
import Navbar from '../Navbar/navbar';

import MapsCentre from '../../hooks/mapsCenter';

const CoiffComponents= () =>{
    const location=useLocation()
    console.log(location.pathname.split('/'))
    const v=location.pathname.split('/')[3]
    const type=location.pathname.split('/')[2]
    console.log(type)
    const [ville,setVille]=useState([]);
    const [setNom]=useState([]);
    var typ="";
    const handle= async(nom)=>{

      try{
        axios.get(`http://localhost:5000/api/getByName/${nom}`)
        .then(res=>setNom(res.data));
        console.log(nom)
        }catch(err){
          console.log(err);
        }
      }
      if (type === "coiffure") {
        typ = 'Coiffeur';
      }else   if (type === "manucure") {
        typ = 'Manucure';
      }else   if (type === "barbier") {
        typ = 'Barbier';
      }else   if (type === "institut") {
        typ = 'Institut de beauté';
      }
         useEffect(() => {
           
            axios.get("http://localhost:5000/api/getAll", {
              params: {
                ville: v,
               type: typ,
              }
            })
            .then(res => {
              setVille(res.data);
            })
            .catch(error => {
              console.error("Error fetching data:", error);
            });
          }, []);
          
          const [loc,setLoc]=useState([]);
          const l=[]
          let local=()=>{
              for (let i=0;i<ville.length;i++){
                  axios.get(`http://localhost:5000/api/getAdresse/${ville[i].nom}`)
              .then(res=>
                  setLoc(res.data),
              )
              if(loc.length>0){
                  l[i]={x:loc[0].localisation.x,y:loc[0].localisation.y}
              }
              }
              if(l.length===0){
                  return [{x:0,y:0}]
                
              }else{
                  return l
                  
              }
          }

         const scrollThreshold = "header scroll";
    return(
        <>
        <Navbar  change={scrollThreshold}/>
        <div className='navBarLinks'/>
        <section className='Coiffeur'  >
        <br/> 
        <div className='select'><b>Sélectionnez un salon</b><br/> Les meilleurs salons et instituts aux alentours de {v} : Réservation en ligne </div>
        <br/>
         <div className='containerCoiFF'>
          <div className='salon'>
             <div className='liste'>
                <br/>
                {ville.map(data => 
                <div key={data.reference} className="divs">
                    <div className='div1'>
                    <a href={`/classy/${type}/${v}/${data.nom}`}  > 
                   <img alt="1"className='forme' src={`data:image/png;base64,${Buffer.from(data.src.data).toString('base64')}`} />
                     
                    </a> 
                    <h3 className='info' >Plus des informations</h3>
                    </div>
                <div className='div2'>
                <a href={`/classy/${type}/${v}/${data.nom}`}  ><h2 onClick={()=>handle(data.nom)}>{data.nom}</h2></a>
                    <CiLocationOn className='icon'/>
                <h4>  {data.adresse} </h4>
                <a href={`/classy/${type}/${v}/${data.nom}`}  > <button >Prendre RDV</button>  </a>
                <CiStar className='iconStar'/>
                <h4 >4.5 (185 avis)</h4>
                    </div>
              <br/>
                    </div>   
                )}
               </div>
                </div>
                <div className='maps'>
                <MapsCentre localistation={local()}/>
                </div>
            </div>
        </section> 
        <Footer/>
        </>
    )
}

export default CoiffComponents;