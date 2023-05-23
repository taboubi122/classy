import './RestPassword.css';
import Navbar from './Navbar/navbar';
import Footer from '../Footer';
import img1 from '../../Assets/Photos/7.png';
import {SiFacebook,SiGmail} from "react-icons/si";
import Divider from "@material-ui/core/Divider";
import React from "react";

const RestPass= () =>{
  
    return(
        <>
        <Navbar/>
        <div className='navBarLinks'></div>
        <section className='RestPass'  >
            <div className='container'>
            <div className="img-container">
                <img className="span-3 image-grid-row-2" src={img1}></img>
                           
                <div>
        <form className='loginRestPass'>
<h2> Mot de passe oublié ?</h2>
<div>
<label className='labelRestPass'>Email *</label>
<input className='inputRestPass' type="text" placeholder='Email'/>
</div>
<br></br>
<div>
<button className="btns" type="submit" >Réinisialiser mon mot de passe</button>
</div>
<br></br>
<button className="a" type="submit"><a href='/auth'>Retour à la connexion</a></button>
<br></br>
<p></p>
<div className='divider'>
               <Divider className='div1'></Divider>
               <h3>OU</h3> 
                <Divider className='div2'></Divider>
                </div> </form>
                          <div className='icons'>
                          <SiFacebook className='icon'/>
                          <SiGmail className='icon2'/>
                          </div>
                          <h2>Nouveau sur Classy ?</h2>
                    <button className="btn2" type="submit" ><a href='/inscrip'>Crée mon compte</a></button>
                    <br/>
                    <p><br/></p>
                          </div>
           
                          
       
        </div>
        </div>
        </section>
        <Footer/>
        </>
    )
}

export default RestPass;




