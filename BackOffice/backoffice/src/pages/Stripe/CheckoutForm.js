import React from 'react';
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { element } from 'prop-types';
import { Container } from '@mui/material';

export const Checkoutform = () =>{
    const stripe = useStripe();
    const elements = useElements();

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
                const response = await axios.post("http://localhost:5000/stripe/charge", {
                    amount: 5000,
                    id: id,
                });
                if (response.data.success) {
                    console.log("Paymenet réussi");
                }
            } catch (error) {
                console.log("Erreur! ", error);
            }
        } else {
            console.log(error.message);
        }
    }
    return( 
        <form onSubmit={handlesubmit} style={{ maxwidth: 400}}>
            <Container>
            <CardElement
                options={{
                    hidePostalcode: true
                }}
                />
            <button> Payer</button>
            </Container>
        </form>
    );
};