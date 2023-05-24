
import React, {useState, useEffect}from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import Auth from "./Auth";



const ConfirmUser= () =>{
    const {activeCode}=useParams();
    console.log(activeCode)
 
    axios.put(`http://localhost:5000/api/verifyUser/${activeCode}`);
    axios.put(`http://localhost:5000/api/verifyPerso/${activeCode}`);
      

    return(
      <Auth/>
    )
}

export default ConfirmUser