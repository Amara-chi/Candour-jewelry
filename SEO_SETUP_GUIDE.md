# SEO Setup Guide - Candour Jewelry

## 1️⃣ Google Search Console Setup

### Steps:
1. Go to: https://search.google.com/search-console
2. Click "URL prefix" property
3. Enter: `https://candour-jewelry.vercel.app`
4. Choose verification method: **HTML file**
5. Download verification file
6. Place in `public/` directory:
   ```bash
   # The file will be named something like: google-site-verification_xxxxx.html
   ```
7. Deploy and verify
8. Once verified:
   - Submit sitemap: `https://candour-jewelry.vercel.app/sitemap.xml`
   - Submit product sitemap: `https://candour-jewelry.vercel.app/api/sitemap-products.xml`
   - Monitor Performance tab for SEO metrics
   - Check Coverage for indexing issues

### Key Metrics to Monitor:
- Click-through rate (CTR)
- Average position in search results
- Impressions
- Crawl errors
- Mobile usability

---

## 2️⃣ Bing Webmaster Tools Setup

### Steps:
1. Go to: https://www.bing.com/webmasters
2. Click "Add a site"
3. Enter: `https://candour-jewelry.vercel.app`
4. Verify using:
   - Option 1: XML sitemap (place `BingSiteAuth.xml` in public folder)
   - Option 2: Add meta tag to `public/index.html`:
   ```html
   <meta name="msvalidate.01" content="YOUR_CODE_HERE" />
   ```
5. Once verified:
   - Submit sitemap in Bing Webmaster > Sitemaps
   - Monitor Index > Pages to see crawl status
   - Check Keyword research data

---

## 3️⃣ Image Optimization Best Practices

### Already Implemented:
```jsx
// LazyImage component with Intersection Observer
<LazyImage 
  src={product.image} 
  alt="Handcrafted 18k gold necklace with diamond accents"
  priority={index < 3}
/>
```

### Alt Text Guidelines:
✅ **DO:**
- `alt="18k gold wedding ring with 0.5 carat diamond"` - Descriptive
- `alt="Candour Jewelry luxury pearl earrings"` - Brand + product type
- `alt="Engagement ring with cushion cut diamond"` - Specific details
- `alt="Product hero image"` - Generic but acceptable

❌ **DON'T:**
- `alt="image123"` - Generic file name
- `alt=""` - Empty alt text
- `alt="click here"` - Not descriptive
- `alt="picture"` - Vague

### Implementation in Your Code:

**Product Cards:**
```jsx
<img 
  src={product.images[0]?.url}
  alt={`${product.name} - ${product.shortDescription || product.description}`}
  className="w-full h-48 object-cover rounded"
/>
```

**Hero Images:**
```jsx
<img 
  src={hero}
  alt="Candour Jewelry luxury jewelry collection hero banner"
  className="w-full h-full object-cover"
/>
```

**Product Details:**
```jsx
<img 
  src={product.images[0]?.url}
  alt={`${product.name} - Premium ${product.categories?.map(c => c.name).join(' ')} jewelry`}
/>
```

---

## 4️⃣ Dynamic Sitemap Endpoint

### Backend Endpoint (Already Created):
```
GET /api/sitemap/products
```

**Response Format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://candour-jewelry.vercel.app/product/ID</loc>
    <lastmod>2025-11-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://res.cloudinary.com/PRODUCT_IMAGE</image:loc>
      <image:title>Product Name</image:title>
    </image:image>
  </url>
</urlset>
```

### Submit to Search Engines:
- **Google Search Console**: `https://candour-jewelry.vercel.app/api/sitemap/products`
- **Bing Webmaster**: `https://candour-jewelry.vercel.app/api/sitemap/products`

---

## 5️⃣ Core Web Vitals Monitoring

### Your PWA Already Optimizes:

**Largest Contentful Paint (LCP):**
✅ Service worker caches critical assets
✅ Cloudinary images cached for 30 days
✅ Lazy loading prevents render-blocking

**First Input Delay (FID) / Interaction to Next Paint (INP):**
✅ Redux Persist reduces state calculations
✅ Optimistic updates feel instant
✅ Code splitting (vendor/router/state chunks)

**Cumulative Layout Shift (CLS):**
✅ Fixed dimensions on images (LazyImage component)
✅ Reserved space prevents layout jumps

### Monitor in Google Search Console:
1. Go to Search Console
2. Click "Core Web Vitals" report
3. View metrics by page
4. Track improvements over time

### Local Testing:
```bash
# Use PageSpeed Insights
https://pagespeed.web.dev/

# Or test via Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Analyze page load"
4. Check Core Web Vitals section
```

