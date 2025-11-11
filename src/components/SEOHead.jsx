import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  product 
}) => {
  const siteName = "Candour's Jewelry";
  const defaultDescription = "Discover exquisite handcrafted jewelry with timeless elegance. Premium quality pieces for every occasion.";
  const defaultImage = "/images/og-image.jpg";
  
  const seoTitle = title ? `${title} | ${siteName}` : siteName;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || window.location.href;

  // Structured data for products
  const structuredData = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images?.map(img => img.url) || [],
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: siteName
    },
    offers: {
      '@type': 'Offer',
      url: seoUrl,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock ? 
        'https://schema.org/InStock' : 
        'https://schema.org/OutOfStock',
      ...(product.comparePrice && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
    },
    ...(product.reviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.reviews.averageRating,
        reviewCount: product.reviews.count
      }
    })
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional Product Schema */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: window.location.origin
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Shop',
                item: `${window.location.origin}/shop`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: seoUrl
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};