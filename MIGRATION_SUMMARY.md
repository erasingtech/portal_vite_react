# Migration Summary: portal_next → React

## Overview
Successfully migrated the home page and post page functionality from the Next.js `portal_next` project to the React `react` project. The posts editor page was not implemented as requested.

## What Was Migrated

### 1. **Home Page** (`/`)
- Displays a grid of published posts
- Each post shows an interactive iframe excerpt (HTML + JavaScript)
- Posts are fetched from Supabase
- Posts are ordered by `order_index`
- Dynamic grid layout based on `col-span-*` classes in excerpt HTML
- Clickable overlay links to individual post pages

### 2. **Post Page** (`/p/:slug`)
- Shows individual post details
- Two-column layout (when JavaScript visualization is present):
  - Left column (1/3): JavaScript visualization iframe
  - Right column (2/3): HTML content iframe
- Single column layout (when no JavaScript visualization)
- Navigation bar showing other published posts
- Back to home link
- Auto-resizing iframes for dynamic content

### 3. **IframeAutoResize Component**
- Reusable component for auto-resizing iframes
- Listens to `postMessage` events from iframe content
- Dynamically adjusts iframe height based on content
- Prevents layout shifts

### 4. **Supabase Integration**
- Client-side Supabase client for fetching posts
- Connects to the same database as portal_next
- Queries posts table with filters for status and ordering

## Files Created

```
react/
├── .env.example                           # Environment variables template
├── README.md                              # Updated documentation
├── tailwind.config.js                     # TailwindCSS v4 configuration
├── postcss.config.js                      # PostCSS configuration
├── src/
│   ├── App.tsx                           # Updated with routing
│   ├── index.css                         # Updated with TailwindCSS import
│   ├── components/
│   │   └── IframeAutoResize.tsx         # Auto-resizing iframe component
│   ├── pages/
│   │   ├── Home.tsx                     # Home page with posts grid
│   │   └── Post.tsx                     # Individual post page
│   ├── types/
│   │   └── database.ts                  # Post interface and types
│   └── utils/
│       └── supabase/
│           └── client.ts                # Supabase client initialization
```

## Dependencies Installed

```json
{
  "dependencies": {
    "react-router-dom": "^6.x",
    "@supabase/supabase-js": "^2.x",
    "tailwindcss": "^4.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

## Key Differences from portal_next

### Framework Changes
- **Next.js → Vite + React**: Changed from server-side rendering to client-side rendering
- **Next.js Routing → React Router**: Changed from file-based routing to declarative routing
- **API Routes → Direct Supabase**: Removed Next.js API routes, now using Supabase client directly

### Code Changes
1. **Imports**:
   - `next/link` → `react-router-dom` Link
   - `next/navigation` → `react-router-dom` hooks
   - Removed Next.js specific imports

2. **Data Fetching**:
   - Server components → Client-side useEffect
   - API routes → Direct Supabase queries
   - Server-side props → Client state management

3. **Routing**:
   - `/app/page.tsx` → `/pages/Home.tsx` (route: `/`)
   - `/app/p/[slug]/page.tsx` → `/pages/Post.tsx` (route: `/p/:slug`)

4. **Environment Variables**:
   - `NEXT_PUBLIC_*` → `VITE_*` prefix

## Configuration Required

Users need to create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Features Preserved

✅ Posts grid layout with dynamic col-span classes
✅ Interactive iframe excerpts with HTML and JavaScript
✅ Auto-resizing iframes using postMessage
✅ Post navigation between pages
✅ Responsive design
✅ TailwindCSS styling
✅ Published posts filtering
✅ Order by index sorting

## Features NOT Migrated (As Requested)

❌ Posts Editor page (`/posts`)
❌ Login page
❌ Dashboard
❌ Authentication
❌ Post creation/editing
❌ Post reordering API
❌ Server-side components
❌ SSR/SSG optimization

## Testing

To test the migration:

1. Navigate to the react directory:
   ```bash
   cd react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with Supabase credentials

4. Start dev server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`

## Next Steps

1. Create a `.env` file with actual Supabase credentials
2. Test the home page loads posts correctly
3. Test clicking on posts navigates to post pages
4. Test iframes resize properly
5. Verify all published posts are displayed
6. Check responsive behavior on mobile/tablet

## Notes

- TailwindCSS v4 is used (newer syntax with `@import "tailwindcss"`)
- React 19 is the version installed
- All TypeScript types are properly defined
- Error handling is included for failed API calls
- Loading states are implemented
