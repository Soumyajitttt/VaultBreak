/**
 * Wraps an async Express route handler and forwards any errors to next()
 * so they are caught by the global error handler.
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default asyncHandler;
