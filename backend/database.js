const mongoose = require('mongoose');

function dbConnect(){
    const DB_URL = process.env.DB_URL;
    // Database Connection

    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
    }).catch(err => console.log("mongoose connection not successful"));


    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB Connected...');
    })
}

module.exports = dbConnect