"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ReviewModal = ({ review, onClose, onSubmit }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setPreview(review.image || null);
    }
  }, [review]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    onSubmit({
      rating,
      comment,
      images: image ? [image] : [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-5 py-5 rounded-xl w-[500px] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {review ? "Edit Review" : "Add Review"}
          </h3>

          <div
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <img
              src="/images/user/settings/close.png"
              className="w-4 h-4"
              alt=""
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="text-sm font-medium mb-3">Upload Image (Optional)</p>

            <label
              className={`relative flex items-center justify-center h-35 rounded-md cursor-pointer ${
                preview
                  ? ""
                  : "border-2 border-dashed border-[#166831] hover:bg-gray-50"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-[130px] h-[130px] object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400 text-sm">Click to upload</span>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>

          <div>
            <div>
              <p className="text-sm font-medium mb-2">Rating</p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={
                      star <= rating
                        ? "/images/user/store/star-active.png"
                        : "/images/user/store/star.png"
                    }
                    alt="star"
                    className="w-7 h-7 cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Comment</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Write your review..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm font-medium text-white bg-[#166831] rounded-md cursor-pointer"
          >
            {review ? "Update Review" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
