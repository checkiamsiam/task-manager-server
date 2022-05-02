const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require("cors");
const port = process.env.PORT || 5000

//middleware for get and post 
app.use(cors()) //get 
app.use(express.json()) // post 

const uri = "mongodb+srv://noteTakerdb:5SEEl45OzhMRaZK9@cluster0.d85vo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    //connection and collection creation
    await client.connect();
    const notesCollection = client.db("note-taker").collection("notes");

    //get method
    app.get('/notes', async (req, res) => {
      const query = req.query; //kono query perameter na thakle req.query = {} hobe
      const cursor = await notesCollection.find(query) // query perameter thakle ta onujay khujbe na hoy empty object hobe sob data khuje dibe
      const result = await cursor.toArray() // find kora data gulo akti array te rakhar jonno jate accesss korte subhida hoy
      res.send(result)
    })


    //post method

    app.post('/notes', async (req, res) => {
      const postItem = req.body; // post kora data er body te object ti pawa jay
      const result = await notesCollection.insertOne(postItem);
      res.send(result)
    })

    //put method

    app.put('/notes/:id', async (req, res) => {
      const id = req.params.id; // id param use
      const updateItem = { _id: ObjectId(id) }; // id diye specific akti data khuja
      const options = { upsert: true }; // update + insert = upsert aita sotto condition dawa

      // update data korar khetre body ta aibhabe rakte hoy (following to the docs)
      const updateDoc = {
        $set: req.body
      };
      // final result 
      const result = await notesCollection.updateOne(updateItem, updateDoc, options);
      res.send(result)
    })

    //delete method

    app.delete('/notes/:id', async (req, res) => {
      const id = req.params.id;
      const deleteItem = { _id: ObjectId(id) }; // id diye specific akti data khuja
      const result = await notesCollection.deleteOne(deleteItem);
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