import crypto from "crypto";
import razorpay from "../config/razorpay.js";

import Payment from "../models/Payment.js";

export const createOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      planId,
      planName,
      planType,
      billingCycle,
      user,
    } = req.body;

    const options = {
      amount: amount * 100,
      currency,
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save payment record in DB
    const payment = await Payment.create({
      user,
      plan: planId,
      planName,
      planType,
      billingCycle,
      amount,
      currency,
      razorpay_order_id: order.id,
      status: "created",
    });

    res.status(200).json({ success: true, order, paymentId: payment._id });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment initiation failed" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const payment = await Payment.findOne({ razorpay_order_id });

    if (!payment)
      return res.status(404).json({ success: false, message: "Payment not found" });

    if (expectedSignature === razorpay_signature) {
      payment.status = "paid";
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      await payment.save();

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};


