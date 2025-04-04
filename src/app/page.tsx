'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from './components/Container';

interface ReferenceText {
  id: number;
  title: string;
  author: string;
  content: string;
  category?: string;
  createdAt: string;
}

interface AuthorPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface MiscPost {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
}

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
    // Fetch content from localStorage with type safety
    const referenceTexts: ReferenceText[] = JSON.parse(localStorage.getItem('referenceTexts') || '[]');
    const authorPosts: AuthorPost[] = JSON.parse(localStorage.getItem('authorPosts') || '[]');
    const miscPosts: MiscPost[] = JSON.parse(localStorage.getItem('miscPosts') || '[]');

    // Combine all content into a single array with proper typing
    const allContent: ContentItem[] = [
      ...referenceTexts.map((item) => ({
        ...item,
        type: 'Reference Texts',
        path: '/reference-texts',
      })),
      ...authorPosts.map((item) => ({
        ...item,
        type: 'By Author',
        path: '/by-author',
      })),
      ...miscPosts.map((item) => ({
        ...item,
        type: 'Miscellaneous',
        path: '/miscellaneous',
        tags: item.tags || [],
      })),
    ];

    // Sort by date (newest first)
    allContent.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Take top 3 items for display
    setLatestContent(allContent.slice(0, 3));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mithila-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Mithila By Rajnath</h1>
          <p className="text-lg md:text-xl mb-8">
            Explore literary insights, book references, and more
          </p>
        </div>
      </div>

      {/* Latest Content Section */}
      <Container id="latest-content">
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
                  <p className="text-sm text-gray-500 mb-3">{item.createdAt}</p>
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
