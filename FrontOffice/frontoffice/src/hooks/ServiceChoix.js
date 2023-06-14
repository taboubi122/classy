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
import { VscChevronUp ,VscChevronDown } from "react-icons/vsc";

const ServiceChoix = ({ service,nomCentre }) => {
  const [expandedList, setExpandedList] = useState(
    service.map(() => false)
  );
  const Navigate = useNavigate();
  const reserv=(service)=>{
 console.log(service)
 Navigate(`/reservation/${nomCentre}/${service}`);
  }
  const formatDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
  
    if (hours > 0) {
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}min`;
      }
    } else {
      return `${minutes}min`;
    }
  };
  
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

  // Afficher les catégories dans des tableaux séparés
  const categoriesList = Object.keys(categories).map((key) => (
    <div key={key}>
          <span className="resvTitre">{categories[key].nom}</span>
          <h5 className="resvSmallTitre">{categories[key].description}</h5>

      <br/>
      <Card style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}  >
    
        <Table key={`table-${key}`}>
          <TableBody>
            {categories[key].services.map((serviceData, index) => (
              <TableRow key={serviceData.refService}>
                <TableCell scope="col" style={{ width: "25%" }}>
                  <p>{serviceData.nomService}</p>
                  {expandedList[index] && (
                    <div className="details-text">
                      {serviceData.description}
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
                    {expandedList[index]
                      ? "Moins de détails"
                      : "Plus de détails"}
                    {expandedList[index] ? " " : <span>&nbsp;</span>}
                    {expandedList[index] ? (
                      <VscChevronUp color="gray" />
                    ) : (
                      <VscChevronDown color="gray" />
                    )}
                  </span>
                </TableCell>
                <TableCell scope="col" style={{ width: "0.1%" }}>
                  <h5 className="resvSmallTitre">{formatDuration(serviceData.duree)}</h5>
                </TableCell>
                <TableCell style={{ width: "0.1%" }}>
                  <h5 className="resvSmallTitre">{serviceData.prix}Dinar</h5>
                </TableCell>
                <TableCell style={{ width: "0.1%" }}>
                  <button className="buttonCoiff" onClick={()=>reserv(serviceData.nomService)}>Choisir</button>
                </TableCell>
                <TableCell style={{ width: "0.1%" }}>
                  <p> </p>
                </TableCell>
                <TableCell style={{ width: "0.1%" }}>
                  <p> </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
   
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
