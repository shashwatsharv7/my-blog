import { Pool } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';

// Create a single pool instance
let pool: Pool;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize pool if it doesn't exist
    if (!pool) {
      pool = new Pool({ 
        connectionString: process.env.POSTGRES_URL,
        connectionTimeoutMillis: 5000  // Increase timeout
      });
    }

    // Handle CORS
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Ensure table exists outside request handlers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        author VARCHAR(100),
        createdat TIMESTAMP DEFAULT NOW()
      )
    `);

    if (req.method === 'GET') {
      const { type } = req.query;
      if (!type) return res.status(400).json({ error: 'Missing type parameter' });
      
      const { rows } = await pool.query(
        'SELECT * FROM posts WHERE type = $1 ORDER BY createdat DESC',
        [type]
      );
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { title, content, type, category, author } = req.body;
      
      if (!title?.trim() || !content?.trim() || !type?.trim()) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { rows } = await pool.query(
        `INSERT INTO posts (title, content, type, category, author)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title.trim(), content.trim(), type.trim(), category?.trim() || null, author?.trim() || null]
      );

      return res.status(201).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing post ID' });

      // Add a client connection with proper timeout
      const client = await pool.connect();
      
      try {
        await client.query('DELETE FROM posts WHERE id = $1', [id]);
        return res.status(200).json({ success: true });
      } finally {
        client.release(); // Always release the client back to the pool
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
