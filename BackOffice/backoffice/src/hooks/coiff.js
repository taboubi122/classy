import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';

import { useLocation} from "react-router-dom";

 const UseCoiff=(type)=> {
  console.log(type)
      const [ville,setVille]=useState([]);

      const handle= async(ville)=>{
        try{
          axios.get(`http://localhost:5000/api/getAll/${ville}`)
          .then(res=>setVille(res.data));
          }catch(err){
            console.log(err);
          }
        }

     useEffect(()=>{
       axios.get('http://localhost:5000/api/get')
       .then(res=>setVille(res.data)
       );
        },[]);
       
     return (
        <div className='row'>
        {ville.map(data => 
        <div key={data.idVille}> <a href={`/${type}/${data.nom}`} ><button onClick={()=>handle(data.nom)} className='decouvrez'><h4 >Découvrez nos {type}s à </h4></button></a>
     <br/><br/>
     <a href={`/${type}/${data.nom}`} >
      <img alt="1"className='forme' src={`data:image/png;base64,${Buffer.from(data.image.data).toString('base64')}`} /></a>
     <br/><br/>
            </div>   
        )}
      </div>
      );
    }

export default UseCoiff;


