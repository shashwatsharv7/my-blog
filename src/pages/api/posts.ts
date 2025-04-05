import { Pool } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';

let pool: Pool;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!pool) {
      pool = new Pool({ 
        connectionString: process.env.POSTGRES_URL,
        connectionTimeoutMillis: 5000
      });
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Ensure table exists
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
        'SELECT id, title, content, type, category, author, createdat FROM posts WHERE type = $1 ORDER BY createdat DESC',
        [type]
      );

      // Format the createdAt field before returning
      const formattedRows = rows.map(row => ({
        ...row,
        createdat: new Date(row.createdat).toISOString()
      }));

      return res.status(200).json(formattedRows);
    }

    if (req.method === 'POST') {
      const { title, content, type, category, author } = req.body;

      if (!title?.trim() || !content?.trim() || !type?.trim()) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { rows } = await pool.query(
        `INSERT INTO posts (title, content, type, category, author, createdat)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [title.trim(), content.trim(), type.trim(), category?.trim() || null, author?.trim() || null]
      );

      return res.status(201).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing post ID' });

      await pool.query('DELETE FROM posts WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
