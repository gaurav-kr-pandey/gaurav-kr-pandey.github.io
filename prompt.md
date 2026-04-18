# Adding Content to the Portfolio

This repository uses a modular, JSON-driven architecture. You **do not** need to edit HTML, CSS, or JavaScript files to add new articles or YouTube videos. 

All content is managed through the `data/articles.json` file. The `content.html` page and the main `index.html` page will automatically read from this JSON file and dynamically generate the UI components matching the existing design language.

## 1. Adding a New Newsletter Article

To add a new article (e.g., from your LinkedIn "Scale to Billions" newsletter), simply append a new object to the `articles` array inside `data/articles.json`.

**Fields:**
- `title`: The title of your article.
- `url`: The direct link to the LinkedIn article.
- `date`: Publication date (e.g., "Jun 2024").
- `readTime`: Estimated read time (e.g., "8 min").
- `description`: A short 1-2 sentence summary of the deep dive.
- `tags`: An array of strings representing topics (e.g., `["System Design", "Databases"]`).
- `featured`: Set to `true` if you want this article to appear on the main `index.html` page. Otherwise, set to `false` and it will only appear on the `content.html` page.

**Example addition:**
```json
{
  "title": "Your New System Design Article",
  "url": "https://www.linkedin.com/pulse/...",
  "date": "Aug 2024",
  "readTime": "10 min",
  "description": "An in-depth look at distributed consensus protocols and how they achieve fault tolerance.",
  "tags": ["Distributed Systems", "Consensus", "Architecture"],
  "featured": true
}
```

## 2. Adding a New YouTube Video

To add a new video from your "Scale to Billions" channel, append a new object to the `videos` array inside `data/articles.json`. 

The system automatically fetches the high-quality YouTube thumbnail using the `id` field.

**Fields:**
- `title`: The title of the YouTube video.
- `url`: The direct link to watch the video on YouTube.
- `id`: The 11-character YouTube Video ID (extracted from `v=...` in the URL).
- `date`: Publication date.
- `duration`: Video length (e.g., "14:20").
- `views`: View count (e.g., "1.2K").

**Example addition:**
```json
{
  "title": "System Design: Consistent Hashing Explained",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "id": "dQw4w9WgXcQ",
  "date": "Sep 2024",
  "duration": "18:45",
  "views": "2.5K"
}
```

## How It Works

Once you save the `data/articles.json` file:
1. The **Main Page** (`index.html`) will display any articles marked `"featured": true` up to a maximum defined in the layout, and will update the "View All" count button.
2. The **Content Hub** (`content.html`) will automatically render the new articles and videos in their respective tabs, injecting the correct glassmorphism styling, hover effects, and scroll-reveal animations.

No build step is required. Just commit the updated JSON file!
