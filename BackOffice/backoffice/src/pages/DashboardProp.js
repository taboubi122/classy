import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
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
export default function DashboardProp() {
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
        .get(`http://localhost:5000/api/getCentresPtop/${idProp}`)
        .then((res) => setCentres(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllAvis")
        .then((res) => setAvis(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/personnelProp/${idProp}`)
        .then((res) => setClients(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/servicesProp/${idProp}`)
        .then((res) => setDemandes(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/reservationProp/${idProp}`)
        .then((res) => setReservation(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/avisProp/${idProp}`)
        .then((res) => setVilles(res.data));
}, []);
console.log("avis: ",villes)
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
    res[0]=reservation.filter((ele) => ele.startDateResv.substring(0, 10) === d[0] && ele.refCentre===id).length 
    res[1]=reservation.filter((ele) => ele.startDateResv.substring(0, 10) === d[1] && ele.refCentre===id).length 
    res[2]=reservation.filter((ele) => ele.startDateResv.substring(0, 10) === d[2] && ele.refCentre===id).length 
    res[3]=reservation.filter((ele) => ele.startDateResv.substring(0, 10) === d[3] && ele.refCentre===id).length 
    res[4]=reservation.filter((ele) => ele.startDateResv.substring(0, 10) === d[4] && ele.refCentre===id).length 
    res[5]=reservation.filter((ele) => ele.startDateResv.substring(0, 10) === d[5] && ele.refCentre===id).length 
    res[6]=reservation.filter((ele) => ele.startDateResv.substring(0, 10) === d[6] && ele.refCentre===id).length 
   return res
  }

  function getCentreRes() {
    const x = [];
    const result=[{label:'',value:0},{label:'',value:0},{label:'',value:0},{label:'',value:0}]
    if(clients===0 || reservation.length===0){
        return result
    }
    centres.map((row, index) => {
       x.push({ label: row.nom, value: villes.filter((ele) => ele.refCentre === row.reference).length });
    });
    const chart = x.sort((a, b) => a.value - b.value);
    const chart2=chart.filter((ele)=>ele.value>0)
    if(chart2.length===0){
        return result
    }
    if(chart2.length===1){
        return [{label:'',value:0}, {label:'',value:0}, {label:'',value:0}, chart2[0]]
    }
    if(chart2.length===2){
        return [{label:'',value:0}, {label:'',value:0}, chart2[1], chart2[0]]
    }
    if(chart2.length===3){
        return [ {label:'',value:0},chart2[2], chart2[1], chart2[0]]
    }
    const res = [chart2[chart.length - 1], chart2[chart.length - 2], chart2[chart.length - 3], chart2[chart.length - 4]];
      return res;
  }


  function getTitre(){
    const t= generateWeekDates()
    const res="De "+t[0]+" a "+t[6]
    return res
  }
  function getNomService(id){
    return centres.filter((ele) => ele.reference === id);
  }

  function getReservServ() {
    const s = [];
    const result=[{
        name: '',
        type: 'area',
        fill: 'gradient',
        data: [0,0,0,0,0,0,0]}]
    if(centres.length===0 || reservation.length===0){
        return result
    }
    centres.map((row, index) => {
      const d=getData(row.reference)
      console.log(row.reference,": ",d)
      if (d.length===0)
      {const dt=0;}else{
        const sv=getNomService(row.reference)
       s.push({ name: sv[0].nom, type: 'area', fill: 'gradient', data:d });
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
    console.log(res)
      return res;
  }
  return (
    <>
      <Helmet>
        <title> CLASSY | TABLEAU DE BORD</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Tableau de bord |
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Centres" total={centres.length} icon={'simple-line-icons:calender'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Personnel" total={clients.length} color="info" icon={'ph:users-three-duotone'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Réservation" total={reservation.length} color="error" icon={'fluent:clipboard-note-20-regular'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Service" total={demandes.length} color="warning" icon={'ic:baseline-apartment'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Les Centres les plus reservé"
              subheader={getTitre()}
              chartLabels={generateWeekDates()}
              chartData={getReservServ()}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Les Centre les plus noté"
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
