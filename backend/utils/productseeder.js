import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Elegant Gold Necklace",
    slug: "elegant-gold-necklace",
    description: "A beautiful handcrafted gold necklace with intricate details. Perfect for special occasions and everyday elegance. Made with 18k gold and premium materials.",
    shortDescription: "Exquisite 18k gold necklace with diamond accents",
    price: 249.99,
    comparePrice: 299.99,
    sku: "GOLD-NECK-001",
    quantity: 15,
    trackQuantity: true,
    categories: [], // Will be populated with jewelry categories
    tags: ["gold", "necklace", "elegant", "luxury", "handmade"],
    status: "active",
    featured: true,
    images: [
      {
        public_id: "sample_necklace_1",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
        alt: "Elegant Gold Necklace",
        isPrimary: true
      }
    ],
    weight: {
      value: 25,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  },
  {
    name: "Diamond Engagement Ring",
    slug: "diamond-engagement-ring",
    description: "Stunning diamond engagement ring with brilliant cut center stone. Symbolizes eternal love and commitment. Crafted with precision and care.",
    shortDescription: "Beautiful diamond engagement ring for your special moment",
    price: 899.99,
    comparePrice: 1099.99,
    sku: "DIAM-RING-001",
    quantity: 8,
    trackQuantity: true,
    categories: [],
    tags: ["diamond", "ring", "engagement", "wedding", "luxury"],
    status: "active",
    featured: true,
    images: [
      {
        public_id: "sample_ring_1",
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
        alt: "Diamond Engagement Ring",
        isPrimary: true
      }
    ],
    weight: {
      value: 8,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  },
  {
    name: "Pearl Drop Earrings",
    slug: "pearl-drop-earrings",
    description: "Elegant pearl drop earrings that add sophistication to any outfit. Features genuine pearls with gold plating. Perfect for formal events.",
    shortDescription: "Classic pearl drop earrings with gold accents",
    price: 129.99,
    comparePrice: 159.99,
    sku: "PEARL-EAR-001",
    quantity: 20,
    trackQuantity: true,
    categories: [],
    tags: ["pearl", "earrings", "elegant", "classic", "formal"],
    status: "active",
    featured: false,
    images: [
      {
        public_id: "sample_earrings_1",
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
        alt: "Pearl Drop Earrings",
        isPrimary: true
      }
    ],
    weight: {
      value: 12,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  },
  {
    name: "Silver Charm Bracelet",
    slug: "silver-charm-bracelet",
    description: "Beautiful sterling silver charm bracelet with customizable options. Each charm tells a unique story. Adjustable length for perfect fit.",
    shortDescription: "Sterling silver charm bracelet with custom charms",
    price: 79.99,
    comparePrice: 99.99,
    sku: "SILVER-BRAC-001",
    quantity: 25,
    trackQuantity: true,
    categories: [],
    tags: ["silver", "bracelet", "charm", "customizable", "adjustable"],
    status: "active",
    featured: false,
    images: [
      {
        public_id: "sample_bracelet_1",
        url: "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?w=500&h=500&fit=crop",
        alt: "Silver Charm Bracelet",
        isPrimary: true
      }
    ],
    weight: {
      value: 35,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  },
  {
    name: "Rose Gold Wedding Band",
    slug: "rose-gold-wedding-band",
    description: "Elegant rose gold wedding band with comfort fit design. Perfect for both men and women. Made with durable and hypoallergenic materials.",
    shortDescription: "Comfort fit rose gold wedding band",
    price: 199.99,
    comparePrice: 249.99,
    sku: "ROSE-BAND-001",
    quantity: 12,
    trackQuantity: true,
    categories: [],
    tags: ["rose-gold", "wedding-band", "unisex", "comfort-fit", "modern"],
    status: "active",
    featured: true,
    images: [
      {
        public_id: "sample_band_1",
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
        alt: "Rose Gold Wedding Band",
        isPrimary: true
      }
    ],
    weight: {
      value: 6,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  },
  {
    name: "Sapphire Pendant Necklace",
    slug: "sapphire-pendant-necklace",
    description: "Stunning blue sapphire pendant necklace on a delicate silver chain. The sapphire is ethically sourced and hand-cut for maximum brilliance.",
    shortDescription: "Ethical blue sapphire pendant on silver chain",
    price: 349.99,
    comparePrice: 399.99,
    sku: "SAPPHIRE-NECK-001",
    quantity: 6,
    trackQuantity: true,
    categories: [],
    tags: ["sapphire", "pendant", "blue", "ethical", "gemstone"],
    status: "active",
    featured: false,
    images: [
      {
        public_id: "sample_pendant_1",
        url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop",
        alt: "Sapphire Pendant Necklace",
        isPrimary: true
      }
    ],
    weight: {
      value: 18,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  },
  {
    name: "Men's Tungsten Ring",
    slug: "mens-tungsten-ring",
    description: "Durable and scratch-resistant tungsten ring with brushed finish. Modern design perfect for everyday wear. Comfortable and lightweight.",
    shortDescription: "Scratch-resistant tungsten ring for men",
    price: 149.99,
    comparePrice: 179.99,
    sku: "TUNGSTEN-RING-001",
    quantity: 18,
    trackQuantity: true,
    categories: [],
    tags: ["tungsten", "mens", "ring", "durable", "scratch-resistant"],
    status: "active",
    featured: false,
    images: [
      {
        public_id: "sample_mens_ring_1",
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
        alt: "Men's Tungsten Ring",
        isPrimary: true
      }
    ],
    weight: {
      value: 10,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  },
  {
    name: "Crystal Stud Earrings",
    slug: "crystal-stud-earrings",
    description: "Sparkling crystal stud earrings that catch the light beautifully. Perfect for adding a touch of elegance to any outfit. Hypoallergenic posts.",
    shortDescription: "Sparkling crystal stud earrings for everyday wear",
    price: 45.99,
    comparePrice: 59.99,
    sku: "CRYSTAL-EAR-001",
    quantity: 30,
    trackQuantity: true,
    categories: [],
    tags: ["crystal", "stud-earrings", "sparkling", "everyday", "hypoallergenic"],
    status: "active",
    featured: false,
    images: [
      {
        public_id: "sample_studs_1",
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
        alt: "Crystal Stud Earrings",
        isPrimary: true
      }
    ],
    weight: {
      value: 4,
      unit: "g"
    },
    vendor: "Candour Jewelry",
    type: "physical"
  }
];

const createCategories = async () => {
  const categories = [
    { name: "Necklaces", slug: "necklaces", description: "Beautiful necklaces for every occasion" },
    { name: "Rings", slug: "rings", description: "Elegant rings including engagement and wedding bands" },
    { name: "Earrings", slug: "earrings", description: "Stunning earrings from studs to drops" },
    { name: "Bracelets", slug: "bracelets", description: "Charming bracelets and bangles" },
    { name: "Men's Jewelry", slug: "mens-jewelry", description: "Jewelry designed specifically for men" }
  ];

  const createdCategories = {};
  
  for (const categoryData of categories) {
    let category = await Category.findOne({ slug: categoryData.slug });
    if (!category) {
      category = await Category.create(categoryData);
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
    createdCategories[category.slug] = category._id;
  }

  return createdCategories;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for product seeding...');

    // Create categories first
    const categories = await createCategories();

    // Assign categories to products
    const productsWithCategories = sampleProducts.map(product => {
      let productCategories = [];
      
      // Assign categories based on product type
      if (product.name.toLowerCase().includes('necklace') || product.name.toLowerCase().includes('pendant')) {
        productCategories.push(categories['necklaces']);
      }
      if (product.name.toLowerCase().includes('ring')) {
        productCategories.push(categories['rings']);
        if (product.name.toLowerCase().includes('men') || product.tags.includes('mens')) {
          productCategories.push(categories['mens-jewelry']);
        }
      }
      if (product.name.toLowerCase().includes('earring')) {
        productCategories.push(categories['earrings']);
      }
      if (product.name.toLowerCase().includes('bracelet')) {
        productCategories.push(categories['bracelets']);
      }
      if (product.tags.includes('mens') && !productCategories.includes(categories['mens-jewelry'])) {
        productCategories.push(categories['mens-jewelry']);
      }

      return {
        ...product,
        categories: productCategories
      };
    });

    // Clear existing products (optional - remove if you want to keep existing data)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');

    // Create products
    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of productsWithCategories) {
      const existingProduct = await Product.findOne({ 
        $or: [
          { slug: productData.slug },
          { sku: productData.sku }
        ]
      });

      if (!existingProduct) {
        await Product.create(productData);
        createdCount++;
        console.log(`Created product: ${productData.name}`);
      } else {
        skippedCount++;
        console.log(`Product already exists: ${productData.name}`);
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Products created: ${createdCount}`);
    console.log(`Products skipped: ${skippedCount}`);
    console.log('Product seeding completed!');

    process.exit();
  } catch (error) {
    console.error('Product seeder error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts();
}

export { seedProducts, sampleProducts };