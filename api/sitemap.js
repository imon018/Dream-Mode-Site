import { db } from "./firebaseAdmin";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrl({
  loc,
  lastmod,
  changefreq = "weekly",
  priority = "0.8",
}) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    ${
      lastmod
        ? `<lastmod>${lastmod}</lastmod>`
        : ""
    }
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(req, res) {
  try {
    const settingsSnap = await db
      .collection("settings")
      .doc("store")
      .get();

    const settings = settingsSnap.data() || {};

    const site = (
      settings.websiteUrl ||
      "https://dream-mode.shop"
    ).replace(/\/$/, "");

    const urls = [];

    urls.push(
      buildUrl({
        loc: site,
        priority: "1.0",
        changefreq: "daily",
      })
    );

    const staticPages = [
      "/shop",
      "/products",
      "/categories",
      "/about",
      "/contact",
      "/about-us",
      "/faqs",
      "/page/returnpolicy",
      "/page/refundpolicy",
      "/page/shippingpolicy",
      "/page/privacypolicy",
      "/page/terms",
    ];

    staticPages.forEach((page) => {
      urls.push(
        buildUrl({
          loc: `${site}${page}`,
          priority: "0.8",
          changefreq: "weekly",
        })
      );
    });



      // ============================
    // Products
    // ============================

    const productsSnap = await db
      .collection("products")
      .get();

    productsSnap.forEach((doc) => {
      const data = doc.data();

      let lastmod = "";

      if (data.updatedAt?.toDate) {
        lastmod = data.updatedAt
          .toDate()
          .toISOString();
      } else if (data.createdAt?.toDate) {
        lastmod = data.createdAt
          .toDate()
          .toISOString();
      }

      urls.push(
        buildUrl({
          loc: `${site}/product/${doc.id}`,
          lastmod,
          priority: "0.9",
          changefreq: "daily",
        })
      );
    });

    // ============================
    // Published Landing Pages
    // ============================

    const landingSnap = await db
      .collection("landingPages")
      .where("status", "==", "published")
      .get();



      landingSnap.forEach((doc) => {
      const data = doc.data();

      if (!data.slug) return;

      let lastmod = "";

      if (data.updatedAt?.toDate) {
        lastmod = data.updatedAt
          .toDate()
          .toISOString();
      } else if (data.createdAt?.toDate) {
        lastmod = data.createdAt
          .toDate()
          .toISOString();
      }

      urls.push(
        buildUrl({
          loc: `${site}/landing/${data.slug}`,
          lastmod,
          priority: "0.9",
          changefreq: "weekly",
        })
      );
    });

    // ============================
    // XML
    // ============================

    const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}

</urlset>`;



      res.setHeader(
      "Content-Type",
      "application/xml; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=3600, s-maxage=3600"
    );

    return res.status(200).send(xml);

  } catch (error) {

    console.error("Sitemap Error:", error);

    return res
      .status(500)
      .type("text/plain")
      .send("Failed to generate sitemap.");

  }
}
