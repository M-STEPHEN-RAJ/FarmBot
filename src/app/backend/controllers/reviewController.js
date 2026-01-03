import Product from "../models/Product.js";

// Add review
export const addReview = async ({
  productId,
  userId,
  userName,
  userAvatar,
  rating,
  comment,
  images,
}) => {
  if (!rating) {
    throw new Error("Rating is required!");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found!");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.userId.toString() === userId.toString()
  );

  if (alreadyReviewed) {
    throw new Error("You have already reviewed this product!");
  }

  const review = {
    userId,
    userName,
    userAvatar,
    rating,
    comment,
    images: images || [],
    isVerifiedPurchase: false,
  };

  product.reviews.push(review);

  const totalRating = product.reviews.reduce(
    (sum, r) => sum + r.rating,
    0
  );

  product.reviewCount = product.reviews.length;
  product.rating = Number(
    (totalRating / product.reviewCount).toFixed(1)
  );

  await product.save();

  return {
    review: product.reviews[product.reviews.length - 1],
    rating: product.rating,
    reviewCount: product.reviewCount,
  };
};

// Edit review
export const updateReview = async ({ productId, reviewId, userId, rating, comment, images }) => {
  if (!productId || !reviewId) {
    throw new Error("Product ID and Review ID are required!");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found!");
  }

  const reviewIndex = product.reviews.findIndex(
    (r) => r._id.toString() === reviewId.toString()
  );

  if (reviewIndex === -1) {
    throw new Error("Review not found!");
  }

  const review = product.reviews[reviewIndex];
  if (review.userId.toString() !== userId.toString()) {
    const err = new Error("You are not authorized to edit this review!");
    err.status = 403;
    throw err;
  }

  if (rating) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  if (images) review.images = images;

  review.isEdited = true;
  review.updatedAt = new Date();

  const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = Number((totalRating / product.reviews.length).toFixed(1));

  await product.save();

  return {
    review,
    rating: product.rating,
    reviewCount: product.reviews.length,
  };
};

// Delete review
export const deleteReview = async ({ productId, reviewId, userId }) => {
  if (!productId || !reviewId) {
    throw new Error("Product ID and Review ID are required!");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found!");
  }

  const reviewIndex = product.reviews.findIndex(
    (r) => r._id.toString() === reviewId.toString()
  );

  if (reviewIndex === -1) {
    throw new Error("Review not found!");
  }

  const review = product.reviews[reviewIndex];
  if (review.userId.toString() !== userId.toString()) {
    const err = new Error("You are not authorized to delete this review!");
    err.status = 403;
    throw err;
  }

  product.reviews.splice(reviewIndex, 1);

  product.reviewCount = product.reviews.length;
  if (product.reviewCount > 0) {
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((totalRating / product.reviewCount).toFixed(1));
  } else {
    product.rating = 0;
  }

  await product.save();

  return {
    rating: product.rating,
    reviewCount: product.reviewCount,
  };
};
