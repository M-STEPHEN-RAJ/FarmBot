"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditProductModal = ({ product, onClose, onUpdated }) => {
  const categoryRef = useRef(null);
  const typeRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    category: product.category || "Seeds",
    type: product.type || "",
    price: product.price || "",
    unit: product.unit || "",
    stock: product.stock || "",
    image: product.image || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(product.image || "https://placehold.co/250");
  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);

  const categoryOptions = ["Seeds", "Fertilizers", "Tools"];

  const getTypeOptions = (category) => {
    switch (category) {
      case "Seeds":
        return ["Vegetables", "Fruits", "Flowers", "Grains", "Pulses"];
      case "Fertilizers":
        return ["Organic", "Chemical", "Bio-Fertilizers"];
      case "Tools":
        return ["Hand Tools", "Power Tools", "Protective Gear"];
      default:
        return [];
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image!");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (imageFile) formData.append("image", imageFile);

      // Update product API
      await axios.put(`/api/seller/products/${product._id}`, formData, {
        withCredentials: true,
      });

      toast.success("Product updated successfully!");
      onUpdated(); // Callback to refresh product list
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setOpenCategory(false);
      if (typeRef.current && !typeRef.current.contains(e.target))
        setOpenType(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 pt-5 rounded-xl w-full max-w-[800px] space-y-8 mx-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Product</h3>
          <img
            src="/images/user/settings/close.png"
            className="w-4.5 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="flex items-center gap-10">
          <div>
            <img
              className="w-[250px] h-[250px] rounded-full cursor-pointer"
              src={preview}
              alt=""
              onClick={() => document.getElementById("editProductImage").click()}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              id="editProductImage"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-3">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                type="text"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Category */}
              <div ref={categoryRef} className="flex flex-col gap-1 relative">
                <label className="text-sm text-gray-700">Category</label>
                <button
                  type="button"
                  onClick={() => setOpenCategory(!openCategory)}
                  className="w-full border border-gray-300 px-3 py-1.5 rounded-md flex justify-between items-center cursor-pointer"
                >
                  {form.category || "Select Category"}
                  <img
                    src="/images/user/store/dropdown.png"
                    className={`w-4 transition ${openCategory ? "rotate-180" : ""}`}
                  />
                </button>

                {openCategory && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow z-20">
                    {categoryOptions.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setForm({ ...form, category: cat, type: "" });
                          setOpenCategory(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Type */}
              <div ref={typeRef} className="flex flex-col gap-1 relative">
                <label className="text-sm text-gray-700">Type</label>
                <button
                  type="button"
                  disabled={!form.category}
                  onClick={() => setOpenType(!openType)}
                  className="border border-gray-300 px-3 py-1.5 rounded-md flex justify-between items-center disabled:bg-gray-100 cursor-pointer"
                >
                  {form.type || "Select Type"}
                  <img
                    src="/images/user/store/dropdown.png"
                    className={`w-4 transition ${openType ? "rotate-180" : ""}`}
                  />
                </button>

                {openType && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow z-20">
                    {getTypeOptions(form.category).map((type) => (
                      <div
                        key={type}
                        onClick={() => {
                          setForm({ ...form, type });
                          setOpenType(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-5">
              {/* Price */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Price</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                  type="text"
                />
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Unit</label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                  type="text"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Stock</label>
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-fit border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <button
            onClick={onClose}
            className="text-[#EB3D3F] border border-[#EB3D3F] px-4 py-1 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-40 flex items-center justify-center bg-[#EB3D3F] text-white px-4 py-1 rounded-md cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;