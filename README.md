# React Portal Migration

This React application has been migrated from the Next.js portal_next project.

## Features

- **Home Page**: Displays a grid of published posts with interactive iframe excerpts
- **Post Page**: Shows individual post details with visualization and content sections
- **Supabase Integration**: Fetches posts from Supabase database
- **Responsive Design**: Built with TailwindCSS v4

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your Supabase credentials to the `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The app will run on `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   └── IframeAutoResize.tsx    # Component for auto-resizing iframes
├── pages/
│   ├── Home.tsx                # Home page with posts grid
│   └── Post.tsx                # Individual post page
├── types/
│   └── database.ts             # TypeScript interfaces
├── utils/
│   └── supabase/
│       └── client.ts           # Supabase client initialization
├── App.tsx                     # Main app with routing
└── main.tsx                    # App entry point
```

## Routes

- `/` - Home page with all published posts
- `/p/:slug` - Individual post page

## Technologies

- React 19
- React Router DOM
- Supabase
- TailwindCSS v4
- Vite
- TypeScript
