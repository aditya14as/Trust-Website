const ContactUsModel = require("../models/contactUsModel");

const contactUs = async(req,res)=>{
    const {name, email, contactNo , subject, message} = req.body;
    if(name && email && contactNo && subject && message){
        const doc = new ContactUsModel({
            name: name,
            email: email.toLowerCase(),
            contactNo: contactNo,
            subject : subject,
            message : message
        })
        await doc.save();
        res.status(201).send({ "status": "success", "message": "Message sent successfully"});
    }else{
        res.status(400).send({"status":"Failed","message":"Please provide all fields"});
    }
}
module.exports = {contactUs};
