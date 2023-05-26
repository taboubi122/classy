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
            <h1>Paymenet</h1>
            <Elements stripe={stripeTestPromise}>
                <Checkoutform />
            </Elements>
       </Container>
    </>
    );
};

export default stripe;