// Shared post loading for Blog and About pages
const postFiles = import.meta.glob('../posts/*.md', { query: '?raw', eager: true });

function parseFrontmatter(markdown) {
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
