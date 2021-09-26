const multer = require("multer");

/**
 * @desc Multer middleware
 * @param {Object} storage - Storage configuration for multer
 * @return {Function} upload - Multer middleware function to upload files
 */
const storage = multer.diskStorage({
  filename(req, file, cb) {
    // Generate a unique filename
    cb(null, file.originalname);
  },
});

// Upload file  to the server 
const upload = multer({
  // Set storage size 
  limits: {
    fileSize: 1000000,
  },

  // Set file type
  fileFilter(req, file, cb) {
    // Check file type 
    if (!file.originalname.match(/\.(gif|jpg|png)$/)) {
      // Return error if file type is not supported
      return cb(new Error("please upload a valid file"));
    }
    // Return no error if file type is supported
    return cb(undefined, true);
  },
  // Set storage engine
  storage,
  // Set file name
}).single("profilePicture");

module.exports = upload;