import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';

// @desc    Get all products with advanced filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      collection,
      status,
      featured,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      inStock
    } = req.query;

    // Build query
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.categories = category;
    }
    
    if (collection) {
      query.collections = collection;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (inStock === 'true') {
      query.$or = [
        { trackQuantity: false },
        { trackQuantity: true, quantity: { $gt: 0 } }
      ];
    }

    const products = await Product.find(query)
      .populate('categories', 'name slug')
      .populate('collections', 'name slug')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    })
    .populate('categories', 'name slug')
    .populate('collections', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create product with Cloudinary image upload
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
      productData.images = await Promise.all(
        req.files.map(async (file, index) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'candour-jewelry/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto' },
              { format: 'webp' }
            ]
          });
          
          return {
            public_id: result.public_id,
            url: result.secure_url,
            alt: productData.name || `Product image ${index + 1}`,
            isPrimary: index === 0
          };
        })
      );
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    // Clean up uploaded images if product creation fails
    if (req.files) {
      await Promise.all(
        req.files.map(file => 
          cloudinary.uploader.destroy(file.filename)
        )
      );
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    let productData = { ...req.body };
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = await Promise.all(
        req.files.map(async (file, index) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'candour-jewelry/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto' },
              { format: 'webp' }
            ]
          });
          
          return {
            public_id: result.public_id,
            url: result.secure_url,
            alt: productData.name || `Product image ${index + 1}`,
            isPrimary: false
          };
        })
      );
      
      productData.images = [...(productData.images || []), ...newImages];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    ).populate('categories', 'name slug')
     .populate('collections', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product and Cloudinary images
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(image =>
          cloudinary.uploader.destroy(image.public_id)
        )
      );
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
export const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const image = product.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Remove from product
    product.images.pull(req.params.imageId);
    await product.save();

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};