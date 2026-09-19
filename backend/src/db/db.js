const mongoose = require('mongoose')


async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to mongodb");

    } catch (err) {
        console.log("Error connecting to MongoDB:", err);

    }
}

module.exports = connectDb;