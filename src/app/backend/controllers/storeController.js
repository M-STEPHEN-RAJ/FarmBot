import Product from "../models/Product.js";

// Add a new product
export const createProduct = async (body) => {
  const {
    name,
    description,
    category,
    type,
    price,
    unit,
    stock,
    image,
    popularity,
    rating,
    reviewCount,
    reviews
  } = body;

  if (!name || !category || !type || !price) {
    throw new Error("Missing required fields");
  }

  const newProduct = new Product({
    name,
    description,
    category,
    type,
    price,
    unit,
    stock: stock || 0,
    image,
    popularity: popularity || 0,
    rating: rating || 0,
    reviewCount: reviewCount || 0,
    reviews: reviews || []
  });

  const savedProduct = await newProduct.save();
  return savedProduct;
};

// Fetch Products
export const getProducts = async (query) => {
  const {
    category,
    type,
    minPrice,
    maxPrice,
    sort,
    search,
    inStock,
    outOfStock,
    rating
  } = query;

  const filter = {};

  // Category
  if (category) filter.category = category;

  // Type
  if (type) filter.type = type;

  // Search
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // Price
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Availability
  if (inStock === "true") {
    filter.stock = { $gt: 0 };
  } else if (outOfStock === "true") {
    filter.stock = 0;
  }

  // Rating
  if (rating && Number(rating) > 0) {
    filter.rating = { $gte: Number(rating) };
  }

  // Sorting
  let sortOption = {};
  if (sort === "popularity") sortOption = { popularity: -1 };
  else if (sort === "price_low") sortOption = { price: 1 };
  else if (sort === "price_high") sortOption = { price: -1 };
  else if (sort === "newest") sortOption = { createdAt: -1 };
  else sortOption = { popularity: -1 };

  return await Product.find(filter).sort(sortOption);
};

// Get product by ID
export const getProductById = async (id) => {
  if (!id) {
    throw new Error("Product ID is required!");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found!");
  }

  return product;
};