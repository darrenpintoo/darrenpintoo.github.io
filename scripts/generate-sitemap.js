import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const postsDir = path.join(root, 'src', 'posts');
const outPath = path.join(root, 'public', 'sitemap.xml');
const baseUrl = 'https://darrenpinto.me';

function parseFrontmatter(content) {
  const match = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) return { date: null };
  const yaml = match[1];
  const metadata = {};
  yaml.split('\n').forEach((line) => {
    const colon = line.indexOf(':');
    if (colon > 0) {
      const key = line.slice(0, colon).trim();
      const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
      metadata[key] = value;
    }
  });
  return metadata;
}

const today = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { loc: `${baseUrl}/`, lastmod: today, changefreq: 'monthly', priority: '1.0' },
  { loc: `${baseUrl}/blog`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
  { loc: `${baseUrl}/courses`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
];

let postUrls = [];
if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  postUrls = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { date } = parseFrontmatter(content);
    const lastmod = date || today;
    return {
      loc: `${baseUrl}/blog/${slug}`,
      lastmod: lastmod.length >= 10 ? lastmod.slice(0, 10) : today,
      changefreq: 'monthly',
      priority: '0.6',
    };
  });
}

const urlEntries = [...staticUrls, ...postUrls]
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

fs.writeFileSync(outPath, xml, 'utf8');
console.log('Generated sitemap at public/sitemap.xml with', staticUrls.length + postUrls.length, 'URLs');
