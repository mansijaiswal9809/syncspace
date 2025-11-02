import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: (req, file, cb) => {
    // unique file name: timestamp + original name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (optional: only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
