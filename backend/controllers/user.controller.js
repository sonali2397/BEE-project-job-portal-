import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        console.log("Request Headers:", req.headers);
        console.log("Request Params:", req.params);
        console.log("Request Query:", req.query);

        const { fullname, email, phoneNumber, password, role } = req.body;

        // Validate email
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                message: "Email is required and must be a string.",
                success: false
            });
        }

        // Validate password
        if (!password) {
            return res.status(400).json({
                message: "Password is required.",
                success: false
            });
        }

        // Convert email to lowercase
       const emailLowerCase = email.toLowerCase();

        // Check if user already exists
        let user = await User.findOne({ email: emailLowerCase });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email: emailLowerCase, // Save email in lowercase
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error in register:", error.message, error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required.",
                success: false
            });
        }

        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check role
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role.",
                success: false
            });
        }
        //for id confirmation use token

        const tokenData = {
            userId: user._id
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user: userData,
            success: true
        });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // Uncomment and implement these if needed
        // const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        // const logo = cloudResponse.secure_url;

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Update fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email.toLowerCase(); // Ensure email is in lowercase
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        await user.save();

        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
