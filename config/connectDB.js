const mongoose = require('mongoose');

const connectDB = async (DATABASE_URL)=>{
    try{
        const dbOptions = {
            dbName : "trustWebsite"
        }
        await mongoose.connect(DATABASE_URL,dbOptions);
        console.log("Database Connected!")
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {connectDB};