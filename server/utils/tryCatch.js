
 
/**
 * A utility function to wrap controller functions with try/catch logic
 * that handles HTTP responses.
 * 
 * @param {Function} fn - The controller function to wrap
 * @param {number} successStatus - HTTP status code for success (default: 200)
 * @param {number} errorStatus - HTTP status code for error (default: 500) 
 * @returns {Function} - A wrapped function that handles HTTP responses
 */
export const controllerTryCatch = (fn, successStatus = 200, errorStatus = 500) => {
  return async (req, res) => {
    try {
      const result = await fn(req, res);
      return res.status(successStatus).json(result);
    } catch (error) {
      return res.status(errorStatus).json({ error: error.message });
    }
  };
};
