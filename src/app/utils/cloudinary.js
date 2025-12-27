import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
  secure: true,
});

export const uploadImage = async (fileBase64, folder = "") => {
  try {
    const dataUri = fileBase64.startsWith("data:") 
      ? fileBase64 
      : `data:image/png;base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      overwrite: true,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Image upload failed");
  }
};

