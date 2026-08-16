const mongoose = require('mongoose')
const userModel = require('../Models/userModel')
const {uploadPic} = require('../Services/ImageUpload')
const JWT    = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const file = req.file;

        // 1. Validate basic inputs early
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Please provide credentials'
            });
        }

        // 2. Fix Mongo $or query syntax
        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User Already Exist"
            });
        }

        // 3. Handle optional or required avatar upload safely
        let avatarUrl = "";
        if (file) {
            const result = await uploadPic(file.buffer.toString('base64'));
            avatarUrl = result.url || result.secure_url;
        }

        // 4. Hash password and create user
        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
            avatar: avatarUrl,
        });

        const token = JWT.sign(
            { id: user._id, username: user.username },
            process.env.JWT_TOKEN,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to create user",
            error: error.message,
        });
    }
}

async function loginUser(req,res){
    const {email,password}= req.body
    const user = await userModel.findOne({email})
    if(!user){
       return res.status(400).json({
            message:'email not found'
        })
    }
    const isPassValid =await bcrypt.compare(password ,user.password)

    if(!isPassValid){
         return res.status(400).json({
            message:"Wrong password"
        })
    }

    const token = JWT.sign(
        {id:user._id , username:user.username},
        process.env.JWT_TOKEN,
        {expiresIn:"1d"}
    )
   res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
})
     res.status(200).json({
        message:"user login successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,

        }
    })
}

async function getMe(req, res) {
    try {
        console.log('looking up user with id:', req.userId);
        const user = await userModel.findById(req.userId).select('-password -refreshToken');
        console.log('user found:', user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log('getMe error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
async function logout(req,res) {
    res.clearCookie('token')
    res.status(200).json({
        message:'Logout successfully'
    })
}

module.exports ={registerUser,loginUser,logout,getMe}