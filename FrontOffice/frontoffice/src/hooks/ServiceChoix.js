import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Card,
} from "@material-ui/core";

const ServiceChoix = ({ service,nomCentre }) => {
  const [expandedList, setExpandedList] = useState([]);
  const Navigate = useNavigate();
  const reserv=(service)=>{
 console.log(service)
 Navigate(`/reservation/${nomCentre}/${service}`);
  }
  // Stocker les catégories séparément des services
  const categories = {};
  service.forEach((serviceData) => {
    if (!categories[serviceData.refCateg]) {
      categories[serviceData.refCateg] = {
        nom: serviceData.nomCateg,
        description: serviceData.descriptionCateg,
        services: [],
      };
    }
    categories[serviceData.refCateg].services.push(serviceData);
  });
  // Duree
	function currentTime(d) {
		let duree = "";
		const [hours, minutes] = d.split(":");
		const date = new Date();
		date.setHours(parseInt(hours, 10));
		date.setMinutes(parseInt(minutes, 10));
		if (hours === "00") {
			duree = `${minutes} min`;
		} else if (minutes === "00") {
			duree = `${hours} h`;
		} else {
			duree = `${hours} h ${minutes} min`;
		}
		return duree;
	}

  // Afficher les catégories dans des tableaux séparés
  const categoriesList = Object.keys(categories).map((key) => (
    <div key={key}>
      <h2 className="resvTitre2">{categories[key].nom}</h2>
      <p>{categories[key].description}</p>
      <br/>
      <Card style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} > 
    
        <table style={{ margin: '0 auto', borderRadius: '10px'}} key={`table-${key}`} >
          <TableBody>
            {categories[key].services.map((serviceData, index) => (
              <TableRow key={serviceData.refService}>
                <TableCell scope="col" style={{ width: "60%" }}>
                  <h4>{serviceData.nomService}</h4>
                  {expandedList[index] ? (
                    <div className="details-text">
                      {serviceData.description}
                    </div>
                  ) : (
                    <div className="details-text">
                      {serviceData.description.length > 50
                        ? `${serviceData.description.slice(0, 50)}...`
                        : serviceData.description}
                    </div>
                  )}
                  <span
                    className="PlusDetails"
                    onClick={() => {
                      const newList = [...expandedList];
                      newList[index] = !newList[index];
                      setExpandedList(newList);
                    }}
                  >
                    {expandedList[index] && serviceData.description.length>50? "Moins de détails" : !expandedList[index] && serviceData.description.length>50 ?"Plus de détails":""}
                  </span>
                </TableCell>
                <TableCell scope="col">
                  <h5 className="resvSmallTitre">{currentTime(serviceData.duree)}</h5>
                </TableCell>
                <TableCell>
                  <h5 className="resvSmallTitre">{serviceData.prix} Dinar</h5>
                </TableCell>
                <TableCell style={{ width: "0.1%" }}>
                  <button className="buttonCoiff" onClick={()=>reserv(serviceData.nomService)}>Choisir</button>
                </TableCell>
                <TableCell style={{ width: "0.1%" }}>
                  <p  style={{ color:"white"}}> classy </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
   
      </Card>
    </div>
  ));

  // Afficher le tableau complet avec les catégories et les services
  return <div className="hd">{categoriesList}</div>;
};


ServiceChoix.propTypes = {
    service: PropTypes.arrayOf(
      PropTypes.shape({
        refCateg: PropTypes.string.isRequired,
        nomCateg: PropTypes.string.isRequired,
        descriptionCateg: PropTypes.string.isRequired,
        refService: PropTypes.string.isRequired,
        nomService: PropTypes.string.isRequired,
        duree: PropTypes.string.isRequired,
        prix: PropTypes.number.isRequired,
      })
    ).isRequired
  };
  

export default ServiceChoix;
