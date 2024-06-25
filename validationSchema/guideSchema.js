exports.guideSchema = {
  tourID: {
    notEmpty: {
      errorMessage: "Tour ID is required.",
    },
    isString: {
      errorMessage: "Tour ID must be in string format.",
    },
  },
  guideName: {
    notEmpty: {
      errorMessage: "Guide name is required.",
    },
    isString: {
      errorMessage: "Guide name must be in string format.",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "Guide name must be at least 2 characters long",
    },
  },
  price: {
    notEmpty: {
      errorMessage: "Price is required.",
    },
    isNumeric: {
      errorMessage: "Price must be in numeric format.",
    },
  },
  guideDesc: {
    optional: true,
    isString: {
      errorMessage: "Description must be in string format.",
    },
    isLength: {
      options: { min: 50 },
      errorMessage: "Description must be at least 50 characters long",
    },
  },
  guideContactNumber: {
    notEmpty: {
      errorMessage: "Contact Number is required.",
    },
    isString: {
      errorMessage: "Contact Number must be in string format.",
    },
  },
  guideEmail: {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format.",
    },
  },
  guidePhoto: {
    optional: true,
    isString: {
      errorMessage: "From field must be in string format.",
    },
  },
};
