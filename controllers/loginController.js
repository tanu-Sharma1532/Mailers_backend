const bcrypt = require('bcrypt');
const User = require("../model/userModel");
const jwt = require("jsonwebtoken")

const JWT_SECRET ="123456";
// Sign up route handler
exports.signup = async (req, res) => {
    try {
        // get data
        const { name, email, password } = req.body;

        // check if user already exist 
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        // Secured password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        // Create Entry for User
        let user = await User.create({
            name,email,password:hashedPassword
        });

        return res.status(200).json({
            success : true,
            message : "User Created Successfully",
            data : user
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}

// Login
exports.login = async (req,res) => {
    try
    {
        const {email,password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message : "Please fill all the details carefully",
            })
        }

        // check for register user 
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({
                success : false,
                message : "User does not exist",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email : user.email,
            id : user._id,
        };


        if(await bcrypt.compare(password,user.password)){
            // password match
            let token = jwt.sign(payload,JWT_SECRET,{
                expiresIn : "2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true,
            }

            res.cookie("token",token,options).status(200).json({
                success : true,
                token,
                user,
                message:"User logged in successfully"
            });
        }
        else {
            // password not match
            return res.status(403).json({
                success : false,
                message : "Password does not match",
            })
        }
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Login false" 
        })
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { newPassword, oldPassword } = req.body;

        // Check if both passwords are provided
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both old and new passwords are required' });
        }

        // Find the user by email from the token payload
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Log the user's email and other useful debug information
        console.log("Changing password for user:", req.email);

        // Compare old password with the hashed password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        // Hash the new password and update the user document
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error in changePassword:', error);
        res.status(500).json({ success: false, message: 'Error in changing password', error: error.message });
    }
};
