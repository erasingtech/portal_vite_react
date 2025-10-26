import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase/client';
import { IframeAutoResize } from '../components/IframeAutoResize';
import type { Post } from '../types/database';

interface NavPost {
  title: string;
  slug: string;
  order_index: number;
  status: string;
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [morePosts, setMorePosts] = useState<NavPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      
      // Fetch the post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (postError) {
        setError(postError.message);
        return;
      }

      if (!postData) {
        navigate('/');
        return;
      }

      setPost(postData);

      // Fetch more posts for navigation
      const { data: morePostsData } = await supabase
        .from('posts')
        .select('title, slug, order_index, status')
        .eq('status', 'published')
        .order('order_index', { ascending: true })
        .limit(20);

      if (morePostsData) {
        setMorePosts(morePostsData);
      }
    } catch (err) {
      setError('An error occurred while fetching the post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='flex items-center justify-center p-8'>Loading post...</div>;
  }

  if (error) {
    return <div className='flex items-center justify-center p-8 text-red-500'>{error}</div>;
  }

  if (!post) {
    return <div className='flex items-center justify-center p-8'>Post not found</div>;
  }

  // Visualization iframe (js_content only)
  const vizHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
  <style>html,body{margin:0;padding:0;overflow:visible}</style>
</head>
<body>
  <script>
    ${post.js_content || ''}
    function postResize(){
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      window.parent.postMessage({ type: 'resize', height, id: 'viz-${post.id}' }, '*');
    }
    window.addEventListener('load', postResize);
    const ro = new ResizeObserver(postResize);
    ro.observe(document.body);
    if(document.querySelector('canvas')) ro.observe(document.querySelector('canvas'));
    setTimeout(postResize, 50);
    setTimeout(postResize, 300);
    setTimeout(postResize, 1000);
  <\/script>
</body>
</html>`;

  // Content iframe (html_content only)
  const contentHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>html,body{margin:0;padding:8px;overflow:visible}</style>
</head>
<body>
  ${post.html_content || ''}
  <script>
    function postResize(){
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      window.parent.postMessage({ type: 'resize', height, id: 'content-${post.id}' }, '*');
    }
    window.addEventListener('load', postResize);
    const ro = new ResizeObserver(postResize);
    ro.observe(document.body);
    setTimeout(postResize, 50);
    setTimeout(postResize, 300);
  <\/script>
</body>
</html>`;

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto w-full max-w-7xl p-4'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <Link to='/' className='text-sm text-blue-600 hover:underline'>
            ← Back to home
          </Link>
          {morePosts && morePosts.length > 0 && (
            <nav className='hidden gap-3 md:flex'>
              {morePosts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/p/${p.slug}`}
                  className={`text-sm ${p.slug === slug ? 'font-semibold text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  {p.title}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <h1 className='mb-2 text-2xl font-semibold'>{post.title}</h1>
        {post.excerpt && <p className='mb-6 text-neutral-600'>{post.excerpt}</p>}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {/* Visualization Column - 1/3 */}
          {post.js_content && (
            <div className='rounded border border-neutral-200 md:col-span-1'>
              <IframeAutoResize
                frameId={`viz-${post.id}`}
                srcDoc={vizHtml}
                title={`${post.title} - Visualization`}
                className='w-full border-0'
              />
            </div>
          )}
          {/* Content Column - 2/3 */}
          <div
            className={`rounded border border-neutral-200 ${post.js_content ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <IframeAutoResize
              frameId={`content-${post.id}`}
              srcDoc={contentHtml}
              title={post.title}
              className='w-full border-0'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
