import Product from "../models/Product.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, images } = req.body;

    const userId = req.user._id;
    const userName = req.user.name;
    const userAvatar = req.user.avatar;

    if (!rating) {
      return res.status(400).json({
        message: "Rating is required!",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this product!",
      });
    }

    const review = {
      userId,
      userName,
      userAvatar,
      rating,
      comment: comment || "",
      images: images || [],
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

    return res.status(201).json({
      message: "Review added successfully!",
      review: product.reviews[product.reviews.length - 1],
      rating: product.rating,
      reviewCount: product.reviewCount,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({
      message: "Failed to add review",
    });
  }
};
