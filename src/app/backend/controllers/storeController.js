import Product from "../models/Product.js";

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
