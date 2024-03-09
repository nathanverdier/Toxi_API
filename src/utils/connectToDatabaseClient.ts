import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URL;
const dbName = 'ToxiReality';

const client = new MongoClient(uri!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectToDatabaseClient() {
    try {
        await client.connect();
        await client.db(dbName).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données :', error);
        throw error;
    }
}

async function closeDatabaseClientConnection() {
    try {
        console.log("Fermeture de la connexion à la base de données...");
        await client.close();
        console.log("Connexion à la base de données fermée avec succès.");
    } catch (error) {
        console.error('Erreur lors de la fermeture de la connexion à la base de données :', error);
        throw error;
    }
}

export {
    connectToDatabaseClient,
    closeDatabaseClientConnection,
};