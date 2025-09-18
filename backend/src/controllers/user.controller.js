import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

export const signupHandler = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    // Generate JWT for this user with type 'user'
    generateToken(newUser._id, "user", res);

    return res.status(201).json({ 
      message: "User created successfully", 
      user: newUser
    });

  } catch (error) {
    console.log("Error in signupHandler:", error);   
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT for this user with type 'user'
    generateToken(user._id, "user", res);

    return res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (error) {
    console.log("Error in loginHandler:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const logoutHandler = async (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logoutHandler:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateProfileHandler = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profilePics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log("Error in updateProfileHandler:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const checkAuthHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.log("Error in checkAuthHandler:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
