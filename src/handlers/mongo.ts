import mongoose from "mongoose";
import { MongoURL, MongoDataBase } from "../config/config.json";

module.exports = () => {
    const MONGO_URI = MongoURL
    if (!MONGO_URI) return console.log('URL not available.')
    mongoose.connect(`${MONGO_URI}`, {
        "dbName": MongoDataBase
    })
    .then(() => console.log('Database connected.'))
    .catch((error) => console.log('Database connection failed. Reason: ' + error));
}