const port = 3000

const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/FlickrImageBrowser';

const connectDataBase = () => {
    mongoose.connect(DB_URI, {
        serverSelectionTimeoutMS: 5000,
    })
        .then(() => console.log('Database Connected'))
        .catch(err => console.log('Error connecting to the database:', err));
}

module.exports = {connectDataBase, DB_URI}




