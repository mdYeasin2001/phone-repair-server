const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = 5000 || process.env.PORT;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.54hym.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Phone Repair App server!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("phoneRepairApp").collection("services");
  const adminCollection = client.db("phoneRepairApp").collection("admin");
  const bookingsCollection = client.db("phoneRepairApp").collection("bookings");

  app.post('/addService', (req, res) => {
    const service = req.body;
    servicesCollection.insertOne(service)
      .then(result => res.send(result.insertedCount > 0))
  })

  app.post('/makeAdmin', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
      .then(result => res.send(result.insertedCount > 0))
  })

  app.post('/bookService', (req, res) => {
    const booking = req.body;
    bookingsCollection.insertOne(booking)
      .then(result => res.send(result.insertedCount > 0))
  })

  app.post('/orders', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        if (admin.length > 0) {
          bookingsCollection.find({})
            .toArray((err, bookings) => res.send(bookings))
        }
      })
  })

  app.post('/manageServices', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        if (admin.length > 0) {
          servicesCollection.find({})
            .toArray((err, services) => res.send(services))
        }
      })
  })

  app.get('/services', (req, res) => {
    servicesCollection.find({})
      .toArray((err, services) => res.send(services))
  })

  app.get('/services/:id', (req, res) => {
    const id = req.params.id;
    servicesCollection.find({ _id: ObjectId(id) })
      .toArray((err, service) => res.send(service))
  })

  app.get('/bookList/:email', (req, res) => {
    const email = req.params.email;
    bookingsCollection.find({ email: email })
      .toArray((err, bookings) => res.send(bookings))
  })


});


app.listen(port)