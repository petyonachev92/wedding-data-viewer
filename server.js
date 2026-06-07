import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Set up directory naming for ES Modules so we can find the React build folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔒 MongoDB Connection
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ ERROR: MONGODB_URI environment variable is missing!");
  process.exit(1); 
}
const client = new MongoClient(uri);

// 📋 API Route
app.get('/api/rsvps', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('wedding_db'); // Replace with your DB name
    const collection = database.collection('rsvps'); // Replace with your collection name
    const liveData = await collection.find({}).toArray();
    res.json(liveData);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await client.close();
  }
});

// 🌐 SERVE FRONTEND: Tell Express to point to Vite's production build folder
app.use(express.static(path.join(__dirname, 'dist')));

// 🧹 Express v5 Catch-All Fallback
// Using app.use without a path string catches everything safely without regex errors
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 🚀 Port Binding Configuration
const PORT = process.env.PORT || 5001;

// Explicitly add '0.0.0.0' as the host argument for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server cleanly running on port ${PORT}`);
});