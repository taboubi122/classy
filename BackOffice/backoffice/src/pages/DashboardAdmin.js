import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import axios from "axios";
// components
import Iconify from '../components/iconify';
import moment from 'moment';
// sections
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary, AppConversionRates, } from '../sections/@dashboard/app';
// ----------------------------------------------------------------------
export default function DashboardAdmin() {
  const theme = useTheme();
  const [centres, setCentres] = useState([]);
  const [clients, setClients] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [villes, setVilles] = useState([]);
  const [ctrVilles, setCtrVilles] = useState([]);
  const [services, setServices] = useState([]);
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    axios
        .get("http://localhost:5000/api/getCentres")
        .then((res) => setCentres(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllAvis")
        .then((res) => setAvis(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllClients")
        .then((res) => setClients(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllDemandes")
        .then((res) => setDemandes(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllReservation")
        .then((res) => setReservation(res.data));
}, []);
useEffect(() => {
    axios
        .get("http://localhost:5000/api/getAllVille")
        .then((res) => setVilles(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/getAllVilleC`)
        .then((res) => setCtrVilles(res.data));
}, []);
useEffect(() => {
    axios
        .get(`http://localhost:5000/api/getAllServices`)
        .then((res) => setServices(res.data));
}, []);
function getVilleC(){
            const v=[]
            if(villes.length===0 || ctrVilles===0){
                return [{label:'',value:0}]
            }
            villes.map((row,index)=>{
                v.push({label: row.nom, value: centres.filter((ele) => ele.refVille === row.code).length});
            })
              const chartData =v.sort((a, b) => a.value - b.value);
                return chartData
              
              
}

function getCentreRes() {
    const x = [];
    const result=[{label:'',value:0},{label:'',value:0},{label:'',value:0},{label:'',value:0}]
    if(centres===0 || reservation.length===0){
        return result
    }
    centres.map((row, index) => {
       x.push({ label: row.nom, value: reservation.filter((ele) => ele.refCentre === row.reference).length });
    });
    const chart = x.sort((a, b) => a.value - b.value);
    const res = [chart[chart.length - 1], chart[chart.length - 2], chart[chart.length - 3], chart[chart.length - 4]];
      return res;
  }
  const a=getCentreRes()
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
    res[0]=reservation.filter((ele) => ele.dateResv.substring(0, 10) === d[0] && ele.refService===id).length 
    res[1]=reservation.filter((ele) => ele.dateResv.substring(0, 10) === d[1] && ele.refService===id).length 
    res[2]=reservation.filter((ele) => ele.dateResv.substring(0, 10) === d[2] && ele.refService===id).length 
    res[3]=reservation.filter((ele) => ele.dateResv.substring(0, 10) === d[3] && ele.refService===id).length 
    res[4]=reservation.filter((ele) => ele.dateResv.substring(0, 10) === d[4] && ele.refService===id).length 
    res[5]=reservation.filter((ele) => ele.dateResv.substring(0, 10) === d[5] && ele.refService===id).length 
    res[6]=reservation.filter((ele) => ele.dateResv.substring(0, 10) === d[6] && ele.refService===id).length 
   return res
  }

  function getTitre(){
    const t= generateWeekDates()
    const res="De "+t[0]+" a "+t[6]
    return res
  }

  function getReservServ() {
    const s = [];
    const result=[{
        name: '',
        type: 'area',
        fill: 'gradient',
        data: [0,0,0,0,0,0,0]}]
    if(services.length===0 || reservation.length===0){
        return result
    }
    services.map((row, index) => {
      const d=getData(row.reference)
       s.push({ name: row.nomService, type: 'area', fill: 'gradient', data:getData(row.reference) });
    });
    const x=[0,0,0,0,0,0,0]
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

  function getAvisCtr() {
    const x = [];
    const result=[{label:'',value:0},{label:'',value:0},{label:'',value:0},{label:'',value:0}]
    if(avis.length===0 || centres.length===0){
        return result
    }
    centres.map((row, index) => {
       x.push({ label: row.nom, value: avis.filter((ele) => ele.refCentre === row.reference && ele.note===5).length });
    });
    const chart = x.sort((a, b) => a.value - b.value);
    const res = [chart[chart.length - 1], chart[chart.length - 2], chart[chart.length - 3], chart[chart.length - 4]];
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
            <AppWidgetSummary title="Centres" total={centres.length} icon={'ic:baseline-apartment'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Clients" total={clients.length} color="info" icon={'ph:users-three-duotone'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Demandes" total={demandes.length} color="warning" icon={'fluent:clipboard-note-20-regular'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Réservation" total={reservation.length} color="error" icon={'simple-line-icons:calender'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Les Services"
              subheader={getTitre()}
              chartLabels={generateWeekDates()}
              chartData={getReservServ()}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Les 4 centres les plus réservés"
              chartData={getCentreRes()}
              chartColors={[
                theme.palette.error.main,
                theme.palette.warning.main,
                theme.palette.info.main,
                theme.palette.primary.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
          <AppConversionRates
              title="Nombre des centres par ville"
              subheader="Totale"
              chartData={getVilleC()}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
          <AppCurrentVisits
              title="Les 4 centres les plus notés"
              chartData={getAvisCtr()}
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
