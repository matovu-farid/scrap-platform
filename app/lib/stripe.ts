// Set your secret key. Remember to switch to your live secret key in production.

import { env } from "@/env";
import Stripe from "stripe";
import { getStripeCustomerIdFromApikey } from "./apikey";

// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function createCustomer(email: string, userId: string, name?: string) {
  const customer = await stripe.customers.create({
    name: name,
    email: email,
    metadata: {
      userId: userId,
    },
  });
  return customer;
}

async function createSubscription(customerId: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: env.STRIPE_PRICE_ID }],
  });
  return subscription;
}

export async function createSubscribedUser(
  email: string,
  userId: string,
  name?: string
) {
  const customer = await createCustomer(email, userId, name);
  const subscription = await createSubscription(customer.id);
  return { customer, subscription };
}
export async function createMetreEvent(apiKey: string, value: number) {
  const customerId = await getStripeCustomerIdFromApikey(apiKey);

  await stripe.billing.meterEvents.create({
    event_name: "scrap_ai_tokens",
    payload: {
      stripe_customer_id: customerId,
      value: value.toString(),
    },
  });
}
