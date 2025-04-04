import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  coverImage: string;
  category?: string;
}

export default function PostCard({ title, excerpt, slug, date, coverImage, category = 'Blog' }: PostCardProps) {
  return (
    <article className="card group">
      <div className="relative h-52 overflow-hidden">
        <Image 
          src={coverImage} 
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {category && (
          <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        )}
      </div>
      <div className="p-6">
        <time className="text-sm text-gray-500 mb-2 block">{date}</time>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        <Link 
          href={`/blog/${slug}`} 
          className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800"
        >
          Read more
          <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
