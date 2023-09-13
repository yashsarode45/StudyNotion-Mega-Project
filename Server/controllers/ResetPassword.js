const User = require("../models/User")
const crypto = require('crypto')
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt')

exports.resetPasswordToken = async (req,res) => {

   try {
       const {email} = req.body;

       if(!email){
           return res.status(400).json({
               success:false,
               message:"Email is empty"
           })
       }
   
       const existingUser = await User.findOne({email})
   
       if(!existingUser){
           return res.status(400).json({
               success:false,
               message:"Email doesn't exist"
           })
       }
   
       const token = crypto.randomUUID()
   
       const updatedUser = await User.findOneAndUpdate({email},
                                                    {
                                                    token:token,
                                                    resetPasswordExpires: Date.now() + 5*60*1000
                                                    },
                                                    {new:true}) 

       const url = `http://localhost:3000/update-password/${token}`

       await mailSender(email, "Password Reset Link", `Password reset link: ${url}`);

       return res.status(200).json({
           success:true,
           message:'Reset link sent'
       })
   } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
   }
}

exports.resetPassword = async (req,res) => {

    try {
        const {token, password, confirmPassword} = req.body;     

        if(!token||!password||!confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Enter all details"
            })
        }

        const existingUser = await User.findOne({token:token});
        if(!existingUser) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }

        if(existingUser.resetPasswordExpires<Date.now()){
            return res.status(500).json({
                success:false,
                message:"Token is no longer valid"
            })
        }

        if (password!==confirmPassword) {
            return res.status(500).json({
                success:false,
                message:"Password Don't match"
            })
        }

        const hashedPwd = await bcrypt.hash(password, 10);
        const updatedUser = await User.findOneAndUpdate({token},{
            password:hashedPwd
        },{new:true})
        console.log("Updated user after password change is", updatedUser)
        return res.status(200).json({
            success:true,
            message:"Password Changed successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while reseting password'
        })
    }
}