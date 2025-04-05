import { Pool } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

  try {
    // First ensure the table exists
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

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');

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

      // Validate required fields
      if (!title?.trim() || !content?.trim() || !type?.trim()) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert new post
      const { rows } = await pool.query(
        `INSERT INTO posts (title, content, type, category, author)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title.trim(), content.trim(), type.trim(), category?.trim() || null, author?.trim() || null]
      );

      return res.status(201).json(rows[0]);
    }

    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      code: error.code
    });
  } finally {
    await pool.end();
  }
}
