const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://thinkerssss:wCWeTuAnt3po64QY@cluster0.jeojreb.mongodb.net/inotebook?retryWrites=true&w=majority"

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo; 