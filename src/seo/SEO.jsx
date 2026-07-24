import { Helmet } from "react-helmet-async";
import { SITE_SEO } from "./siteSEO";
import { useSettings } from "../context/SettingsContext";

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type,
  noIndex = false,
  product,
}) {

  const { settings } = useSettings();

const siteName =
  settings.storeName || "";

const siteUrl = (
  settings.websiteUrl ||
  SITE_SEO.siteUrl
).replace(/\/$/, "");
  
const siteLogo =
  settings.seoImage ||
  settings.logoUrl ||
  SITE_SEO.defaultImage;
  
  const pageTitle = title
  ? `${title} | ${siteName}`
  : `${siteName} | Dress Your Dream Live Your Style Online Shopping`;
  const pageDescription =
    description || SITE_SEO.defaultDescription;

  const pageKeywords =
    keywords || SITE_SEO.defaultKeywords.join(", ");

  const pageImage =
  image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : siteLogo.startsWith("http")
      ? siteLogo
      : `${siteUrl}${siteLogo}`;

  const canonical =
  url
    ? `${siteUrl}${url}`
    : siteUrl;

  const structuredData = {
  "@context": "https://schema.org",
  "@type": "Store",

  name: siteName,

  url: siteUrl,

  logo: pageImage,

  image: pageImage,

  description: pageDescription,

  telephone: settings.phone || "",

  email: settings.email || "",

  address: {
    "@type": "PostalAddress",

    streetAddress: settings.address || "",

    addressCountry: "BD",
  },

  sameAs: [
    settings.facebook,
    settings.instagram,
    settings.youtube,
    settings.tiktok,
    settings.linkedin,
  ].filter(Boolean),
};



    const schemaData =
  type === "product" && product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",

        name: product.name,

        description:
          product.description || "",

        image:
          product.images?.length
            ? product.images
            : [product.image],

        sku: product.id,

        brand: {
          "@type": "Brand",
          name: siteName,
        },

        offers: {
          "@type": "Offer",

          priceCurrency: "BDT",

          price: product.price,

          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",

          url: canonical,
        },
      }
    : structuredData;

  

  return (
    <Helmet>

      <title>{pageTitle}</title>

      <meta
        name="description"
        content={pageDescription}
      />

      <meta
        name="keywords"
        content={pageKeywords}
      />

      <meta
        name="robots"
        content={
          noIndex
            ? "noindex,nofollow"
            : "index,follow"
        }
      />

      <link
        rel="canonical"
        href={canonical}
      />

      <meta
        property="og:type"
        content={type || SITE_SEO.type}
      />

      <meta
  property="og:site_name"
  content={siteName}
/>

      <meta
        property="og:title"
        content={pageTitle}
      />

      <meta
        property="og:description"
        content={pageDescription}
      />

      <meta
        property="og:image"
        content={pageImage}
      />

      <meta
        property="og:url"
        content={canonical}
      />

      <meta
        property="og:locale"
        content={SITE_SEO.locale}
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={pageTitle}
      />

      <meta
        name="twitter:description"
        content={pageDescription}
      />

      <meta
        name="twitter:image"
        content={pageImage}
      />

        <meta
  name="google-site-verification"
  content={settings.googleVerification || ""}
/>

<script type="application/ld+json">
  {JSON.stringify(schemaData)}
</script>

    </Helmet>
  );
}
