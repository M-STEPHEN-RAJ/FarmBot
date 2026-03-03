"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import ReviewModal from "@/app/components/user/store/Modal/ReviewModal";
import Loading from "@/app/components/common/Loading";

const ProductDetails = () => {
  const menuRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [quantity, setQuantity] = useState(1);

  const [currentUser, setCurrentUser] = useState(null);
  const [reviewSort, setReviewSort] = useState("Top");
  const [filterRating, setFilterRating] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/me`, { withCredentials: true });
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/store/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // Add to Cart
  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    try {
      const res = await axios.post(
        `${API}/cart`,
        { productId: product._id, quantity },
        { withCredentials: true },
      );

      toast.success("Added to cart!");
      console.log("Cart updated:", res.data.cart);
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${API}/store/review/${id}/${reviewId}`, {
        withCredentials: true,
      });

      toast.success("Review deleted successfully!");
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete review!");
    }
  };

  const handleSubmitReview = async (formData) => {
    try {
      if (editingReview) {
        await axios.patch(
          `${API}/store/review/${id}/${editingReview._id}`,
          formData,
          { withCredentials: true },
        );

        toast.success("Review updated successfully!");
      } else {
        await axios.post(`${API}/store/review/${id}`, formData, {
          withCredentials: true,
        });

        toast.success("Review submitted successfully!");
      }

      setShowModal(false);
      setEditingReview(null);
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review!");
    }
  };

  const handleReact = async (reviewId, type) => {
    if (!currentUser) {
      toast.error("Please login to react to reviews!");
      return;
    }

    setProduct((prev) => {
      const updatedReviews = prev.reviews.map((review) => {
        if (review._id !== reviewId) return review;

        let likes = Array.isArray(review.likes) ? [...review.likes] : [];
        let dislikes = Array.isArray(review.dislikes)
          ? [...review.dislikes]
          : [];

        if (type === "like") {
          if (likes.includes(currentUser._id)) {
            likes = likes.filter((id) => id !== currentUser._id);
          } else {
            likes.push(currentUser._id);
            dislikes = dislikes.filter((id) => id !== currentUser._id);
          }
        } else if (type === "dislike") {
          if (dislikes.includes(currentUser._id)) {
            dislikes = dislikes.filter((id) => id !== currentUser._id);
          } else {
            dislikes.push(currentUser._id);
            likes = likes.filter((id) => id !== currentUser._id);
          }
        }

        return { ...review, likes, dislikes };
      });

      return { ...prev, reviews: updatedReviews };
    });

    try {
      await axios.post(
        `${API}/store/review/${id}/${reviewId}/react`,
        { type },
        { withCredentials: true },
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to react!");
      fetchProduct();
    }
  };

  const handleReport = async (reviewId) => {
    if (!currentUser) {
      toast.error("Please login to report reviews!");
      return;
    }

    try {
      await axios.post(
        `${API}/store/review/${id}/${reviewId}/report`,
        {},
        { withCredentials: true },
      );

      toast.success("Review reported!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to report review!");
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowModal(true);
    setActiveMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full max-w-[1150px] flex flex-col pr-4 py-4">
      <div className="w-full flex items-start mt-3">
        <div
          onClick={() => router.push("/user/store")}
          className="rounded-full p-2 hover:bg-gray-200 cursor-pointer"
        >
          <img className="w-5" src="/images/user/store/back.png" alt="" />
        </div>
      </div>
      <div className="w-full grid grid-cols-[2fr_3fr_1.5fr] gap-6">
        <div className="sticky top-16 h-[350px]">
          <img src={product.image} alt="" />
        </div>
        <div className="space-y-5">
          <div className="border-b border-gray-300 pb-2">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-500 text-lg font-medium">{product.type}</p>

            <div className="flex items-center gap-2">
              <p className="text-lg font-medium mt-1">{product.rating}</p>
              <div className="flex gap-0">
                {[1, 2, 3, 4, 5].map((num) => (
                  <img
                    key={num}
                    src={
                      num <= product.rating
                        ? "/images/user/store/star-active.png"
                        : "/images/user/store/star.png"
                    }
                    className="w-6"
                    alt=""
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm mt-1">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="">
            <div className="flex gap-4">
              <p className="text-red-600 text-xl mt-1">-10%</p>
              <p className="text-3xl font-medium flex items-start gap-1">
                <span className="text-sm font-normal mt-[1.8px]">₹</span>
                {product.price}.00
                <span className="text-gray-600 text-sm mt-[9px]">
                  /{product.unit}
                </span>
              </p>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              M.R.P:{" "}
              <span className="line-through">
                ₹{Math.round(product.price / (1 - 10 / 100))}.00
              </span>
            </p>

            <p className="text-sm mt-3">Inclusive of all taxes</p>
          </div>

          <div className="flex gap-8 border-b border-gray-300 pb-3">
            <div className="flex flex-col justify-center items-center gap-1.5">
              <div className="bg-gray-100 p-2 rounded-full">
                <img
                  className="w-6.5"
                  src="/images/user/store/cash-on-delivery.png"
                  alt=""
                />
              </div>
              <p className="text-xs text-center">
                Pay on <br />
                Delivery
              </p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1.5">
              <div className="bg-gray-100 p-2 rounded-full">
                <img
                  className="w-6.5"
                  src="/images/user/store/top-brands.png"
                  alt=""
                />
              </div>
              <p className="text-xs text-center">
                Top <br />
                Brand
              </p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1.5">
              <div className="bg-gray-100 p-2 rounded-full">
                <img
                  className="w-6.5"
                  src="/images/user/store/secure.png"
                  alt=""
                />
              </div>
              <p className="text-xs text-center">
                Secure <br />
                Transaction
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">About this Item</h2>
            <p className="text-sm">{product.description}</p>
          </div>
        </div>
        <div className="sticky top-20 h-[350px] flex flex-col justify-between border border-gray-300 p-4 rounded-lg">
          <div className="">
            <p className="text-2xl font-medium flex items-start gap-1">
              <span className="text-sm font-normal mt-[1.8px]">₹</span>
              {product.price * quantity}.00
              <span className="text-gray-600 text-sm mt-1.5">
                /{product.unit}
              </span>
            </p>
            {product.price * quantity >= 499 ? (
              <p className="text-sm font-medium">FREE Delivery</p>
            ) : (
              <p className="text-sm font-medium">+ ₹40 Delivery Fee</p>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <img className="w-4" src="/images/user/store/location.png" alt="" />
            <p className="w-40 text-sm truncate hover:underline">
              902, MiddleStreet, Chinnammalpuram, Dhalapathysamudram.
            </p>
          </div>

          <p
            className={`text-md font-medium ${
              product.stock > 0 ? "text-[#166831]" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `In stock` : "Out of stock"}
          </p>

          <div className="grid grid-cols-[max-content_1fr] text-xs text-gray-500 gap-y-1.5 gap-x-3">
            <span className="font-medium">Sold by</span>
            <span>FarmBot</span>

            <span className="font-medium">Payment</span>
            <span>Secure Transaction</span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 font-medium">Quantity</p>
              <div className="w-[100px] flex justify-between items-center">
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="flex justify-center items-center h-5 w-5 text-xl font-medium text-red-500 bg-red-100 rounded cursor-pointer"
                >
                  −
                </button>
                <p className="w-5 text-center">{quantity}</p>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex justify-center items-center h-5 w-5 text-xl font-medium text-green-500 bg-green-100 rounded cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="text-white bg-[#166831] rounded-md py-1 px-4 cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                disabled={product.stock === 0}
                className="text-white bg-green-600 rounded-md py-1 px-4 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-[2fr_4.5fr] gap-4 border-t border-gray-300 mt-5">
        <div className="sticky top-0 h-100 space-y-3 pt-5 mb-10">
          <h2 className="text-lg font-medium">Customer Reviews</h2>

          <div className="space-y-1">
            <div className="flex gap-3">
              <div className="flex gap-0">
                {[1, 2, 3, 4, 5].map((num) => (
                  <img
                    key={num}
                    src={
                      num <= product.rating
                        ? "/images/user/store/star-active.png"
                        : "/images/user/store/star.png"
                    }
                    className="w-5 h-5"
                    alt=""
                  />
                ))}
              </div>

              <p className="font-medium">{product.rating} out of 5</p>
            </div>
            <p className="text-gray-600 text-sm">
              {product.reviewCount} global ratings
            </p>
          </div>

          <div className="space-y-2">
            {(() => {
              const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
                star,
                count: product.reviews.filter(
                  (r) => Math.round(r.rating) === star,
                ).length,
              }));

              return ratingCounts.map(({ star, count }) => (
                <div
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <p className="font-medium">{star}</p>

                  <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-4 bg-[#166831] rounded"
                      style={{
                        width: `${
                          product.reviewCount > 0
                            ? (count / product.reviewCount) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <span className="w-13 text-xs font-medium text-[#166831]">
                    {product.reviewCount > 0
                      ? ((count / product.reviewCount) * 100).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              ));
            })()}
            {filterRating === null ? (
              <p></p>
            ) : (
              <div
                className="w-fit px-4 py-0.5 text-center text-sm text-red-600 border border-red-600 rounded-md cursor-pointer mx-auto mt-5"
                onClick={() => setFilterRating(null)}
              >
                Clear Filter
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 w-[95%] my-5"></div>

          <h2 className="text-lg font-medium">Review this product</h2>

          <div className="space-y-5">
            <p className="text-sm ">Share your thoughts with other customers</p>
            <button
              onClick={() => {
                if (!currentUser) {
                  toast.error("Please login to write a review!");
                  return;
                }
                setShowModal(true);
              }}
              className="w-[95%] py-2 text-sm font-medium text-white bg-[#166831] rounded-md cursor-pointer"
            >
              Write a Product Review
            </button>
          </div>
        </div>
        <div className="space-y-5">
          <div className="sticky top-0 bg-white space-y-5 py-5">
            <h2 className="text-lg font-medium">Customer Says</h2>

            <div className="flex gap-3">
              <div
                onClick={() => {
                  setReviewSort("Top");
                }}
                className={`w-20 py-1 text-center text-sm font-medium ${
                  reviewSort === "Top"
                    ? "bg-[#166831] text-white"
                    : "border border-[#166831] text-[#166831]"
                } rounded-md cursor-pointer`}
              >
                Top
              </div>
              <div
                onClick={() => {
                  setReviewSort("New");
                }}
                className={`w-20 py-1 text-center text-sm font-medium ${
                  reviewSort === "New"
                    ? "bg-[#166831] text-white"
                    : "border border-[#166831] text-[#166831]"
                } rounded-md cursor-pointer`}
              >
                Newest
              </div>
            </div>
          </div>

          {product.reviews.length === 0 ? (
            <div className="w-full h-45 flex justify-center items-center">
              <p className="text-center text-gray-500">No reviews yet</p>
            </div>
          ) : (
            <>
              {[...product.reviews]
                .filter((review) =>
                  filterRating
                    ? Math.round(review.rating) === filterRating
                    : true,
                )
                .sort((a, b) => {
                  if (reviewSort === "Top") {
                    return b.likes.length - a.likes.length;
                  } else if (reviewSort === "New") {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  } else {
                    return 0;
                  }
                })
                .map((review) => (
                  <div key={review._id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-8 rounded-full"
                          src={review.userAvatar}
                          alt=""
                        />
                        <p className="font-medium">{review.userName}</p>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div
                          className="p-1.5 hover:bg-gray-200 rounded-full cursor-pointer"
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === review._id ? null : review._id,
                            )
                          }
                        >
                          <img
                            className="w-4"
                            src="/images/user/store/more.png"
                            alt=""
                          />
                        </div>

                        {activeMenu === review._id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded-md z-10"
                          >
                            {currentUser &&
                            currentUser._id === review.userId ? (
                              <>
                                <div
                                  className="px-3 py-1.5 flex items-center gap-2 text-sm hover:bg-gray-100 rounded-t-md cursor-pointer"
                                  onClick={() => handleEdit(review)}
                                >
                                  <img
                                    className="w-4"
                                    src="/images/user/store/edit.png"
                                    alt=""
                                  />
                                  Edit
                                </div>
                                <div
                                  className="px-3 py-1.5 flex items-center gap-2 text-sm hover:bg-gray-100 rounded-b-md cursor-pointer text-red-600"
                                  onClick={() => handleDelete(review._id)}
                                >
                                  <img
                                    className="w-4"
                                    src="/images/user/store/delete.png"
                                    alt=""
                                  />
                                  Delete
                                </div>
                              </>
                            ) : (
                              <div
                                className="px-3 py-1.5 flex items-center gap-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                                onClick={() => {
                                  handleReport(review._id);
                                  setActiveMenu(null);
                                }}
                              >
                                <img
                                  className="w-4"
                                  src="/images/user/store/report.png"
                                  alt=""
                                />
                                Report
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex gap-0">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <img
                            key={num}
                            src={
                              num <= review.rating
                                ? "/images/user/store/star-active.png"
                                : "/images/user/store/star.png"
                            }
                            className="w-4.5 h-4.5"
                            alt=""
                          />
                        ))}
                      </div>
                      <div className="flex gap-1 items-center">
                        <p className="text-sm text-gray-600">
                          reviewed on{" "}
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {review.isEdited && (
                            <span className="ml-1 text-xs italic text-gray-500">
                              (edited)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-22 h-22 object-cover rounded-md border border-gray-200 cursor-pointer"
                            onClick={() => setZoomImage(img)}
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-sm mt-3">{review.comment}</p>

                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => handleReact(review._id, "like")}
                        className={`flex items-center gap-1 p-2 ${
                          Array.isArray(review.likes) &&
                          review.likes.includes(currentUser?._id)
                            ? "bg-green-100"
                            : "hover:bg-gray-200"
                        } rounded-full cursor-pointer`}
                      >
                        <img
                          className="w-4.5"
                          src="/images/user/store/like.png"
                          alt=""
                        />
                        <p className="text-xs">
                          {Array.isArray(review.likes)
                            ? review.likes.length
                            : 0}
                        </p>
                      </div>
                      <div
                        onClick={() => handleReact(review._id, "dislike")}
                        className={`flex items-center gap-1 p-2 ${
                          Array.isArray(review.dislikes) &&
                          review.dislikes.includes(currentUser?._id)
                            ? "bg-red-100"
                            : "hover:bg-gray-200"
                        } rounded-full cursor-pointer`}
                      >
                        <img
                          className="w-4.5"
                          src="/images/user/store/dislike.png"
                          alt=""
                        />
                        <p className="text-xs">
                          {Array.isArray(review.dislikes)
                            ? review.dislikes.length
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed review"
            className="max-w-[90%] max-h-[90%] object-contain rounded-md shadow-lg"
          />
        </div>
      )}

      {showModal && (
        <ReviewModal
          review={editingReview}
          onClose={() => {
            setShowModal(false);
          }}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default ProductDetails;
