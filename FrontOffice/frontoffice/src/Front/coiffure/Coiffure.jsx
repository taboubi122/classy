import React, { useState } from 'react';
import './coiffure.css';
import {GrLocation} from'react-icons/gr';
import {GoSearch} from 'react-icons/go';
import { useLocation} from "react-router-dom";
import coiff from '../../hooks/coiff';
import Footer from '../Footer';
import Navbar from '../Navbar/navbar';
import img1 from '../../Assets/Photos/10.jpg';
import { useNavigate } from 'react-router-dom';


const Coiffure= ({ isLoggedIn}) =>{
    const location = useLocation();
    const navigate = useNavigate();
    const type = location.pathname.split("/")[1];
    const [ville,setVille]=useState('')
    const scrollThreshold = "header scroll";
    function cher(){
        if(ville.length===0){
            return
        }else{
            navigate(`/${type}/${ville}`);
        }
    }
    return(
        <>
        <Navbar change={scrollThreshold} isLoggedIn={isLoggedIn}/>
        <div className='navBarLinks'/>
        <section className='Coiffeur'  >
            <div className='container'>
           <h1>Réserver en ligne un RDV avec un {type}</h1>
           <div className="BarRechercheContent container">
            <div className="cardDiv grid"  >
               <div className="salonInput">
                <label htmlFor="salon" className="labelRech">
                Que chercher-vous ?
                </label>
                 <div className="input1 flex">
                 <input
                    className="inputRech"
                    type="text"
                    placeholder={type}
                    disabled
                    />

                 </div>
               </div>
               <div className="CityInput">
                <label htmlFor="city" className="labelRech">
                 Où ?
                </label>
                 <div className="input1 flex">
                    <input className="inputRech" type="text" placeholder='Adresse, ville...'
                    value={ville}
                    onChange={(e)=>setVille(e.target.value)}/>
                 <GrLocation className='icon'/>
                 </div>
               </div>
               
                <div className="searchOptions1 flex" onClick={()=>cher()}>
                <a className='navLink'><span>Rechercher</span></a>
         
                    <GoSearch className="icon"/>
                    </div>           
            </div>
    
            </div>
             <div>
             { coiff(type)}
                </div> 
            <p>Vous désirez une nouvelle coupe de cheveux pour sublimer votre visage ou 
                une coiffure tendance pour sortir ? Que ce soit pour des cheveux longs, courts ou mi-longs, 
                l’art du coiffage doit être laissé aux professionnels. Pour chaque objectif relooking, 
                il y a une méthode précise que seuls les coiffeurs aguerris peuvent mettre en œuvre. 
                Nous avons sélectionné pour vous des coiffeurs à Tunis, à Sfax, à Sousse ou encore à Nabeul.</p>
                <h2>Où trouver un salon de coiffure pour une technique particulière ?</h2>
                <h3>Qu’en est-il de la coiffure pour homme ?</h3>
                <p>Les petits salons de coiffure dédiés spécialement à la gent masculine sont pris d’assaut. Savant mélange entre le barbier et le salon de coiffure traditionnel,
                     ces nouveaux salons taillent la barbe, pratiquent le rasage à l’ancienne et coupent les cheveux pour une allure stylée et moderne. 
                     Notre sélection des meilleures adresses pour homme nous conduit à Le Barber Shop à Hedi Nouira , 
                    qui est un de nos coups de cœur, car le salon offre une prestation complète et reçoit autant les hommes, 
                    les femmes et les enfants. Vous apprécierez son style décalé et son ambiance atypique pour passer un agréable 
                    moment entre les mains expertes des coiffeuses.</p>
                <div className="img-container">
                <img alt='1' src={img1}/>

                </div>
                <br/>
                <h3>Adoptez la coiffure bio</h3>
                <p>Vous avez les cheveux bouclés, fins et délicats ou peut-être des cheveux secs et très abîmés ? 
                    Prenez rendez-vous dans un salon de coiffure qui n’utilise que des produits 100% naturels 
                    labellisés : des soins capillaires, des colorations, des shampoings ou des crèmes pour cheveux
                     essentiellement fabriqués avec des ingrédients végétaux et sans produits chimiques pour soigner
                      les cheveux tout en préservant votre santé.</p>
                      <h2>La coiffure de vos rêves</h2>
                <h3>Des coiffures pour les grandes occasions</h3>
                <p>Coiffure de mariée ou coiffure de soirée, les coiffures proposent de nombreuses options
                     pour être la plus chic et éviter à tout prix le chignon classique un brin ennuyeux.
                      Votre coiffeur est votre meilleur allié pour réaliser le chignon romantique ou le chignon 
                      tressé qui vous fait tant rêver dans les magazines. Il peut également vous conseiller sur 
                      les accessoires tendance comme le heabdand ou encore les barrettes. Si en plus vous êtes
                       adepte de la coloration, prenez rendez-vous en ligne avec Excellence Coiffure.<br/>
                       Coupe homme, femme, enfant, brushing, coloration, coiffure afro, coiffeur bio… 
                       les styles et les tendances rythment les journées des professionnels de ce métier, 
                       les incitant à découvrir les nouvelles techniques et les innovations technologiques qui 
                       leur permettront de mieux satisfaire leur clientèle et de proposer une large gamme de prix 
                       et de prestations.</p>
                       <h3>Quelle coupe de cheveux tendance choisir ?</h3>
                <p>Envie de changer de tête ? Un coup de ciseau sur votre crinière peut suffire. 
                    Désormais, le coiffeur-visagiste est le spécialiste des coupes morpho.
                     Cette technique consiste à étudier la forme du visage pour décider de la coupe à adopter. 
                     Pour un visage rond, il privilégiera une coupe au carré pour donner du volume sur le haut
                      et à l’arrière du crâne tandis que pour un visage ovale et fin, il optera pour des mèches
                       sur le front. </p>
            </div>
        </section>
        <Footer/>
        </>
    )
}

export default Coiffure;