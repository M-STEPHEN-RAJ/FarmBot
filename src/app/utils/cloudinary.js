import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
  secure: true,
});

export const uploadImage = async (file, folder = "") => {
  try {
    let dataUri;

    if (Buffer.isBuffer(file)) {
      const base64 = file.toString("base64");
      dataUri = `data:image/png;base64,${base64}`;
    }
    else if (typeof file === "string") {
      dataUri = file.startsWith("data:")
        ? file
        : `data:image/png;base64,${file}`;
    }
    else {
      throw new Error("Unsupported file type!");
    }

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
