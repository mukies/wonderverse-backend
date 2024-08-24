exports.faqSchema = {
  question: {
    notEmpty: {
      errorMessage: "FAQ question is required",
    },
    isString: {
      errorMessage: "FAQ question must be string",
    },
  },
  answer: {
    notEmpty: {
      errorMessage: "FAQ answer is required",
    },
    isString: {
      errorMessage: "FAQ answer must be string",
    },
  },
};
