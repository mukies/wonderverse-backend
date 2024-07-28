exports.tryCatchWrapper = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      console.log("error-->", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
};
