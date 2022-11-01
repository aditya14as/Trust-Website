const jwt = require("jsonwebtoken");
const UserModel = require('../models/authModel');

const checkUserAuth = async (req,res,next)=>{
    let token;
    const {authorization} = req.headers;
    console.log(authorization);
    if (authorization && authorization.startsWith('Bearer')){
        try{
            token = authorization.split(' ')[1];
            const {userID}= jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user = await UserModel.findById(userID).select('-password');
            console.log(req.user);
            next();
        }
        catch(err){
            console.log(err);
            res.status(401).send({"status":"failed","message":"Unauthorized user"});
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized user, No token found"});
    }
}
module.exports = checkUserAuth;