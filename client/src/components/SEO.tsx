import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

const DEFAULT_TITLE = "Trader Foundation | Sell Options. Collect the Premium Up Front.";
const DEFAULT_DESCRIPTION = "Trader Foundation teaches professionals with capital to sell options and collect premium up front, with a coach beside them the whole way.";
const BASE_URL = "https://www.traderfoundation.com";
const OG_IMAGE = `${BASE_URL}/images/og-webinar.png`;

export default function SEO({ title, description, path = "/" }: SEOProps) {
  const fullTitle = title ? `${title} | Trader Foundation` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const fullUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}
