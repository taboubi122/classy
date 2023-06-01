import { Helmet } from 'react-helmet-async';
import { MDBBtn } from 'mdb-react-ui-kit';
import React from 'react';
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import {
    Container, 
    Grid,
    Card,
    Stack
  } from '@mui/material';
import { white } from 'material-ui/styles/colors';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";


export const Checkoutform = () =>{

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const params = useParams();
    const idProp = params.id;
    const options = {
        locale: 'fr',
      };
    const handlesubmit = async (event) => {
        event.preventDefault();
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });
        if (!error) {
            console.log("Token généré: ", paymentMethod);
            try {
                const { id } = paymentMethod;
                const response = await axios.post(`http://localhost:5000/stripe/charge/${idProp}`, {
                    amount: 5000,
                    id: id,
                });
                if (response.data.success) {
                    const reference = response.data.reference; // Récupérer la référence de paiement
                    console.log("Paymenet réussi, Référence: ", reference);

                    console.log("Paymenet réussi");
                    navigate(`/dashboardProp/${idProp}/add/${reference}`);
                }
            } catch (error) {
                console.log("Erreur! ", error);
            }
        } else {
            console.log(error.message);
        }
    }
    return( 
        <>
        <Helmet>
        <title> CLASSY | PAYER</title>
        </Helmet>
        <Stack spacing={3}>
            <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={12}>

                        <Card>
                        <Container>
                            <br/>
                            <div style={{fontFamily:"Times New Roman",fontSize:20}}>
                        Nombre : 1 espace
                        </div><br/>
                        <div style={{fontFamily:"Times New Roman",fontSize:20}}>
                        Totale: 50 EUR
                        </div><br/>                        
                        <div>
                        <form onSubmit={handlesubmit} style={{ maxwidth: 400}}>
                        <div style={{fontFamily:"Times New Roman",fontSize:20}}>
                        Enter votre carte 
                        
                        </div><br/>
                        <CardElement options={{
                hidePostalCode:false
            }}/>
           <br/><br/><br/><br/>
            <MDBBtn rounded className=' fc color' size='lg'> Payer</MDBBtn>
            <p style={{color:white}}>classy</p>
        </form>
                        </div>
                        </Container>
                        </Card>
                    </Grid>
            </Grid>
        </Stack>
        </>
    );
};
