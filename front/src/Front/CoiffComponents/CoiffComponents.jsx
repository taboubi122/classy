
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Buffer } from 'buffer';
import {CiLocationOn,CiStar} from 'react-icons/ci';
import './CoiffComponents.css'
import maps from '../../hooks/maps';
import Footer from '../Footer';
import Navbar from '../Navbar/navbar';


const CoiffComponents= () =>{
    const location=useLocation()
    console.log(location.pathname.split('/'))
    const v=location.pathname.split('/')[2]
    const type=location.pathname.split('/')[1]
    const [ville,setVille]=useState([]);
    const [setNom]=useState([]);
    const handle= async(nom)=>{
      try{
        axios.get(`http://localhost:5000/api/getByName/${nom}`)
        .then(res=>setNom(res.data));
        console.log(nom)
        }catch(err){
          console.log(err);
        }
      }
    useEffect(()=>{
        axios.get(`http://localhost:5000/api/getAll/${v}`)
        .then(res=>setVille(res.data)
        );
         },[]);
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
                    <a href={`/${type}/${v}/${data.nom}`}  > 
                   <img alt="1"className='forme' src={`data:image/png;base64,${Buffer.from(data.src.data).toString('base64')}`} />
                     
                    </a> 
                    <h3 className='info' >Plus des informations</h3>
                    </div>
                <div className='div2'>
                <a href={`/${type}/${v}/${data.nom}`}  ><h2 onClick={()=>handle(data.nom)}>{data.nom}</h2></a>
                    <CiLocationOn className='icon'/>
                <h4>  {data.adresse} </h4>
                <a href={`/${type}/${v}/${data.nom}`}  > <button >Prendre RDV</button>  </a>
                <CiStar className='iconStar'/>
                <h4 className='note'>4.5 (185 avis)</h4>
                    </div>
              <br/>
                    </div>   
                )}
               </div>
                </div>
                <div className='maps'>
               
                {maps()}
                </div>
            </div>
        </section> 
        <Footer/>
        </>
    )
}

export default CoiffComponents;