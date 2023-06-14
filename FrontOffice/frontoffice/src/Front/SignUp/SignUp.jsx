import './SignUp.css';
import React, {useState, useEffect}from "react";
import Divider from "@material-ui/core/Divider";
import {SiFacebook,SiGmail} from "react-icons/si";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {MdOutlineClose} from "react-icons/md"
import {AiFillCheckCircle} from "react-icons/ai"
import * as Yup from 'yup';
import img1 from '../../Assets/Photos/7.png'
import Navbar from '../Navbar/navbar';
import Footer from '../Footer';

const SignUp= (isLoggedIn) =>{
  const validationSchema = Yup.object({
    email: Yup.string().email('Adresse email invalide').required('Email est obligatoire'),
   password: Yup.string().min(8, 'Mot de passe doit contenir au moins 8 caractères').matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "Mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule, une lettre minuscule et un chiffre" ).required('Mot de passe est obligatoire'),
    prenom: Yup.string().min(3, 'Prenom doit contenir au moins 3 caractères').matches(/^[a-zA-Z]+$/, 'Prenom doit contenir uniquement des lettres').required('Prenom est obligatoire'),
    nom: Yup.string().min(3, 'Nom doit contenir au moins 3 caractères').matches(/^[a-zA-Z]+$/, 'Nom doit contenir uniquement des lettres').required('Nom est obligatoire'),
    tel: Yup.number().min(8, 'Telephone doit contenir au moins 8 caractères').required('Telephone est obligatoire'),
  });
  const [showAlert, setShowAlert] = useState(false);
    const Insert = async (values) => {
        try {
          await axios.post(`http://localhost:5000/api/SignUp`,values);
          console.log("client Registration success");
        } catch (err) {
          console.log(err);
          console.log("client Registration failed");
        }
      };
      const checkMail = async (mail) => {
        try {
          const query = await axios.get(`http://localhost:5000/api/getMail/${mail}`);
          return query.data.length > 0;
        } catch (err) {
          console.log(err);
          return false;
        }
      };
      const handleSubmit = (values, { setSubmitting, setErrors }) => {
        checkMail(values.email).then(emailExist => {
          if (emailExist) {
            setErrors({
              email: 'Cet email existe déjà',
            });
            setSubmitting(false);
          } else {
            Insert(values).then(() => {
              setShowAlert(true); // Mettre l'état à true après l'insertion réussie
              setSubmitting(false);
            });
            
          }
        });
      };
      useEffect(() => {
        const timer = setTimeout(() => {
          setShowAlert(false);
        }, 20000);
        return () => clearTimeout(timer);
      }, [showAlert]);
      
    const fermer=()=>{
      setShowAlert(false)
    }
    const scrollThreshold = "header scroll";
    if (isLoggedIn) {
      // Utilisateur connecté, redirigez vers la page d'accueil
      window.location.href = '/';
      return null; // Vous pouvez également retourner null pour éviter le rendu du reste du composant
    }
    return(
        <>
        <Navbar  change={scrollThreshold}/>
        <div className='navBarLinks'/>
        <section className='SignUp'  >
            <div className='container'>
            <div className="img-container">
                <img className="span-3 image-grid-row-2" alt="1" src={img1}/>
                   
                <div>
               
                {showAlert && (
                <div className="alert alert-success alert-right" role="alert">
                 <AiFillCheckCircle/> Veuillez verifier votre boite mail    <MdOutlineClose onClick={fermer} />
                </div>)}
     
                 <Formik
        initialValues={{ email: '', password: '', tel: '', nom: '', prenom: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
 
        
  {({ isSubmitting, touched, errors }) => (
  
    <Form className='loginSignUp'>
      <div>
        <h2> Nouveau sur Classy ?</h2>
        <div>
          <label className='labelSignUp'>Nom *</label>
          <Field className='inputAuth' type="text" name="nom" placeholder=' Entrer votre nom'/>
          <ErrorMessage name="nom" component="div" className={touched.nom && errors.nom ? "error" : ""} />
        </div>
        <br/>
        <div>
          <label className='labelSignUp'>Prenom *</label>
          <Field className='inputAuth' type="text" name="prenom" placeholder=' Entrer votre prenom'/>
          <ErrorMessage name="prenom" component="div" className={touched.prenom && errors.prenom ? "error" : ""} />
        </div>
        <br/>
        <div>
          <label className='labelSignUp'>Téléphone portable *</label>
          <Field className='inputAuth' type="number" name="tel" placeholder=' Entrer votre numero'/>
          <ErrorMessage name="tel" component="div" className={touched.tel && errors.tel ? "error" : ""} />
        </div>
        <br/>
        <div>
        <label className='labelSignUp'> Email * </label>
        <Field className='inputAuth' type="text" name="email" placeholder='  email' />
        <ErrorMessage name="email" component="div" className={touched.email && errors.email ? "error" : ""}/>
    </div>
        
      </div>
      <br/>
      <div>
        <label className='labelSignUp'> Mot de passe * </label>
        <Field className='inputAuth' type="password" name="password"placeholder='  Mot de passe' />
        <ErrorMessage name="password" component="div" className={touched.password && errors.password ? "error" : ""}/>
      </div>
      
      <button className="btn3" type="submit" disabled={isSubmitting}>Crée un compte</button>
      <div className='divider'>
        <Divider className='div1'/>
        <h3>OU</h3> 
        <Divider className='div2'/>
      </div>
      
    </Form> 
  )}
</Formik>

        <div className='icons'>
                    <SiFacebook className='icon'/>
                    <SiGmail className='icon2'/>
                    </div>
                    <h2>Vous avez deja utilisé Classy ?</h2>
                    <button className="btn2" type="submit" ><a href='/auth'>Se connecter</a></button>
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

export default SignUp;