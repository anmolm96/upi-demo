// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Deta } from "deta";
import { UPIForm } from "../../types";

type Data = {
  message: string;
};

const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base("upi-db");

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const body = JSON.parse(req.body) as UPIForm;

  const rzpPayBody = {
    account_number: process.env.RAZORPAY_ACCOUNT_NUMBER ?? "",
    amount: 100,
    mode: "UPI",
    currency: "INR",
    purpose: "payout",
    fund_account: {
      account_type: "vpa",
      vpa: {
        address: body.vpa,
      },
      contact: {
        name: body.name,
      },
    },
  };

  const auth = Buffer.from(
    `${process.env.RAZORPAY_API_KEY}:${process.env.RAZORPAY_API_SECRET}`
  ).toString("base64");

  const user = await db.get(body.vpa);
  if (user) {
    res.status(400).json({ message: "Error" });
  } else {
    const response = await fetch("https://api.razorpay.com/v1/payouts", {
      method: "POST",
      body: JSON.stringify(rzpPayBody),
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      res.status(400).json({ message: "Error" });
    } else {
      await response.json();
      await db.put({ name: body.name, vpa: body.vpa }, body.vpa);
      res.status(200).json({ message: "Success" });
    }
  }
};
