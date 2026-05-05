import { Router } from "express";
import { db } from "@workspace/db";
import { menusTable, blogPostsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const districtSlugs = [
  "com-van-phong-quan-1",
  "com-van-phong-quan-3",
  "com-van-phong-binh-thanh",
  "com-van-phong-go-vap",
  "com-van-phong-thu-duc",
  "com-van-phong-tan-binh",
  "com-van-phong-binh-duong",
  "com-van-phong-dong-nai",
];

const staticRoutes = [
  "/",
  "/menus",
  "/blog",
  "/about",
  "/contact",
  "/com-van-phong",
  "/com-van-phong-tphcm",
  "/com-van-phong-binh-duong",
  "/dat-tiec-cong-ty",
  "/suat-an-cong-nghiep",
  "/dich-vu-nau-an-su-kien",
  ...districtSlugs.map((s) => `/${s}`),
];

router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = process.env["SITE_URL"] ?? "https://belugacatering.vn";

    const [menus, posts] = await Promise.all([
      db.select({ slug: menusTable.slug }).from(menusTable).where(eq(menusTable.is_active, true)),
      db.select({ slug: blogPostsTable.slug }).from(blogPostsTable).where(eq(blogPostsTable.is_published, true)),
    ]);

    const urls = [
      ...staticRoutes.map((path) => ({
        loc: `${baseUrl}${path}`,
        changefreq: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? "1.0" : "0.8",
      })),
      ...menus.map((m) => ({
        loc: `${baseUrl}/menus/${m.slug}`,
        changefreq: "weekly",
        priority: "0.7",
      })),
      ...posts.map((p) => ({
        loc: `${baseUrl}/blog/${p.slug}`,
        changefreq: "monthly",
        priority: "0.6",
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    req.log?.error(err);
    res.status(500).send("Error generating sitemap");
  }
});

router.get("/robots.txt", (_req, res) => {
  const baseUrl = process.env["SITE_URL"] ?? "https://belugacatering.vn";
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/api/sitemap.xml
`);
});

router.get("/og/menu/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [menu] = await db
      .select({ name: menusTable.name, price_per_person: menusTable.price_per_person, tag: menusTable.tag, image_url: menusTable.image_url })
      .from(menusTable)
      .where(eq(menusTable.slug, slug))
      .limit(1);

    if (!menu) { res.status(404).send("Not found"); return; }

    const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#C8392B"/>
      <stop offset="100%" style="stop-color:#8B1A12"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="630" fill="#1A1A1A" opacity="0.15"/>
  <text x="60" y="120" font-family="Georgia,serif" font-size="48" font-weight="bold" fill="#F5A623">BELUGA</text>
  <text x="60" y="160" font-family="Georgia,serif" font-size="20" fill="rgba(255,255,255,0.7)">Catering Cao Cấp · TP.HCM</text>
  <text x="60" y="300" font-family="Georgia,serif" font-size="64" font-weight="bold" fill="white" text-anchor="start">
    ${menu.name.length > 25 ? menu.name.substring(0, 25) + "..." : menu.name}
  </text>
  ${menu.tag ? `<rect x="60" y="330" width="${menu.tag.length * 16 + 30}" height="44" rx="22" fill="#F5A623" opacity="0.9"/>
  <text x="${60 + (menu.tag.length * 16 + 30) / 2}" y="358" font-family="Georgia,serif" font-size="18" fill="#1A1A1A" font-weight="bold" text-anchor="middle">${menu.tag}</text>` : ""}
  <text x="60" y="440" font-family="Georgia,serif" font-size="48" font-weight="bold" fill="#F5A623">
    ${menu.price_per_person.toLocaleString("vi-VN")}đ / người
  </text>
  <rect x="0" y="580" width="1200" height="50" fill="rgba(0,0,0,0.3)"/>
  <text x="60" y="613" font-family="Georgia,serif" font-size="18" fill="rgba(255,255,255,0.7)">belugacatering.vn · 0909 123 456</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(svg);
  } catch (err) {
    req.log?.error(err);
    res.status(500).send("Error generating OG image");
  }
});

router.get("/og/blog/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [post] = await db
      .select({ title: blogPostsTable.title, category: blogPostsTable.category, excerpt: blogPostsTable.excerpt })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug))
      .limit(1);

    if (!post) { res.status(404).send("Not found"); return; }

    const categoryLabel = post.category?.replace(/-/g, " ").toUpperCase() ?? "BLOG";

    const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A1A1A"/>
      <stop offset="100%" style="stop-color:#2D2D2D"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="180" height="44" rx="8" fill="#C8392B"/>
  <text x="150" y="88" font-family="Georgia,serif" font-size="16" fill="white" font-weight="bold" text-anchor="middle">${categoryLabel}</text>
  <text x="60" y="190" font-family="Georgia,serif" font-size="52" font-weight="bold" fill="white">
    ${post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title}
  </text>
  ${post.excerpt ? `<text x="60" y="270" font-family="Georgia,serif" font-size="24" fill="rgba(255,255,255,0.6)" >
    ${post.excerpt.length > 60 ? post.excerpt.substring(0, 60) + "..." : post.excerpt}
  </text>` : ""}
  <text x="60" y="560" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#F5A623">BELUGA Catering</text>
  <text x="60" y="600" font-family="Georgia,serif" font-size="18" fill="rgba(255,255,255,0.5)">belugacatering.vn</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(svg);
  } catch (err) {
    req.log?.error(err);
    res.status(500).send("Error generating OG image");
  }
});

export default router;
