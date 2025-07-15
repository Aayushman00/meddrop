const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://rootuser:rootpassword@cluster0.afqjrjx.mongodb.net/meddrop?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MongoDB connection successful');
    })
    .catch((err) => {
        console.error('MongoDB connection error')
    });