const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId =require("mongodb").ObjectId
const cors = require('cors')

require('dotenv').config()
const app = express()

const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());



// gApDvEJ28LD8XLUV
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dg42d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        const database = client.db("CarMeachanic");
        const servicesCollection = database.collection("services");

        //get API
        app.get('/services',async(req,res)=>{
            const cursor = servicesCollection.find({});
           
            const services = await cursor.toArray();
            res.send(services)


        })

        //GET SIngle Service

        app.get('/services/:id',async(req,res)=>{
            const id =req.params.id;
            console.log("Getting Service ", id)
            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);
            res.send(service)
        })
        
        //Post API

        app.post('/services',async(req,res)=>{
            const service =req.body;
            console.log('hit the post Api' , service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result);
        })

        //DELETE API

        app.delete('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })

        








        }  
        finally {
            // await client.close();
          } 
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})