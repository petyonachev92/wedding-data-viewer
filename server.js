import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json());

// ⚠️ REPLACE THIS with your actual connection string from MongoDB Atlas
const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

app.get('/api/rsvps', async (req, res) => {
  try {
    await client.connect();
    
    // ⚠️ REPLACE 'wedding_db' and 'rsvps' with your actual DB and Collection names
    const database = client.db('wedding_db'); 
    const collection = database.collection('rsvps');
    
    // Fetch all documents from the collection
    const liveData = await collection.find({}).toArray();
    
    res.json(liveData);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch data from MongoDB Atlas" });
  } finally {
    await client.close();
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server is securely running on http://localhost:${PORT}`);
});