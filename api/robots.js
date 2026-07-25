import { db } from "./firebaseAdmin.js";

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

    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Cache-Control",
      "public, max-age=3600, s-maxage=3600"
    );

    res.status(200).send(`User-agent: *

Allow: /

Disallow: /admin/
Disallow: /profile/
Disallow: /login
Disallow: /register
Disallow: /checkout
Disallow: /cart
Disallow: /wishlist

Sitemap: ${site}/sitemap.xml`);
  } catch (error) {
    console.error(error);

    res.status(500).send("Failed to generate robots.txt");
  }
}
