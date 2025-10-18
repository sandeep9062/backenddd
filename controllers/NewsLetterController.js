import Subscription from "../models/NewsLetter.js";
import sendEmail from "../utils/sendEmail.js";

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("emailll", email);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSubscription = await Subscription.findOne({ email });

    if (existingSubscription) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    // Send notification email
    try {
      await sendEmail({
        to: process.env.OWNER_RECEIVER_EMAIL,
        subject: "New Newsletter Subscription",
        html: `A new user has subscribed with the email: ${email}`,
      });
      console.log("Notification email sent successfully.");
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Decide if you want to fail the whole request if email fails
      // For now, we'll just log the error and not fail the subscription
    }

    res.status(201).json({ success: true, message: "Subscription successful" });
  } catch (error) {
    console.error("Error in subscription:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message, // Send back the actual error message
    });
  }
};

export default subscribe;
