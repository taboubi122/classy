import {useState, useEffect,React } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import {SiFacebook,SiGmail} from "react-icons/si";
import Footer from "./Footer";
import img1 from '../Assets/Photos/7.png';
import Navbar from './Navbar/navbar';

const Auth= () =>{
    
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState([]);
const Navigate = useNavigate();
console.log(`auth avant${isLoggedIn}`)

const signIn = async (e) => {
  e.preventDefault(); 
  try {
    const response = await axios.post(`http://localhost:5000/api/signIn`, { email, password });
    const { token, type } = response.data;
    console.log('Login success');
    console.log('Personnel type:', type);
    if (type === 'personnel') {
      Navigate('/dashboard/app');
    } else if (type === 'client') {
      localStorage.setItem('isLoggedIn', true);
      setIsLoggedIn(true);
      Navigate('/'); 
    }
  } catch (err) {
    console.log(err);
    console.log('Login failed');
  }
};

useEffect(() => {
  if (email) {
    axios.get(`http://localhost:5000/api/user/${email}`)
      .then(res => setUser(res.data));
  }
}, [email]);

const scrollThreshold = "header scroll";
    return(
        <>
         <Navbar change={scrollThreshold} />
        <div className='navBarLinks'/>
        <div><br/><p/><br/></div>
        <section className='Auth'  >
            <div className='container'>
            <div className="Authimg-container">
                <img className="span-3 image-grid-row-2" alt="1" src={img1}/>
                   
                <div>
        <h2> Vous avez déja utilisé Classy ?</h2>
        {user.map((row)=>
          <h2>{row.nom}</h2>
          )}
        <form className='loginAuth'>
        <div>
        <label htmlFor="email" className='labelAuth'>Email *</label>
        <input type="text" id='email' placeholder='Email' value={email}
         onChange={(e) => {setEmail(e.target.value)}} className='inputAuth'/>
        </div>
        <br/>
        <div>
        <label htmlFor="password" className='labelAuth'> Mot de passe * </label>
        <input type="password" id='password' placeholder='  Mot de passe' value={password}
         onChange={(e) => {setPassword(e.target.value)}} className='inputAuth'/>
        </div>
        <br/>
        <button className="a" ><a href='/restPass' className="Autha">Mot de passe oublié ? </a></button>
       <br/>
       <button className="Authbtn1" onClick={signIn}> Se Connecter</button>

  
        <div className='divider'>
                       <Divider className='Authdiv1'/>
                       <h3 className="Authh3">OU</h3> 
                        <Divider className='Authdiv2'/>
                        </div> </form>
                          <div className='Authicons'>
                          <SiFacebook className='Authicon'/>
                          <SiGmail className='Authicon2'/>
                          </div>
                          <h2>Nouveau sur Classy ?</h2>
                    <button className="Authbtn2" type="submit" ><a href='/SignUp' className="Autha">Crée mon compte</a></button>
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

export default Auth