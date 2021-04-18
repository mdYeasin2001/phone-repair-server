const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = 5000;
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
  const reviewsCollection = client.db("phoneRepairApp").collection("review");

  app.post('/addService', (req, res) => {
    const service = req.body;
    servicesCollection.insertOne(service)
      .then(result => res.send(result.insertedCount > 0))
  })

  app.post('/postReview', (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review)
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


  app.post('/userRole', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => res.send(admin.length > 0))
  })

  app.get('/services', (req, res) => {
    servicesCollection.find({})
      .toArray((err, services) => res.send(services))
  })

  app.get('/reviews', (req, res) => {
    reviewsCollection.find({})
      .toArray((err, reviews) => res.send(reviews))
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



  app.delete('/deleteService/:id', (req, res) => {
    const id = req.params.id;
    servicesCollection.deleteOne({ _id: ObjectId(id) })
      .then(result => res.send(result.deletedCount > 0))
  })


  // patch method
  app.patch('/updateBooking', (req, res) => {
    const { status, id } = req.body;
    console.log(status, id);
    bookingsCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { "status": status}}
    )
    .then(result => res.send(result. modifiedCount > 0))
  })
  

});


app.listen(process.env.PORT || port)