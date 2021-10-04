const { MongoClient, ObjectId } = require('mongodb')

// const uri = process.env.DBWEBB_DSN || "mongodb://localhost:27017/editor";
// const uri = "mongodb+srv://texteditor:texteditor@cluster0.bjqhb.mongodb.net/editor?retryWrites=true&w=majority";

const config = require("../config.json");

let uri = `mongodb+srv://${config.username}:${config.password}@cluster0.bjqhb.mongodb.net/editor?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

const database = {

    readTitles: async function readTitles(db, col) {

        const client = new MongoClient(uri);

        try {
            await client.connect();

            const database = client.db(db);
            const editor = database.collection(col);

            const query = {}

            const options = {
                sort: { title: 1 },
                projection: { _id: 0, title: 1 }
            }

            const cursor = editor.find(query, options);

            if ((await cursor.count()) === 0) {
                return []
            }

            const res = await cursor.toArray();

            return res

        } finally {
            await client.close()
        }
    },

    readDoc: async function readDoc(db, col, title) {

        const client = new MongoClient(uri);

        try {

            await client.connect();

            const database = client.db(db);

            const docs = database.collection(col);

            const query = { title: title };
            const options = {
                projection: { _id: 1, title: 1, text: 1 },
            };

            const doc = await docs.findOne(query, options);

            return doc

        } finally {
            await client.close()
        }

    },

    updateDoc: async function updateDoc(db, col, doc) {

        const client = new MongoClient(uri);

        try {

            await client.connect();

            const database = client.db(db);

            const editor = database.collection(col);

            const filter = { _id: ObjectId(doc["docId"]) };

            const updateDoc = {
                $set: {
                  text: doc["docText"]
                },
              };

            const options = { upsert: false };

            const result = await editor.updateOne(filter, updateDoc, options);

            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );

        } finally {
            await client.close();
        }

    },

    insertDoc: async function insertDoc(db, col, title) {

        const client = new MongoClient(uri);

        try {

            await client.connect();

            const database = client.db(db);

            const editor = database.collection(col);

            const doc = {
                title: title
            }

            const result = await editor.insertOne(doc);

            console.log(`A document was inserted with the _id: ${result.insertedId}`);

        } finally {
            await client.close();
        }
    }

}

module.exports = database;