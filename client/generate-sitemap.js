import { writeFileSync, existsSync } from 'fs';
import { blogPosts } from './src/data/blogPosts.js';

const BASE_URL = 'https://coachtowork.io';
const TODAY = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/',          changefreq: 'weekly',  priority: '1.0' },
  { path: '/faq',       changefreq: 'monthly', priority: '0.7' },
  { path: '/terminos',  changefreq: 'yearly',  priority: '0.3' },
  { path: '/privacidad',changefreq: 'yearly',  priority: '0.3' },
];

const blogRoutes = blogPosts.map(post => ({
  path: `/blog/${post.slug}`,
  changefreq: 'monthly',
  priority: '0.8',
}));

const allRoutes = [...staticRoutes, ...blogRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
console.log(`✓ Sitemap generado con ${allRoutes.length} URLs → public/sitemap.xml`);

const robotsPath = 'public/robots.txt';
if (!existsSync(robotsPath)) {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${BASE_URL}/sitemap.xml
`;
  writeFileSync(robotsPath, robots);
  console.log('✓ robots.txt creado → public/robots.txt');
}
