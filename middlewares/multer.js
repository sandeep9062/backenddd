import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";



import dotenv from "dotenv";
dotenv.config();


// ✅ Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Set up CloudinaryStorage with support for images, videos and PDFs
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const imageFormats = ["jpg", "jpeg", "png", "gif"];
    const videoFormats = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
    const documentFormats = ["pdf"];
    const allowedFormats = [...imageFormats, ...videoFormats, ...documentFormats];

    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    if (!allowedFormats.includes(fileExtension)) {
      throw new Error("Unsupported file type.");
    }

    let resourceType = "image";
    if (videoFormats.includes(fileExtension)) {
      resourceType = "video";
    } else if (documentFormats.includes(fileExtension)) {
      resourceType = "raw";
    }

    return {
      folder: "DentalTourism",
      resource_type: resourceType,
      format: fileExtension,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// ✅ Create multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit for videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg", "image/png", "image/jpg", "image/gif",
      "video/mp4", "video/avi", "video/quicktime", "video/x-ms-wmv", "video/x-flv", "video/webm",
      "application/pdf"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images, videos and PDFs are allowed."));
    }
  },
});

export default upload;
