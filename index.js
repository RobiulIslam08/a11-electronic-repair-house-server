const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


const corsOptions = {
	origin : ['http://localhost:5173', 'http://localhost:5174',"https://electronic-repair-house.web.app","https://electronic-repair-house.firebaseapp.com"],
	credentials: true,
	optionSuccessStatus: 200
}
// midleware 
app.use(cors(corsOptions))

// ---------------------------
// const corsConfig = {
// 	origin: '*',
// 	credentials: true,
// 	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
// 	}
// 	app.use(cors(corsConfig))
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
	// app.get('/purchaseService', async(req, res)=>{
	// 	const cursor = bookedCollection.find()
	// 	const result = await cursor.toArray()
	// 	res.send(result)
	// })
	app.get('/purchaseService/:email', async (req, res) => {
		const email = req.params.email
		const query = { currentUserEmail: email }
		const cursor = bookedCollection.find(query)
		const result = await cursor.toArray()
		res.send(result)
	  })
	app.post('/purchaseService', async(req, res)=>{
		const servicesInfo = req.body
		console.log(servicesInfo)
		const result = await bookedCollection.insertOne(servicesInfo)
		res.send(result)
		
	})
	app.get('/allService/:_id',async (req,res)=>{
		const id = req.params._id
		const query = {_id : new ObjectId(id)}
		const result = await servicesCollection.findOne(query) 
		res.send(result)
	  })
	  app.get('/manageService/:email', async (req, res) => {
		const email = req.params.email
		const query = { providerEmail: email }
		const cursor = servicesCollection.find(query)
		const result = await cursor.toArray()
		res.send(result)
	  })
	  app.delete('/manageService/:id', async(req, res)=>{
		const id = req.params.id
		const query = {_id: new ObjectId(id)}
		const result = await servicesCollection.deleteOne(query)
		res.send(result)
	  })
	  app.put('/updatePage/:id', async(req, res)=>{
		const id =req.params.id;
		const filter ={_id: new ObjectId(id)}
		const option = {upsert:true}
		const updateService = req.body
		const service = {
			$set:{
				...updateService,
			}
		}
		const result = await servicesCollection.updateOne(filter,service)
		res.send(result)
	  })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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

