import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

const DEFAULT_TITLE = "Trader Foundation Academy | Learn to Trade Stocks & Options";
const DEFAULT_DESCRIPTION = "Trader Foundation Academy offers 1-on-1 coaching to help you master stock and options trading. Join our proven program and take control of your financial future.";
const BASE_URL = "https://www.trader.foundation";
const OG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/og-image-Vm8L9DUch2DG3CZtK7LqeC.png";

export default function SEO({ title, description, path = "/" }: SEOProps) {
  const fullTitle = title ? `${title} | Trader Foundation Academy` : DEFAULT_TITLE;
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
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}
