import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://seninsiten.com';

  // Buraya sitendeki URL'leri ekle (dinamik de olabilir)
  const pages = [
    '',
    '/appointment',
  ];

  // Dinamik sitemap içeriğini oluştur
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
