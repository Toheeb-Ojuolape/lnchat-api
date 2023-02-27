import { Request, Response } from "express";
import nodeManager from "./../services/node-manager";
import db from "./../services/posts-db";
import createLnRpc from "@radar/lnrpc";
var nodemailer = require("nodemailer");

const sendNotification = async (payload: any) => {
  var mail = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "tips.tell.africa@gmail.com",
      pass: "cllohurtneydjpfj",
    },
  });

  var mailOptions = {
    from: "LN ⚡ CHAT <tips.tell.africa@gmail.com>",
    to: payload.email,
    replyTo: "hello@lnchat.com",
    subject: "Payment Received on LN ⚡ CHAT",
    html: `<h2>Dear ${payload.email}</h2> <p>You have successfully received a payment on LN⚡CHAT. </p><p>You can view the transaction by logging in to your account and navigating to transactions page with the link below: http://localhost:8080/login</p>`,
  };

  mail.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      return;
    } else {
      return;
    }
  });
};

module.exports.connect_post = async (req: Request, res: Response) => {
  const { host, cert, macaroon } = req.body;
  const { token, pubkey } = await nodeManager.connect(host, cert, macaroon);

  console.log(token);
  res.send({ token, pubkey });
};

module.exports.balance_post = async (req: Request, res: Response) => {
  try {
    const { host, cert, macaroon } = req.body;
    const lnRpcClient = await createLnRpc({
      server: host,
      cert: Buffer.from(cert, "hex").toString("utf-8"), // utf8 encoded certificate
      macaroon,
    });

    const { balance } = await lnRpcClient.channelBalance();
    res.status(200).json({ balance: balance });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Error encountered while fetching balance" });
  }
};

module.exports.generateInvoice_post = async (req: Request, res: Response) => {
  try {
    const { host, cert, macaroon } = req.body;
    const lnRpcClient = await createLnRpc({
      server: host,
      cert: Buffer.from(cert, "hex").toString("utf-8"), // utf8 encoded certificate
      macaroon,
    });

    const { paymentRequest } = await lnRpcClient.addInvoice({
      value: req.body.amount.toString(),
    });
    res.status(200).json(paymentRequest);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports.makePayment_post = async (req: Request, res: Response) => {
  try {
    const { host, cert, macaroon } = req.body;
    const lnRpcClient = await createLnRpc({
      server: host,
      cert: Buffer.from(cert, "hex").toString("utf-8"), // utf8 encoded certificate
      macaroon,
    });

    const invoicePayment = await lnRpcClient.sendPaymentSync({
      paymentRequest: req.body.invoice,
    });
    if (invoicePayment.paymentError == "invoice is already paid") {
      const errorMessage = { message: "Invoice is already paid" };
      res.status(401).json({ data: errorMessage });
      return;
    }

    //send notification after successful payment
    await sendNotification(req.body);
    res.status(200).json(invoicePayment);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
};

//get transactions
module.exports.fetchtransactions_post = async (req: Request, res: Response) => {
  try {
    const { host, cert, macaroon } = req.body;
    const lnRpcClient = await createLnRpc({
      server: host,
      cert: Buffer.from(cert, "hex").toString("utf-8"), // utf8 encoded certificate
      macaroon,
    });

    const { transactions } = await lnRpcClient.getTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
