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

export function getAllPosts() {
  return Object.entries(postFiles)
    .map(([path, module]) => {
      const fileName = path.split('/').pop().replace('.md', '');
      const { metadata } = parseFrontmatter(module.default);
      return {
        slug: fileName,
        title: metadata.title || 'Untitled Post',
        date: metadata.date || 'Unknown Date',
        category: metadata.category || 'General',
        excerpt: metadata.excerpt || '',
        image: metadata.image || '/blog-placeholder.png',
        content: module.default,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getLatestPost() {
  const posts = getAllPosts();
  return posts.length > 0 ? posts[0] : null;
}
