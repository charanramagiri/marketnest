const multer = require("multer");
const ApiError = require("../utils/ApiError");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 5
  },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      callback(new ApiError(400, "Only image uploads are allowed"));
      return;
    }

    callback(null, true);
  }
});

module.exports = upload;
