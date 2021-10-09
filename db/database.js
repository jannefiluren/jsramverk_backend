const { MongoClient, ObjectId } = require('mongodb')

const config = require("../config.json");

let uri = `mongodb+srv://${config.username}:${config.password}@cluster0.bjqhb.mongodb.net/editor?retryWrites=true&w=majority`;

const database = {

    readTitles: async function (req, res) {
        
        const client = new MongoClient(uri);
      
        try {

            await client.connect();

            const database = client.db("editor");
            const editor = database.collection("editor");

            const query = {}

            const options = {
                sort: { title: 1 },
                projection: { _id: 0, title: 1 }
            }

            const cursor = editor.find(query, options);

            if ((await cursor.count()) === 0) {
                return res.json([])
            }

            const result = await cursor.toArray();

            if (result) {
                return res.json(result)
            }

        } catch (e) {

            return res.status(500).json({
                errors: {
                    status: 500,
                    title: "Database error",
                    detail: e.message,
                }
            })

        } finally {

            await client.close()
        
        }
    },

    readDoc: async function (req, res) {
        
        const client = new MongoClient(uri);
        
        try {

            await client.connect();

            const database = client.db("editor");

            const docs = database.collection("editor");

            const query = { title: req.params.title };
            const options = {
                projection: { _id: 1, title: 1, text: 1 },
            };

            const doc = await docs.findOne(query, options);

            if (doc) {
                return res.json(doc)
            }

        } catch (e) {

            return res.status(500).json({
                errors: {
                    status: 500,
                    title: "Database error",
                    detail: e.message,
                }
            });

        } finally {

            await client.close()

        }

    },

    insertDoc: async function (req, res) {

        const client = new MongoClient(uri);

        try {

            await client.connect();

            const database = client.db("editor");

            const editor = database.collection("editor");

            const doc = {
                title: req.body.title
            }

            const result = await editor.insertOne(doc);

            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            
            return res.status(201).json(result);

        } catch (e) {

            return res.status(500).json({
                errors: {
                    status: 500,
                    title: "Database error",
                    detail: e.message,
                }
            });

        } finally {

            await client.close();

        }
    },

    updateDoc: async function (req, res) {

        const client = new MongoClient(uri);

        try {

            await client.connect();

            const database = client.db("editor");

            const editor = database.collection("editor");

            const filter = { _id: ObjectId(req.body.docId) };

            const updateDoc = {
                $set: {
                  text: req.body.docText
                },
              };

            const options = { upsert: false };

            const result = await editor.updateOne(filter, updateDoc, options);

            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );

            if (result) {
                return res.status(204).send()
            }

        } catch (e) {

            return res.status(500).json({
                errors: {
                    status: 500,
                    title: "Database error",
                    detail: e.message,
                }
            });

        } finally {

            await client.close();

        }

    },

    

}

module.exports = database;