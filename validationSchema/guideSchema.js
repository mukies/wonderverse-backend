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

  guidingDestinations: {
    notEmpty: {
      errorMessage: "Guiding Destinations is required.",
    },
    isArray: {
      errorMessage: "Guiding Destinations must be an array",
    },
    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "All items of Guiding destination array should be string",
    },
  },

  contactNumber: {
    notEmpty: {
      errorMessage: "Contact Number is required.",
    },
    isString: {
      errorMessage: "Contact Number must be in string format.",
    },
  },
  citizenshipPhoto: {
    notEmpty: {
      errorMessage: "Citizenship Photo is required.",
    },
    isArray: {
      errorMessage: "Citizenship Photos must be an array",
    },
    isLength: {
      options: { max: 2 },
      errorMessage: "More than 2 Images is not allowed",
    },
    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "Front and back side of citizenship Images must be strings",
    },
  },
  guidePhoto: {
    notEmpty: {
      errorMessage: "Guide Photo is required.",
    },
    isString: {
      errorMessage: "From field must be in string format.",
    },
  },
};
