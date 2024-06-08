

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { amount } = req.body;

    if (!amount) {
      throw new Error("amount is required");
    }

    const session = await stripe.checkout.sessions.create({
      submit_type: "donate",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            unit_amount: amount * 100,
            currency: "usd",
            product_data: {
              name: "Donation name",
              description: "Donation description",
            },
          },
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}`,
      cancel_url: `${req.headers.origin}`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err instanceof Error ? err.message : "Internal server error",
    });
  }
}