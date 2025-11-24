import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Generate dynamic sitemap for products
// @route   GET /api/sitemap/products
// @access  Public
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' })
      .select('_id name images updatedAt');

    const baseUrl = process.env.FRONTEND_URL || 'https://candour-jewelry.vercel.app';
    
    // Build XML sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    products.forEach((product) => {
      const productUrl = `${baseUrl}/product/${product._id}`;
      const lastMod = product.updatedAt.toISOString().split('T')[0];
      
      xml += `
  <url>
    <loc>${productUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;

      // Add images
      if (product.images && product.images.length > 0) {
        product.images.slice(0, 3).forEach((img) => {
          xml += `
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${product.name}</image:title>
    </image:image>`;
        });
      }

      xml += `
  </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate sitemap'
    });
  }
});

export default router;
