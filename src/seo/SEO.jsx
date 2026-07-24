import { Helmet } from "react-helmet-async";
import { SITE_SEO } from "./siteSEO";

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type,
  noIndex = false,
}) {
  const pageTitle = title
    ? SITE_SEO.titleTemplate.replace("%s", title)
    : SITE_SEO.defaultTitle;

  const pageDescription =
    description || SITE_SEO.defaultDescription;

  const pageKeywords =
    keywords || SITE_SEO.defaultKeywords.join(", ");

  const pageImage =
    image
      ? image.startsWith("http")
        ? image
        : `${SITE_SEO.siteUrl}${image}`
      : `${SITE_SEO.siteUrl}${SITE_SEO.defaultImage}`;

  const canonical =
    url
      ? `${SITE_SEO.siteUrl}${url}`
      : SITE_SEO.siteUrl;

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
        content={SITE_SEO.siteName}
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
