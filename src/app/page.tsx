'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from './components/Container';
import Image from 'next/image';

interface ContentItem {
  id: number;
  title: string;
  content: string;
  type: string;
  path: string;
  author?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
}

export default function Home() {
  const [latestContent, setLatestContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    async function fetchLatestContent() {
      try {
        const responses = await Promise.all([
          fetch('/api/posts?type=reference'),
          fetch('/api/posts?type=author'),
          fetch('/api/posts?type=misc')
        ]);

        const [referenceTexts, authorPosts, miscPosts] = await Promise.all([
          responses[0].json(),
          responses[1].json(),
          responses[2].json()
        ]);

        const allContent = [
          ...referenceTexts.map((item: any) => ({
            ...item,
            type: 'Reference Texts',
            path: '/reference-texts'
          })),
          ...authorPosts.map((item: any) => ({
            ...item,
            type: 'By Author',
            path: '/by-author'
          })),
          ...miscPosts.map((item: any) => ({
            ...item,
            type: 'Miscellaneous',
            path: '/miscellaneous',
            tags: item.tags || []
          }))
        ];

        const sortedContent = allContent.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setLatestContent(sortedContent.slice(0, 3));
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    }

    fetchLatestContent();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mithila-bg.jpg')" }}
      >
        {/* Stronger Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40"></div>

        {/* Centered Text Section */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <div className="bg-black/50 px-10 py-8 rounded-lg backdrop-blur-md shadow-lg">
            <h1
              className="text-7xl font-extrabold mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
            >
              Mithila By Rajnath
            </h1>
            <p
              className="text-2xl md:text-3xl font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            >
              Explore literary insights, book references, and more
            </p>
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="bg-gray-100 py-16">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-6xl font-serif italic text-blue-600 mb-8">BY</h2>
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-600 shadow-xl mb-8">
              <Image 
                src="/images/author.jpg" 
                alt="Rajnath Mishra" 
                fill 
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">Rajnath Mishra</h3>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl text-center">
              A passionate writer and literary scholar dedicated to preserving and sharing the rich cultural heritage of Mithila.
            </p>
          </div>
        </Container>
      </div>

      {/* Latest Content Section */}
      <Container>
        <div className="py-12">
          <h2 className="text-center text-3xl font-bold mb-8">Latest Content</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full mb-2">
                    {item.type}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  {item.author && (
                    <p className="text-gray-700 mb-1">by {item.author}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                  <Link
                    href={item.path}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
