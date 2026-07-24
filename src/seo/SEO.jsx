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

    </Helmet>
  );
}
