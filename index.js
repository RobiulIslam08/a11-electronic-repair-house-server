const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


const corsOptions = {
	origin : ['http://localhost:5173', 'http://localhost:5173'],
	credentials: true,
	optionSuccessStatus: 200
}
// midleware 
app.use(cors(corsOptions))
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqcbidk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

  try {
	const servicesCollection = client.db('electronServicesHouse').collection('services')
	const bookedCollection = client.db('electronServicesHouse').collection('booked')
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

	app.get('/allService', async(req, res)=>{
		const cursor = servicesCollection.find()
		const result = await cursor.toArray()
		res.send(result)
	})
	app.post('/allService', async(req, res)=>{
		const servicesInfo = req.body
		console.log(servicesInfo)
		const result = await servicesCollection.insertOne(servicesInfo)
		res.send(result)
		
	})




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req , res)=>{
	res.send('electronic repair is running')
	
})
app.listen(port, ()=>{
	console.log('electronic repair server is running ', port)
})

