import React,{useState} from "react";
import {VscChevronUp,VscChevronDown} from "react-icons/vsc";

const quest=()=>{
    const [visible,setVisiblity]=useState(true);
    const Icon= visible ? (<VscChevronDown 
      style={{ marginBottom: "5px" }}
        onClick={()=>setVisiblity(visiblity=>!visiblity)}
        /> ):
        (<VscChevronUp
        onClick={()=>setVisiblity(visiblity=>!visiblity)}
        /> );
  const text=visible ? " ": "- Classy est la plateforme de prise de rendez-vous beauté qui va changer votre façon de vous organiser. L’idée, vous éviter de perdre un temps précieux en vous permettant de prendre rendez-vous dans l’un de nos établissements de beauté partenaire, en quelques clics et 24H/24H! - Terminé l’attente au téléphone ou les déplacements, Classy vous offre la possibilité de réserver un rendez-vous chez un coiffeur, un institut de beauté, un barbier ou même un spa sans avoir à sortir de chez vous. - Il n’existe pas de service plus simple: une fois votre rendez-vous choisi, vous recevez un SMS de rappel dans lequel se trouvent la date et l’heure prévues, et c’est tout ! Bien sûr, vous avez la possibilité de modifier ou d’annuler votre rendez-vous de la même manière. - Le petit plus Classy, c`est sans aucun doute nos partenaires, qui sont sélectionnés selon des critères particuliers. Vous trouverez sur notre plateforme des établissements de qualité, classés par villes, pour vous assurer un moment privilégié autour de vous, en quelques clics seulement ! - Notre initiative est tout aussi intéressante pour les salons. Grâce au planning Classy pour les professionnels de la beauté, tous les rendez-vous clients sont notés.À chaque fois qu’un nouveau rendez-vous est pris sur la plateforme, il apparaît automatiquement sur la tablette ou l’ordinateur de l’établissement ! rejoignez vous aussi notre communauté !";
  const text2=visible ? " ":"- Vous connaissez le nom de votre établissement de beauté:- Dans le moteur de recherche « Nom du salon, prestation », inscrivez les premières lettres du nom de l’établissement- Cliquez sur le l’établissement, choisissez la prestation puis l’horaire qui vous convient.- Renseignez vos coordonnées téléphoniques et adresse e-mail .- Enregistrez le code de vérification à 3 chiffres que vous aurez reçu par SMS.- Continuez la prise de rendez-vous en indiquant vos coordonnées personnelles- Un courriel et un SMS de confirmation de rendez-vous vous seront alors envoyés.- Vous recherchez un établissement de beauté :- Dans le moteur de rechercher « Nom du salon, prestation », inscrivez les premières lettres de la prestation (ex: coupe homme) ou de la spécialité (ex: institut de beauté)- Cliquez sur l’établissement puis l’horaire qui vous convient.- Renseignez vos coordonnées téléphoniques et adresse e-mail .- Enregistrez le code de vérification à 3 chiffres que vous aurez reçu par SMS.- Continuez la prise de rendez-vous en indiquant vos coordonnées personnelles.- Un SMS de confirmation de prise de rendez-vous vous seront alors envoyés.";
  const text3=visible ? " ": "";
  const text4=visible ? " ": "";
  const text5=visible ? " ": "";

  return [text,text2,text3,text4,text5,Icon];

};
export default quest;