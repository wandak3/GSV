import mongoose from "mongoose";
import { MongoURL, MongoDataBase } from "../config/config.json";

module.exports = () => {
    const MONGO_URI = MongoURL
    if (!MONGO_URI) return console.log('URL not available.')
    mongoose.set('strictQuery', true);
    mongoose.connect(`${MONGO_URI}`, {
        "dbName": MongoDataBase
    })
    .catch((error) => console.log('Database connection failed. Reason: ' + error));
}