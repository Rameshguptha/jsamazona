import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel';
import moment from 'moment';
import { generateToken, isAuth } from '../utils';

import emailHelper from '../emailHelper'

const userRouter = express.Router();

userRouter.get(
  '/createadmin',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: 'admin',
        email: 'admin@example.com',
        password: 'jsamazona',
        isAdmin: true,
      });
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!signinUser) {
      res.status(401).send({
        message: 'Invalid Email or Password',
      });
    } else {
      res.send({
        _id: signinUser._id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: generateToken(signinUser),
      });
    }
  })
);
userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const createdUser = await user.save();
    if (!createdUser) {
      res.status(401).send({
        message: 'Invalid User Data',
      });
    } else {
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    }
  })
);
userRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        message: 'User Not Found',
      });
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);


userRouter.post("/forgotPassword/:email",async(req,res)=>{
  const email=req.params.email;

  User.findOne({email:email})
  .then((userData)=>{
    if(!userData || !userData._doc)
    {
      return res.status(500).send({msg:"user not found please register"})
    }
    userData=userData._doc

    const val = Math.floor(100000 + Math.random() * 900000);

    User.updateOne({email:email},{$set:{
      forgotPasswordToken:val,forgotPasswordExpiry:moment().add(1,'hour').toDate()
    }}).then(()=>{
      try {
        let options={}
    
        options.reciever=email;
        options.subject="Password reset code for jsamazona";
        options.text=`Hi, Mr/Mrs ${userData.name} This is your code ${val} to reset your password.<br>Plase enter this code on the page`
    
        emailHelper.mailhelper(options)
        .then((result)=>{
    
          console.log("message sent",result.messageId);
    
          res.send("email sent succesfully")
        })
        .catch((error)=>{
          res.send(error)
        })
  
      } catch (error) {
        res.send({msg:"error while sending token via email"})
      }
    })
    .catch((err)=>{
      res.status(500).send({msg:"error in generating token"})
    })

  })
  .catch((error)=>{
    res.status(500).send({msg:error})
  })

  
 
})

userRouter.post('/forgotPassword/:email/:token',async(req,res)=>{

  const email=req.params.email;
  const token=req.params.token?parseInt(req.params.token):null;
  const nPassword=req.body.nPassword;
  const vPassword=req.body.vpassword;


  let user=await User.findOne({email:email})
  if(!user)
  {
    return res.status(422).send("invalid user")
  }

  if(user.forgotPasswordExpiry && user.forgotPasswordExpiry<moment().toDate())
  {
    return res.status(200).send("token expired re-generate the token")
  }
  if(!user.forgotPasswordToken)
  {
    return res.status(422).send({msg:"please re-generate your reset password token"})
  }
  if(user.forgotPasswordToken!=token)
  {
    return res.status(500).send("incorrect token")
  }

  User.updateOne({email:email},{$set:{password:nPassword,forgotPasswordExpiry:undefined,forgotPasswordToken:undefined}})
  .then((d)=>{
    console.log(d)
    res.status(200).send("password updated succesfully")

  })
  .catch((err)=>{
    res.send({msg:"error in updating password"})
  })
  
})

export default userRouter;
