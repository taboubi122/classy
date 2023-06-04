import { Helmet } from 'react-helmet-async';
// @mui
import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import axios from "axios";
// components
import { useParams } from "react-router-dom";
import moment from 'moment';
// sections
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary, AppConversionRates, } from '../sections/@dashboard/app';
// ----------------------------------------------------------------------
export default function DashboardCentre() {
  const theme = useTheme();
  const [centres, setCentres] = useState([]);
  const [clients, setClients] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [villes, setVilles] = useState([]);
  const [ctrVilles, setCtrVilles] = useState([]);
  const [services, setServices] = useState([]);
  const [avis, setAvis] = useState([]);
  const params = useParams();
  const idProp = params.id;

  useEffect(() => {
    axios
        .get(`http://localhost:5000/api/getReservationCentre/${idProp}`)
        .then((res) => setCentres(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllAvis")
        .then((res) => setAvis(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/personnel/${idProp}`)
        .then((res) => setClients(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/services/${idProp}`)
        .then((res) => setDemandes(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/reservation/${idProp}`)
        .then((res) => setReservation(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllServices")
        .then((res) => setVilles(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/getAllVilleC`)
        .then((res) => setCtrVilles(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/services/${idProp}`)
        .then((res) => setServices(res.data));
}, []);

  function generateWeekDates() {
    const startDate = moment().startOf('week');
    const weekDates = [];
  
    for (let i = 0; i < 7; i++) {
      const date = startDate.clone().add(i, 'days'); 
      weekDates.push(date.format('YYYY-MM-DD')); 
    }
  
    return weekDates;
  }
  function getData (id){
    const d=generateWeekDates()
    const res=[]
    res[0]=centres.filter((ele) => ele.startDateResv.substring(0, 10) === d[0] && ele.refService===id).length 
    res[1]=centres.filter((ele) => ele.startDateResv.substring(0, 10) === d[1] && ele.refService===id).length 
    res[2]=centres.filter((ele) => ele.startDateResv.substring(0, 10) === d[2] && ele.refService===id).length 
    res[3]=centres.filter((ele) => ele.startDateResv.substring(0, 10) === d[3] && ele.refService===id).length 
    res[4]=centres.filter((ele) => ele.startDateResv.substring(0, 10) === d[4] && ele.refService===id).length 
    res[5]=centres.filter((ele) => ele.startDateResv.substring(0, 10) === d[5] && ele.refService===id).length 
    res[6]=centres.filter((ele) => ele.startDateResv.substring(0, 10) === d[6] && ele.refService===id).length 
   return res
  }
console.log(clients)
console.log(centres)
  function getCentreRes() {
    const x = [];
    const result=[{label:'',value:0},{label:'',value:0},{label:'',value:0},{label:'',value:0}]
    if(clients===0 || centres.length===0){
        return result
    }
    clients.map((row, index) => {
       x.push({ label: row.nom, value: centres.filter((ele) => ele.CINPersonnel === row.CIN).length });
    });
    const chart = x.sort((a, b) => a.value - b.value);
    if(chart.length===0){
        return result
    }
    if(chart.length===1){
        return [{label:'',value:0}, {label:'',value:0}, {label:'',value:0}, chart[0]]
    }
    if(chart.length===2){
        return [{label:'',value:0}, {label:'',value:0}, chart[1], chart[0]]
    }
    if(chart.length===3){
        return [ {label:'',value:0},chart[2], chart[1], chart[0]]
    }
    const res = [chart[chart.length - 1], chart[chart.length - 2], chart[chart.length - 3], chart[chart.length - 4]];
      return res;
  }


  function getTitre(){
    const t= generateWeekDates()
    const res="De "+t[0]+" a "+t[6]
    return res
  }
  function getNomService(id){
    return villes.filter((ele) => ele.reference === id);
  }

  function getReservServ() {
    const s = [];
    const result=[{
        name: '',
        type: 'area',
        fill: 'gradient',
        data: [0,0,0,0,0,0,0]}]
    if(services.length===0){
        return result
    }
    console.log(services)
    services.map((row, index) => {
      const d=getData(row.reference)
      if (d.length===0)
      {const dt=0;}else{
        const sv=getNomService(row.refService)
       s.push({ name: sv[0].nomService, type: 'area', fill: 'gradient', data:getData(row.refService) });
      }
    });
    
    var j=0
    var res=[]
    for(var i=0;i<s.length;i++){
      var test=false
      var f=false;
      for(var e=0;e<7;e++){
        if(s[i].data[e]===0){
          test=false
        }else{f=true}
      }
      if(f===true){
        res[j]=s[i]
        j++
      }
    }
      return res;
  }
  return (
    <>
      <Helmet>
        <title> CLASSY | TABLEAU DE BORD</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Tableau de bord
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Réservation" total={centres.length} icon={'simple-line-icons:calender'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Personnel" total={clients.length} color="info" icon={'ph:users-three-duotone'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Service" total={demandes.length} color="warning" icon={'ic:baseline-apartment'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Note" total={reservation.length} color="error" icon={'fluent:clipboard-note-20-regular'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Les Services Reservé"
              subheader={getTitre()}
              chartLabels={generateWeekDates()}
              chartData={getReservServ()}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Les personnels les plus reservé"
              chartData={getCentreRes()}
              chartColors={[
                theme.palette.error.main,
                theme.palette.warning.main,
                theme.palette.info.main,
                theme.palette.primary.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
