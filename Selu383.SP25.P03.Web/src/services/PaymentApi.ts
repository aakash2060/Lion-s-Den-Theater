import { ServiceItem } from '../Data/PaymentInterfaces';

export const getStripePublishableKey = async (): Promise<string> => {
    const response = await fetch('/api/payments/public-key');
    if (!response.ok) {
        throw new Error('Failed to get Stripe public key');
      }
      const data = await response.json();
      return data.publicKey;
};

export const createCheckoutSession = async (services: ServiceItem[]) : Promise<string> => {
    const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ services }),
    });

    if (!response.ok) {
        throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data.sessionId;
}
