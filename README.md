# cksrblee.github.io

Personal portfolio and blog for Changyu (Chan) Lee, migrated from Notion + oopy to GitHub Pages.

## Adding a New Blog Post

1. Create a Markdown file inside `posts/` (e.g. `posts/2026-11-15-my-note.md`) with YAML frontmatter:

```markdown
---
title: My Post Title
date: 2026-11-15
tags: [ai, spatial-intelligence]
summary: A short one-line summary shown in the blog list.
---

Write your post content here in Markdown...
```

2. Commit and push to `main` (or create/upload the file directly on GitHub Web UI).
3. GitHub Actions (`.github/workflows/deploy-pages.yml`) automatically runs `scripts/generate_posts_index.py` to update `posts/posts.json` and deploys to https://cksrblee.github.io/.

For local preview:

```bash
python scripts/generate_posts_index.py
python -m http.server 8000
```
