const response = (data, message = "Success") => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

const errorResponse = (message = "Error", code = "INTERNAL_ERROR") => ({
  success: false,
  code,
  message,
  timestamp: new Date().toISOString(),
});

module.exports = { response, errorResponse };
