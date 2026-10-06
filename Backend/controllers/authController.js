import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: "User registered successfully,",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required."
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid email or password." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: "User registered successfully,",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch (error) {
        res.staus(500).json({ message: error.message });
    }
}