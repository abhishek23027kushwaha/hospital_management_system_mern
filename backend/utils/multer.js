import multer from "multer";

/**
 * memoryStorage — keeps file in memory as Buffer.
 * Use this with the uploadToCloudinary() helper so we can
 * stream directly to Cloudinary without touching the disk.
 */
const storage = multer.memoryStorage();

/** Accept only image files */
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"), false);
  }
};

/** Single image upload — field name: "image" */
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
}).single("image");

/** Multiple images — field name: "images", max 5 */
export const uploadImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5);

/**
 * Express middleware wrapper that handles multer errors gracefully.
 * Usage in routes:  router.post("/", handleUpload(uploadImage), controller)
 */
export const handleUpload = (uploader) => (req, res, next) => {
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

export default multer;
