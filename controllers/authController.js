const UserModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");

const userRegistration = async (req, res) => {
    const {name, email , contactNo,password,confirmPassword} = req.body;

    const user = await UserModel.findOne({email:email.toLowerCase()});
    if(user){
        res.status(409).send({"status":"Failed","message":"Email already exist please login or try different email"});
    }else{
        if(name && email && contactNo && password && confirmPassword){
            if(password === confirmPassword){
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new UserModel({
                      name: name,
                      email: email.toLowerCase(),
                      password: hashPassword,
                      contactNo: contactNo
                    })
                    await doc.save()
                    const saved_user = await UserModel.findOne({ email: email.toLowerCase() })
                    console.log(saved_user.contactNo);
                    // Generate JWT Token
                    const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                    res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
                  } catch (error) {
                    console.log(error)
                    res.status(500).send({ "status": "failed", "message": "Unable to Register" })
                  }
            }else{
                res.status(400).send({"status":"Failed","message":"Password and confirm password doesn't Match"});
            }
        }else{
            res.status(400).send({"status":"Failed","message":"Please provide every field"});
        }
    }
}

const userLogin = async (req,res)=>{
    try {
        const { email, password } = req.body
        if (email && password) {
          const user = await UserModel.findOne({ email: email.toLowerCase() })
          if (user != null) {
            const isMatch = await bcrypt.compare(password, user.password)
            if ((user.email == email.toLowerCase()) && isMatch) {
              // Generate JWT Token
              const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
              res.status(201).send({ "status": "success", "message": "Login Success", "token": token })
            } else {
              res.status(400).send({ "status": "failed", "message": "Email or Password is not Valid" })
            }
          } else {
            res.status(401).send({ "status": "failed", "message": "You are not a Registered User" })
          }
        } else {
          res.status(400).send({ "status": "failed", "message": "All Fields are Required" })
        }
      } catch (error) {
        console.log(error)
        res.status(500).send({ "status": "failed", "message": "Unable to Login" })
      }
}

const changePassword = async (req,res)=>{
    const {newPassword,confirmNewPassword}=req.body;
    if(newPassword && confirmNewPassword){
        if(newPassword == confirmNewPassword){
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(newPassword, salt);
            await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
            res.status(201).send({ "status": "success", "message": "Password changed succesfully" })
        }else{
            res.status(400).send({ "status": "failed", "message": "New password and confirm new password doesn't match" })
        }
    }else{
        res.status(400).send({ "status": "failed", "message": "All Fields are required" });
    }
}

const getLoggedUser = async (req,res)=>{
    res.status(200).send({"user": req.user});
}

const sendPasswordResetEmail = async (req,res)=>{
  const { email } = req.body
  if (email) {
    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY
      const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
      const link = `http://127.0.0.1:3000/api/v1/auth/reset/${user._id}/${token}`
      console.log(link)
      // Send Email
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<a href=${link}>Click Here</a> to Reset Your Password`
      })
      res.status(200).send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
    } else {
      res.status(404).send({ "status": "failed", "message": "Email doesn't exists" })
    }
  } else {
    res.status(400).send({ "status": "failed", "message": "Email Field is Required" })
  }
}

const resetPassword = async(req,res)=>{
  const { password, confirmResetPassword} = req.body;
  const {id, token } = req.params;
  const user = await UserModel.findById(id);
  const newSecret = user._id + process.env.JWT_SECRET_KEY;
  try{
    jwt.verify(token,newSecret);
    if(password && confirmResetPassword){
      if(password==confirmResetPassword){
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt)
        await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
        res.status(201).send({ "status": "success", "message": "Password Reset Successfully" })
      }else{
        res.status(400).send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
      }
    }else{
      res.status(400).send({"status": "failed", "message": "All Fields are Required"});
    }
  }catch(error){
    console.log(error);
    res.status(500).send({ "status": "failed", "message": "Invalid Token"});
  }
}

const updateUser = async (req,res)=>{
    const {name,email,contactNo} = req.body;
    console.log(req.user._id);
    if(name && email && contactNo){
      await UserModel.findByIdAndUpdate(req.user._id, { $set: { name: name, email:email.toLowerCase(),contactNo:contactNo}});
      res.status(201).send({ "status": "success", "message": "Profile Updated Successfully" }); 
    }else{
      res.status(400).send({"status": "failed", "message": "All Fields are Required"});
    }
}
module.exports = {userRegistration,userLogin,changePassword,getLoggedUser,sendPasswordResetEmail,resetPassword,updateUser};
