import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import {hashPassword,comparePassword} from '../helper/authHelper.js';
import jwt from "jsonwebtoken";

//this is a post request, therefore use postman
//req,res : callback function
export const registerController = async(req,res) => {
    try{
        const {name,email,address,phone,answer,password} =  req.body;
        //validation
        if(!name){
            return res.send({message: 'Name is required' })
        }
        if(!email){
            return res.send({message: 'Email is required' })
        }
        if(!address){
            return res.send({message: 'Address is required' })
        }
        if(!phone){
            return res.send({message: 'Phone is required' })
        }
        if(!answer){
            return res.send({message: 'Answer is required' })
        }
        if(!password){
            return res.send({message: 'Password is required' })
        }

        //existing user
        const existingUser =  await userModel.findOne({email})
        if(existingUser) {
            return res.status(200).send({
                success:true,
                message:'You are already registered'
            })
        }

        //regsiter user now
        const hashedPassword = await hashPassword(password);
        //key:value pair  - key : password ,value :hashedPassword
        //save the user 
        const user = new userModel ({name,email,address,phone,password:hashedPassword,answer}).save()

        res.status(200).send({
            success:true,
            message:'User registered successfully',
            user
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in registration',
        })
    }
}



export const loginController = async(req,res) => {
    try{
        const {email,password} =  req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success : false,
                message: 'Invalid Email or Password' })
        }
        //after getting email, get user and their password
        //we decrypt the password
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered.'
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid password"
            })
        }

        //token creation
        const token = await jwt.sign({ _id:user._id }, process.env.JWT_SECRET, {expiresIn:'7d'})
        res.status(200).send({
            success:true,
            message:"Login Successful",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token,
        })

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Login',
        })
    }

}


//forgotPasswordController
export const forgotPasswordController = async (req,res) =>{
    try{
        const {email,answer,newPassword} = req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'Answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'New password is required'})
        }
        
        const user = await userModel.findOne({email,answer})

        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong Email or Answer. Please try again.'
            })
        }

        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:'Password changed successfully'
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            error
        })

    }

}

export const testController = (req,res) => {
    res.send("protected route")
}


export const updateProfileController = async(req,res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
          return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
          req.user._id,
          {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
          },
          { new: true }
        );
        res.status(200).send({
          success: true,
          message: "Profile updated successfully.",
          updatedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          message: "Error while updating profile.",
          error,
        });
      }
}


export const getOrdersController = async(req,res) =>{
    try {
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)    
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in viewing orders',
            error,
        })  
    }
}


export const getAllOrdersController = async(req,res) => {
    try {
        const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"})
        res.json(orders)    
    } catch (error) {
        console.log(error)
        res.status(500).send({ 
            success:false,
            message:'Error in viewing orders',
            error,
        })  
    }
}


export const orderStatusController = async(req,res) => {
    try {
        const {orderId } = req.params
        const {status} = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)        
    } catch (error) {
        console.log(error)
        res.status(500).send({ 
            success:false,
            message:'Error in updating orders',
            error,
        })
    }
}