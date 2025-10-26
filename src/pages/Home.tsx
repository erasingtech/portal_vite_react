import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase/client';
import type { Post } from '../types/database';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'resize') {
        const iframe = document.getElementById(`iframe-${event.data.id}`) as HTMLIFrameElement;
        if (iframe) {
          iframe.style.height = event.data.height + 'px';
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('order_index', { ascending: true })
        .limit(100);

      if (error) {
        setError(error.message);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      setError('An error occurred while fetching posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='flex items-center justify-center p-8'>Loading posts...</div>;
  }

  if (error) {
    return <div className='flex items-center justify-center p-8 text-red-500'>{error}</div>;
  }

  const generateExcerptHtml = (post: Post) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <style>
        html, body { margin: 0; padding: 0; overflow: hidden; }
    </style>
</head>
<body>
    ${post.html_excerpt || ''}
    <script>
        ${post.js_excerpt || ''}
        // Notify parent of content height
        function notifyHeight() {
            const height = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            window.parent.postMessage({ type: 'resize', height, id: '${post.id}' }, '*');
        }
        
        window.addEventListener('load', notifyHeight);
        
        // Use ResizeObserver for dynamic content
        const resizeObserver = new ResizeObserver(notifyHeight);
        resizeObserver.observe(document.body);
        
        // Also check for canvas elements (p5.js)
        setTimeout(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                resizeObserver.observe(canvas);
            }
            notifyHeight();
        }, 100);
        
        // Final checks
        setTimeout(notifyHeight, 300);
        setTimeout(notifyHeight, 1000);
    </script>
</body>
</html>`;
  };

  const getColSpanClass = (html: string | null) => {
    if (!html) return 'col-span-12';
    const match = html.match(/col-span-(\d+)/);
    if (!match) return 'col-span-12';

    const span = match[1];
    const spanMap: { [key: string]: string } = {
      '1': 'col-span-1',
      '2': 'col-span-2',
      '3': 'col-span-3',
      '4': 'col-span-4',
      '5': 'col-span-5',
      '6': 'col-span-6',
      '7': 'col-span-7',
      '8': 'col-span-8',
      '9': 'col-span-9',
      '10': 'col-span-10',
      '11': 'col-span-11',
      '12': 'col-span-12'
    };
    return spanMap[span] || 'col-span-12';
  };

  return (
    <div className='w-screen bg-white m-0 p-0'>
      <div className='grid grid-cols-12 w-screen m-0 p-0'>
        {posts.map((post) => (
          <div 
            key={post.id} 
            className={`${getColSpanClass(post.html_excerpt)} relative overflow-hidden m-0 p-0`}
          >
            <iframe
              id={`iframe-${post.id}`}
              srcDoc={generateExcerptHtml(post)}
              className='w-full h-full border-0 m-0 p-0'
              sandbox='allow-scripts allow-same-origin'
              scrolling='no'
              style={{ display: 'block', overflow: 'hidden', margin: 0, padding: 0 }}
            />
            <Link
              to={`/p/${post.slug}`}
              aria-label={`Open post: ${post.title}`}
              className='absolute inset-0 z-10'
            />
          </div>
        ))}
        {posts.length === 0 && <div className='col-span-12 text-center text-gray-500'>No posts found</div>}
      </div>
    </div>
  );
}
