exports.paginate = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};
