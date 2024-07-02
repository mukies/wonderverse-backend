exports.ratingSchema = {
  comment: {
    notEmpty: {
      errorMessage: "Comment text is required.",
    },
    isString: {
      errorMessage: "Comment must be in string format.",
    },
  },
  rating: {
    notEmpty: {
      errorMessage: "Rating is required.",
    },
    isNumeric: {
      errorMessage: "Rating must be in numeric format.",
    },
  },
};
