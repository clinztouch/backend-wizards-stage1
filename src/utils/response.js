const successResponse = (res, statusCode, data, message = null) => {
  const response = {
    status: "success",
    ...(message && { message }),
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "error",
    message
  });
};

module.exports = { successResponse, errorResponse };