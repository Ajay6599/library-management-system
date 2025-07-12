require('dotenv').config();

const mongoose = require('mongoose');

// let connection = mongoose.connect('mongodb+srv://ajayprajapati:pTrsc8VxRjjPmdSa@cluster0.kowkh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');

let connection = mongoose.connect(process.env.MONGODB_URI);

module.exports = { connection };