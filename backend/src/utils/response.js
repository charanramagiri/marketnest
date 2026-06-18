const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  if (data === null) {
    return res.status(statusCode).json({ message });
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return res.status(statusCode).json({ message, ...data });
  }

  return res.status(statusCode).json({ message, data });
};

module.exports = {
  sendSuccess
};
