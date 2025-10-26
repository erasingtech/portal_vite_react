export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  html_excerpt: string | null;
  js_excerpt: string | null;
  html_content: string | null;
  js_content: string | null;
  status: 'draft' | 'published' | 'archived';
  order_index: number;
  created_at: string;
  updated_at: string;
}
