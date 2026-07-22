import express from 'express';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/db', (req, res) => {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read database' });
  }
});

app.post('/api/db', (req, res) => {
  try {
    const data = req.body;
    console.log(`[POST /api/db] Received data. Responses count: ${data.responses ? data.responses.length : 0}`);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log(`[POST /api/db] Successfully wrote to ${dbPath}`);
    res.json({ success: true, written: true });
  } catch (error) {
    console.error(`[POST /api/db] Error:`, error);
    res.status(500).json({ error: 'Failed to write database' });
  }
});

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for React Router (Single Page Application)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
