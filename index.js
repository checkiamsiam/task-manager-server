const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require("cors");
const port = process.env.PORT || 5000
require('dotenv').config()


app.use(cors()) 
app.use(express.json()) 

const uri = `mongodb+srv://noteTakerdb:${process.env.SECRET}@cluster0.d85vo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("note-taker").collection("tasks");

    //get method
    app.get('/tasks', async (req, res) => {
      const query = req.query;
      const cursor = await taskCollection.find(query) 
      const result = await cursor.toArray() 
      res.send(result)
    })


    //post method

    app.post('/tasks', async (req, res) => {
      const postItem = req.body; // post kora data er body te object ti pawa jay
      const result = await taskCollection.insertOne(postItem);
      res.send(result)
    })

    //put method

    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id; // id param use
      const updateItem = { _id: ObjectId(id) }; // id diye specific akti data khuja
      const options = { upsert: true }; // update + insert = upsert aita sotto condition dawa

      // update data korar khetre body ta aibhabe rakte hoy (following to the docs)
      const updateDoc = {
        $set: req.body
      };
      // final result 
      const result = await taskCollection.updateOne(updateItem, updateDoc, options);
      res.send(result)
    })

    //delete method

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const deleteItem = { _id: ObjectId(id) }; // id diye specific akti data khuja
      const result = await taskCollection.deleteOne(deleteItem);
      res.send(result)

    })


  } finally {

  }
}
run().catch(console.log);


app.get('/', (req, res) => {
  res.send({ welcome: 'welcome to your server' })
})


app.listen(port)