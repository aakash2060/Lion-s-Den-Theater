import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession, getStripePublishableKey } from '../services/PaymentApi';
import { ServiceItem } from '../Data/PaymentInterfaces';

interface LocationState {
    totalPrice: number;
    selectedSeats: string[];
    foodCart: {
        [key: string]: {
            foodItem: { name: string; price: number };
            quantity: number;
        };
    };
    movieTitle: string;
    showtime: string;
}

const Payment: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    useEffect(() => {
        const redirectToCheckout = async () => {
            try {
                const publishableKey = await getStripePublishableKey();
                const stripe = await loadStripe(publishableKey);

                if (!stripe) {
                    throw new Error('Stripe failed to load');
                }

                const services: ServiceItem[] = Object.values(state.foodCart).map((item) => ({
                    name: item.foodItem.name,
                    price: item.foodItem.price * item.quantity,
                }));

                const sessionId = await createCheckoutSession(services);

                // Store ticket info in localStorage before redirecting to Stripe
                localStorage.setItem(
                    'ticketInfo',
                    JSON.stringify({
                        movieTitle: state.movieTitle,
                        showtime: state.showtime,
                        seats: state.selectedSeats,
                        price: state.totalPrice,
                    })
                );

                const result = await stripe.redirectToCheckout({ sessionId });

                if (result.error) {
                    console.error('Stripe error:', result.error.message);
                    alert('There was an error with the payment. Please try again.');
                } else {
                    navigate("/thankyou");
                }
            } catch (error) {
                console.error('Payment error:', error);
                alert('Failed to redirect to payment. Please try again.');
            }
        };

        if (state) {
            redirectToCheckout();
        }
    }, [state, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <h2 className="text-2xl font-semibold">Redirecting to secure payment...</h2>
        </div>
    );
};

export default Payment;
