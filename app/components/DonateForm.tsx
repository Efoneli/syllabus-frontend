'use client'

import React, { FormEvent } from "react";
import { DonateButtons } from "../components/DonateButton";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_PUBLISHABLE_SECRET_KEY!
);

export const DonateForm = () => {

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { amount } = Object.fromEntries(formData.entries());

    const { sessionId } = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((res) => res.json());

    const stripe = await stripePromise;

    if (!stripe || !sessionId) return;

    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DonateButtons
        name="amount"
        options={[{ value: 10 }, { value: 50 }, { value: 100 }]}
        defaultValue={100}
      />

      <button
        type="submit"
        className="mt-6 w-full bg-green-500 py-3 px-5 rounded-xl text-white hover:bg-green-400"
      >
        Donate
      </button>
    </form>
  );
};