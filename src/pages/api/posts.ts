import { NextApiRequest, NextApiResponse } from 'next';

type Post = {
  id: number;
  title: string;
  content: string;
  type: 'reference' | 'author' | 'misc';
  category?: string;
  author?: string;
  createdAt: string;
};

let posts: Post[] = []; // In-memory database (for testing only)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers (only for cross-origin requests)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  if (req.method === 'GET') {
    const { type } = req.query;
    const filteredPosts = posts.filter(post => post.type === type);
    return res.status(200).json(filteredPosts);
  }

  if (req.method === 'POST') {
    try {
      const { title, content, type, category, author } = req.body;

      if (!title || !content || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newPost: Post = {
        id: Date.now(),
        title,
        content,
        type,
        category,
        author,
        createdAt: new Date().toISOString(),
      };

      posts.unshift(newPost); // Add to beginning of array
      return res.status(201).json(newPost);

    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
