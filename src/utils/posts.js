// Shared post loading for Blog and About pages
const postFiles = import.meta.glob('../posts/*.md', { query: '?raw', eager: true });

// Format ISO date to human-readable (e.g. "Feb 22, 2026").
// Bare YYYY-MM-DD strings are parsed as UTC midnight by new Date(), which
// renders as the previous day in US timezones — parse as local time instead.
export function formatDate(isoDate) {
  if (!isoDate || isoDate === 'Unknown Date') return isoDate;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(isoDate)
    ? new Date(`${isoDate}T00:00:00`)
    : new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Readout format for the mono metadata layer: "2026-02-22" → "2026.02.22",
// or "2026.02" when only the month is wanted (or available).
export function logDate(isoDate, full = false) {
  if (!isoDate) return '';
  const m = String(isoDate).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return isoDate;
  return full && m[3] ? `${m[1]}.${m[2]}.${m[3]}` : `${m[1]}.${m[2]}`;
}

export function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) return { metadata: {}, content: markdown };

  const yamlStr = match[1];
  const content = match[2];
  const metadata = {};

  yamlStr.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      metadata[key.trim()] = value;
    }
  });

  return { metadata, content };
}

function toPost(path, module) {
  const fileName = path.split('/').pop().replace('.md', '');
  const { metadata } = parseFrontmatter(module.default);
  return {
    slug: fileName,
    title: metadata.title || 'Untitled Post',
    date: metadata.date || 'Unknown Date',
    category: metadata.category || 'General',
    excerpt: metadata.excerpt || '',
    image: metadata.image || '/blog-placeholder.png',
    draft: metadata.draft === 'true',
    content: module.default,
  };
}

export function getAllPosts() {
  return Object.entries(postFiles)
    .map(([path, module]) => toPost(path, module))
    // draft: true in frontmatter hides a post from the list, the latest-post
    // card, and the sitemap; getPostBySlug still resolves it for previewing
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Slug lookup that ignores the draft filter, so /blog/<slug> works as a
// preview URL for unpublished posts
export function getPostBySlug(slug) {
  const entry = Object.entries(postFiles).find(
    ([path]) => path.split('/').pop().replace('.md', '') === slug
  );
  return entry ? toPost(entry[0], entry[1]) : null;
}

export function getLatestPost() {
  const posts = getAllPosts();
  return posts.length > 0 ? posts[0] : null;
}
