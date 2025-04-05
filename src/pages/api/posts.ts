import { Pool } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create a database connection pool
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
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
      const { rows } = await pool.query(
        'SELECT * FROM posts WHERE type = $1 ORDER BY createdat DESC',
        [type]
      );
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { title, content, type, category, author } = req.body;

      // Validate required fields
      if (!title || !content || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert new post into database
      const { rows } = await pool.query(
        `INSERT INTO posts (title, content, type, category, author)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, content, type, category || null, author || null]
      );

      return res.status(201).json(rows[0]);
    }

    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Close the database connection
    await pool.end();
  }
}
