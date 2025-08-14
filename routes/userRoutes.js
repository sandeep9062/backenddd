import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Enter full details" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already Exist" });
    } else {
      user = new User({ name, email, password });
      await user.save();

      const payLoad = { user: { id: user._id, role: user.role } };

      jwt.sign(
        payLoad,
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
        (error, token) => {
          if (error) throw error;

          res.status(201).json({
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },

            token,
          });
        }
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare password
    const isMatchPassword = await user.matchPassword(password);
    if (!isMatchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Prepare JWT payload
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    // Sign JWT and send response with token + user info
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.error("JWT Signing Error:", err);
          return res.status(500).json({ message: "Token generation failed" });
        }

        return res.status(200).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
