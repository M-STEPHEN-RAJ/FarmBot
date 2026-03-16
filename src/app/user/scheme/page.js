"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const Scheme = () => {
  const router = useRouter();

  const [schemes, setSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceRef = useRef(null);

  const fetchSchemes = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scheme?page=${page}&search=${search}`);
      const data = await res.json();
      setSchemes(data.schemes);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching schemes:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchemes(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      setSearchTerm(value);
    });
  };

  return (
    <div className="w-full max-w-[1150px] flex flex-col pr-4 py-4">
      <div className="space-y-5">
        <h1 className="text-lg font-medium my-3">Schemes</h1>
        <div className="w-[380px] flex justify-between items-center border border-gray-300 rounded-full pl-3 pr-2 py-1.5">
          <input
            type="text"
            className="w-full outline-none"
            placeholder="search for schemes"
            onChange={handleSearchChange}
            value={searchTerm}
          />
          <img src="/images/user/store/search.png" alt="" className="w-5" />
        </div>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-8 border border-gray-300 px-8 py-4 rounded-md">
            <div className="w-25 h-25 bg-gray-200 animate-pulse mb-2 rounded-full"></div>
            <div className="w-full flex flex-col justify-between">
              <div className="w-100 h-6 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="space-y-1">
                <div className="w-full h-4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="w-100 h-4 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
              <div className="w-40 h-4 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
          ))
        ) : (
          schemes.map((scheme) => (
            <div
              key={scheme._id}
              className="flex gap-8 border border-gray-300 px-8 py-4 rounded-md"
            >
              <img
                src={scheme.imageUrl}
                alt=""
                className="w-25 h-25 object-cover mb-2 rounded-md"
              />
              <div className="flex flex-col space-y-2">
                <h2
                  onClick={() => router.push(`/user/scheme/${scheme._id}`)}
                  className="font-semibold text-lg hover:underline cursor-pointer"
                >
                  {scheme.title}
                </h2>
                <p className="text-gray-500 text-sm">
                  {scheme.shortDescription}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {scheme.views} views •{" "}
                  {new Date(scheme.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-3">
        <div
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className={`p-2 border border-gray-300 rounded-full cursor-pointer ${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <img
            className="w-5 h-5 rotate-90"
            src="/images/user/scheme/dropdown.png"
            alt=""
          />
        </div>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-full ${
              page === currentPage ? "bg-[#166831] text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <div
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          className={`p-2 border border-gray-300 rounded-full cursor-pointer ${
            currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <img
            className="w-5 h-5 -rotate-90"
            src="/images/user/scheme/dropdown.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Scheme;
