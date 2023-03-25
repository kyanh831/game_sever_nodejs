const { MongoClient } = require('mongodb');
require('dotenv').config();


async function connectToMongoDB() {
    const mongoUri = process.env.MONGO_URI + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@cluster0.fi2ls4t.mongodb.net/?retryWrites=true&w=majority";
    const mongoDatabase = process.env.MONGO_DATABASE;

    const client = new MongoClient(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(mongoDatabase);
        return db;
    } catch (e) {
        console.error(e);
    }

}

module.exports = {
    connectToMongoDB,
};


