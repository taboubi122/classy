import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements }from '@stripe/react-stripe-js';
import { Checkoutform } from './CheckoutForm';
import { Container } from '@mui/material';

const PUBLIC_KEY = "pk_test_51NBtyfB6W7bvICtWeoY0Zl4jCZaBPSDf7pKbgBJ8zMHQyUkd27t8Zbm41E1zcarAM5H6JxAUZBcJoiZrOUtkwwpE00NvkOIeoX";
const stripeTestPromise = loadStripe(PUBLIC_KEY);
const stripe = ()=> {
    return(
        <>        
        <Container>
            <br/><br/><br/>
            <h2>Pour ouvrir une nouvelle espace pour votre centre, il faut payer l'espace du centre.</h2> <br/>
            <Elements  options={{ locale: 'fr' }} stripe={stripeTestPromise}>
                <Checkoutform />
            </Elements>
       </Container>
    </>
    );
};

export default stripe;