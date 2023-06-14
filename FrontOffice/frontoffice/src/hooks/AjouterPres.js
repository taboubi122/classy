import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Buffer } from 'buffer';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Card,
  Typography,
  Select, MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,Radio,RadioGroup
} from "@material-ui/core";
import { VscChevronUp, VscChevronDown } from "react-icons/vsc";
import { BsStars } from "react-icons/bs";
import { MdOutlineAccessTime } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";

const AjouterPres = ({ service, nomCentre, nomService,confirmer,onAjout }) => {
  const [expandedList, setExpandedList] = useState(service.map(() => false));
  const [horairesDisponibles, setHorairesDisponibles] = useState([]);
  const [chooseClick, setChooseClick] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [Perso, setPerso] = useState([]);
  const [selectPerso, setSelectPerso] = useState(0);
  const [services, setServices] = useState([]);
  const [selectFocused, setSelectFocused] = useState(false);
  const Navigate = useNavigate();

  const reserv = (service) => {
    console.log(service);
    Navigate(`/reservation/${nomCentre}/${service}`);
  }; 
  const choixPerso = async (serv) => {
    try {
      const res = await axios.get("http://localhost:5000/api/getAllpersonnelResv", {
        params: {
          nomService: serv.nomService,
          nomCentre: nomCentre,
        }
      });
      console.log(res.data);
      setPerso(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const formatDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);

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

const afficherDonneesChoisies = (personnel) => {
  console.log(selectPerso)
  onAjout(selectedServices[0].nomService,selectedServices[0].duree,selectedServices[0].prix,personnel)
};

const handlePersoChanges = (event) => {
  setSelectPerso(event.target.value);
  console.log(event.target.value);
  setHorairesDisponibles([]);
  afficherDonneesChoisies(event.target.value);
};

  const AfficherPres = (serviceData) => {
    setChooseClick(true);
    setSelectedServices([serviceData]);
    console.log(serviceData);
    choixPerso(serviceData);
  };

  const categories = {};
  service.forEach((serviceData) => {
    if (!categories[serviceData.refCateg]) {
      categories[serviceData.refCateg] = {
        nom: serviceData.nomCateg,
        description: serviceData.descriptionCateg,
        services: [],
        disabled: false,
      };
    }
    categories[serviceData.refCateg].services.push(serviceData);

    if (serviceData.nomService === nomService) {
      categories[serviceData.refCateg].disabled = true;
    }
  });
  
  const menuItemStyles = {
    fontSize: 12, // Taille de la police des éléments
    padding: '8px 12px', // Espacement intérieur des éléments
  };
  const selectStyles = {
    minWidth: 100, // Largeur minimale du Select
    marginTop: 10, // Marge supérieure
    borderRadius: 4, // Bordure arrondie
    border: '1px solid #ccc', // Bordure grise
    padding: '4px 8px', // Espacement intérieur réduit
    lineHeight: '1.5', // Hauteur de ligne réduite
    backgroundColor: '#fff', // Couleur de fond blanche
    transition: 'border-color 0.2s ease', // Transition pour l'animation
  };
  
  const selectFocusedStyles = {
    borderColor: '#5c9be1', // Couleur de bordure lorsqu'il est cliqué
    boxShadow: '0 0 0 2px rgba(92, 155, 225, 0.2)', // Ombre lorsqu'il est cliqué
  };
  
  // Afficher les catégories dans des tableaux séparés
  const categoriesList = Object.keys(categories).map((key) => {
    const category = categories[key];

    if (category.disabled) {
      return null; // Ne pas afficher la catégorie et les services s'il est désactivé
    }

    return (
      <div key={key}>
        <span className="resvTitre">{category.nom}</span>

        <Card
          style={{
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
          className="custom-card"
        >
          <Table key={`table-${key}`}>
            <TableBody>
              {category.services.map((serviceData, index) => (
                <TableRow key={serviceData.refService}>
                  <TableCell scope="col" style={{ width: "25%" }}>
                    <p>{serviceData.nomService}</p>
                    {expandedList[index] && (
                      <div className="details-text">{serviceData.description}</div>
                    )}   <span
                                          className="PlusDetails"
                                          onClick={() => {
                                            const newList = [...expandedList];
                                            newList[index] = !newList[index];
                                            setExpandedList(newList);
                                          }}
                                        >
                                          {expandedList[index] ? "Moins de détails" : "Plus de détails"}
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
                                    <TableCell scope="col" style={{ width: "0.1%" }}></TableCell>
                                    <TableCell style={{ width: "0.1%" }}>
                                      <h5 className="resvSmallTitre">{serviceData.prix} Dinar</h5>
                                    </TableCell>
                                    
                                    <TableCell style={{ width: "0.1%" }}>
                                      {serviceData.nomService === nomService ? (
                                        <button className="buttonCoiff" disabled>
                                          Choisir
                                        </button>
                                      ) : (
                                        <button className="buttonCoiff" onClick={() => AfficherPres(serviceData)}>
                                          Choisir
                                        </button>
                                      )}
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
                      );
                    });
                  
                    return (
                      <div className="hd">
                        {!confirmer ? (
                          chooseClick ? (
                            <Card>
                              <br />
                              <div className="infosResv">
                                {selectedServices.map((serviceData) => (
                                  <div key={serviceData.refService}>
                                    <Typography variant="body1">
                                      <BsStars /> {serviceData.nomService}
                                    </Typography>
                                    <Typography variant="body1">
                                      <MdOutlineAccessTime /> {formatDuration(serviceData.duree)}{" "}
                                      <span />
                                      <FaMoneyBillWave /> {serviceData.prix}D
                                    </Typography>
                                  </div>
                                ))}
                                Avec qui ? <span><span></span></span>
                              
<Select
value={selectPerso}
onChange={handlePersoChanges}
style={selectFocused ? { ...selectStyles, ...selectFocusedStyles } : selectStyles}
onFocus={() => setSelectFocused(true)}
onBlur={() => setSelectFocused(false)}
>
 
  <MenuItem value={0} style={menuItemStyles}>Sans préférence</MenuItem>
  {Perso.map((donne) => (
    <MenuItem key={donne.CIN} value={donne.CIN} style={menuItemStyles}>
      <img
        className="resvPhoto"
        alt={1}
        src={`${Buffer.from(donne.photo.data)}`}
      />
      {donne.persoName}
    </MenuItem>
  ))}
</Select>


                              </div>
                              <br />
                            </Card>
                          ) : (
                            categoriesList
                          )
                        ) : (
                          <Card>
                            <br />
                            <div className="infosResv">
                              {selectedServices.map((donne) => (
                                <div key={donne.reference}>
                                  <Typography variant="body1">
                                    <BsStars /> {donne.nomService}
                                  </Typography>
                                  <Typography variant="body1">
                                    <MdOutlineAccessTime /> {formatDuration(donne.duree)}{" "}
                                    <span /> <FaMoneyBillWave /> {donne.prix}D
                                  </Typography>
                                </div>
                              ))}
                            </div>
                            <br />
                          </Card>
                        )}<div><p/></div>
                      </div>
                    );
                    
                  };
                  
                  AjouterPres.propTypes = {
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
                    ).isRequired,
                    nomCentre: PropTypes.string.isRequired,
                    nomService: PropTypes.string.isRequired,
                    onChooseClick: PropTypes.func,
                  };
                  
                  export default AjouterPres;
                  
