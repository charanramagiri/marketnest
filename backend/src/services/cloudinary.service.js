const cloudinary = require("../config/cloudinary");

const uploadFilesToCloudinary = async (files = []) => {
  const imageUrls = [];

  for (const file of files) {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "marketnest-products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    imageUrls.push(uploaded.secure_url);
  }

  return imageUrls;
};

module.exports = {
  uploadFilesToCloudinary
};
