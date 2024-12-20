import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req,res) => {
    const {name,email,password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({name,email,password:hashedPassword});
        await user.save();
        res.status(201).json({message: "User registered successfully",user})
    }
    catch (error) {
        res.status(500).json({message:"Error registering user",error})
    }
};

export const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message:"User not found"});

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if (!isPasswordValid) return res.status(401).json({message:"Wrong Password"});

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn:'1d'});
        res.status(200).json({message: "Login Success",token,user});
    }
    catch (error){
        res.status(500).json({message:"error logging in",error})
    }
};