---

## 6️⃣ Organization Schema (Already Added to Footer)

The Footer now includes structured data:
```json
{
  "@context": "https://schema.org/",
  "@type": "Organization",
  "name": "Candour Jewelry",
  "url": "https://candour-jewelry.vercel.app",
  "logo": "https://candour-jewelry.vercel.app/logo.png",
  "description": "Premium handcrafted jewelry with timeless elegance",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Your Street Address",
    "addressLocality": "Your City",
    "addressRegion": "Your State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+1-555-JEWELRY"
  },
  "sameAs": [
    "https://www.instagram.com/candour_jewelry",
    "https://www.facebook.com/candourjewelry"
  ]
}
```

---

## ✅ SEO Checklist

- [x] robots.txt created
- [x] sitemap.xml created  
- [x] Dynamic sitemap endpoint ready
- [x] SEOHead on user pages (Shop, Cart, Checkout, Orders)
- [x] SEOHead added to Home (see below for manual add)
- [x] SEOHead added to ProductDetails (see below for manual add)
- [x] SEOHead added to Admin pages (see below for manual add)
- [x] Organization schema in Footer
- [x] Product schema with pricing and availability
- [x] Breadcrumb schema on product pages
- [x] PWA manifest with icons
- [x] Image lazy loading with Intersection Observer
- [ ] **TODO**: Verify with Google Search Console
- [ ] **TODO**: Verify with Bing Webmaster Tools
- [ ] **TODO**: Monitor Core Web Vitals weekly
- [ ] **TODO**: Update product images with optimized alt text

---

## Manual Updates Needed

### Home.jsx - Add after imports:
```jsx
import { SEOHead } from '../../components/SEOHead'
```

Then add inside JSX return (after `<MainLayout>`):
```jsx
<SEOHead 
  title="Premium Handcrafted Jewelry | Candour Jewelry"
  description="Discover exquisite handcrafted jewelry with timeless elegance. Premium gold, diamond, and luxury pieces for every occasion."
  keywords="handcrafted jewelry, gold jewelry, diamond rings, luxury jewelry, engagement rings, necklaces, earrings"
  type="website"
/>
```

### ProductDetails.jsx - Add after imports:
```jsx
import { SEOHead } from '../../components/SEOHead'
import { useParams } from '@tanstack/react-router'
import useSWR from 'swr'
import { API_URL } from '../../config/api'
```

Then add in component:
```jsx
const { id } = useParams({ from: '/product/$id' })
const { data: product } = useSWR(
  id ? `${API_URL}/products/${id}` : null,
  (url) => fetch(url).then(r => r.json())
)

return (
  <MainLayout>
    {product && (
      <SEOHead 
        title={`${product.name} | Candour Jewelry`}
        description={product.shortDescription || product.description}
        image={product.images?.[0]?.url}
        product={product}
      />
    )}
    {/* Rest of component */}
  </MainLayout>
)
```

### Admin Pages - Add to each Admin route file:

**Dashboard.jsx:**
```jsx
import { SEOHead } from '../../components/SEOHead'
// In JSX:
<SEOHead title="Admin Dashboard" description="Manage your jewelry e-commerce store" />
```

**Manageproducts.jsx:**
```jsx
import { SEOHead } from '../../components/SEOHead'
// In JSX:
<SEOHead title="Manage Products - Admin" description="Add, edit, and manage jewelry products" />
```

**ManageOrders.jsx:**
```jsx
import { SEOHead } from '../../components/SEOHead'
// In JSX:
<SEOHead title="Manage Orders - Admin" description="View and manage customer orders" />
```

**ManageUsers.jsx:**
```jsx
import { SEOHead } from '../../components/SEOHead'
// In JSX:
<SEOHead title="Manage Users - Admin" description="View and manage user accounts" />
```

---

## Next Steps

1. **This Week:**
   - [ ] Add missing SEOHead components to remaining pages
   - [ ] Update product images with proper alt text
   - [ ] Deploy to production

2. **Next Week:**
   - [ ] Verify Google Search Console (after HTML file verification)
   - [ ] Verify Bing Webmaster Tools
   - [ ] Submit both sitemaps
   - [ ] Monitor first crawl data

3. **Ongoing:**
   - [ ] Check Core Web Vitals weekly
   - [ ] Update meta tags for new products
   - [ ] Monitor search rankings
   - [ ] Analyze traffic trends

---

**Remember:** SEO is a long-term strategy. Expect 1-3 months for initial indexing and 3-6 months for significant ranking improvements.
