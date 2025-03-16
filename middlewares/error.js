// centraliser les erreurs

function createError(statusCode, message, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  return error;
}

module.exports = createError; // Export the function itself
