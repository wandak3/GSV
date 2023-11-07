import mongoose from "mongoose";

module.exports = () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) return console.log('URL not available.')
    mongoose.set('strictQuery', true);
    mongoose.connect(`${MONGO_URI}`, {
        "dbName": process.env.MONGO_DATABASE_NAME
    })
    .catch((error: any) => console.log('Database connection failed. Reason: ' + error));
}