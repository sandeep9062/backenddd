import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const updateUserRole = async (email, newRole) => {
  await connectDB();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found.");
      return;
    }

    user.role = newRole;
    await user.save();
    console.log(`User role updated to "${newRole}" for ${email}`);
  } catch (error) {
    console.error("Error updating user role:", error);
  } finally {
    mongoose.connection.close();
  }
};

const email = process.argv[2];
const newRole = process.argv[3];

if (!email || !newRole) {
  console.log("Please provide an email and a new role.");
  console.log("Usage: node updateUserRole.js <email> <role>");
} else {
  updateUserRole(email, newRole);
}
