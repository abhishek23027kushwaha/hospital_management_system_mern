import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name:  process.env.CLOUD_NAME,
  api_key:     process.env.CLOUD_API_KEY,
  api_secret:  process.env.CLOUD_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer   - File buffer from multer memoryStorage
 * @param {string} folder   - Cloudinary folder name (e.g. "doctors", "services")
 * @returns {Promise<string>} secure_url of the uploaded image
 */
export const uploadToCloudinary = (buffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 * @param {string} publicId  - The public_id of the image (without extension)
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
};

export default cloudinary;
