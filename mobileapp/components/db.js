// db.js

import { MongoClient } from 'mongodb';

// MongoDB Atlas connection string (replace with your own connection string)
const uri = 'mongodb+srv://team4projectexpo:password1234@cluster0.qe0fz2u.mongodb.net/?retryWrites=true&w=majority';

// Function to connect to MongoDB Atlas
async function connectToDatabase() {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();

    console.log('Connected to MongoDB Atlas');

    return client.db(); // Returns the database object
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error.message);
    throw error;
  }
}

export default connectToDatabase;
