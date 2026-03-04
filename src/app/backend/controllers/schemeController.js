import Scheme from "../models/Scheme.js";
import { uploadImage } from "@/app/utils/cloudinary.js";

// Create Scheme
export const createScheme = async (request) => {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      data.title = formData.get("title");
      data.shortDescription = formData.get("shortDescription");
      data.description = formData.get("description");
      data.officialUrl = formData.get("officialUrl");
      data.applicationProcess = JSON.parse(formData.get("applicationProcess"));
      data.benefits = JSON.parse(formData.get("benefits"));
      data.documentsRequired = JSON.parse(formData.get("documentsRequired"));
      data.eligibilityQuestions = JSON.parse(formData.get("eligibilityQuestions"));

      const image = formData.get("image");

      if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const secure_url = await uploadImage(buffer);
        data.imageUrl = secure_url;
      }

    } else {
      const body = await request.json();
      data = body;
    }

    const scheme = await Scheme.create(data);

    return new Response(JSON.stringify({ message: "Scheme created!", scheme }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Create scheme error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Fetch Schemes
export const getAllSchemes = async (request) => {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchQuery = searchParams.get("search") || "";

    const query = {
      isActive: true,
      ...(searchQuery && {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { shortDescription: { $regex: searchQuery, $options: "i" } },
        ],
      }),
    };

    const totalSchemes = await Scheme.countDocuments(query);

    const schemes = await Scheme.find(query)
      .select("title shortDescription imageUrl views createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return new Response(
      JSON.stringify({
        schemes,
        currentPage: page,
        totalPages: Math.ceil(totalSchemes / limit),
        totalSchemes,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("Get schemes error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Get Scheme by Id
export const getSchemeById = async (request, { params }) => {
  try {
    const { id } = await params;

    const scheme = await Scheme.findById(id);

    if (!scheme) {
      return new Response(JSON.stringify({ message: "Scheme not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 👁 Increment views
    scheme.views += 1;
    await scheme.save();

    return new Response(JSON.stringify({ scheme }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Get scheme error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

