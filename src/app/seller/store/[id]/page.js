"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import SellerLoading from "@/app/components/common/SellerLoading";
import EditProductModal from "@/app/components/seller/store/Modal/EditProductModal";

const SellerProductDetails = () => {
  const menuRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [editProduct, setEditProduct] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [reviewSort, setReviewSort] = useState("Top");
  const [filterRating, setFilterRating] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <SellerLoading />;

  return (
    <div className="w-full max-w-[1150px] flex flex-col pr-4 py-4">
      <div className="w-full flex justify-between items-start mt-3">
        <div
          onClick={() => router.push("/seller/store")}
          className="rounded-full p-2 hover:bg-gray-200 cursor-pointer"
        >
          <img className="w-5" src="/images/user/store/back.png" alt="" />
        </div>

        <div
          onClick={() => setEditProduct(product)}
          className="rounded-full p-2 hover:bg-gray-200 cursor-pointer"
        >
          <img className="w-6" src="/images/seller/store/edit.png" alt="" />
        </div>
      </div>
      <div className="w-full grid grid-cols-[2fr_3fr] gap-6">
        <div>
          <img className="w-90" src={product.image} alt="" />
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

          <div className="flex gap-8 border-b border-gray-300 pb-3"></div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">About this Item</h2>
            <p className="text-sm">{product.description}</p>
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
                      className="h-4 bg-[#EB3D3F] rounded"
                      style={{
                        width: `${
                          product.reviewCount > 0
                            ? (count / product.reviewCount) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <span className="w-13 text-xs font-medium text-[#EB3D3F]">
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
                    ? "bg-[#EB3D3F] text-white"
                    : "border border-[#EB3D3F] text-[#EB3D3F]"
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
                    ? "bg-[#EB3D3F] text-white"
                    : "border border-[#EB3D3F] text-[#EB3D3F]"
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
                          <span className="text-xs text-[#EB3D3F] bg-red-100 px-2 py-0.5 rounded-full font-medium">
                            Verified Purchase
                          </span>
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
                      <div className={`flex items-center gap-1 p-2`}>
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
                      <div className={`flex items-center gap-1 p-2`}>
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

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={() => {
            fetchProduct();
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default SellerProductDetails;
